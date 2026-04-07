import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VideosContextProvider } from './VideosContextProvider';
import { VideosContext } from './VideosContext';
import { useContext } from 'react';
import { Video } from '../../types';

const mockVideos: Video[] = [
  {
    id: 'v-001',
    title: 'Test Video',
    thumbnail_url: 'https://picsum.photos/seed/v1/300/200',
    created_at: '2025-01-15T00:00:00Z',
    duration: 100,
    views: 500,
    tags: ['tutorial'],
  },
];

beforeEach(() => {
  jest.restoreAllMocks();
});

function TestConsumer() {
  const { videos, isLoading, error, addVideo } = useContext(VideosContext);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}
      <ul>
        {videos.map((v) => (
          <li key={v.id}>{v.title}</li>
        ))}
      </ul>
      <button onClick={() => addVideo('New Video', ['tag1'])}>Add</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <VideosContextProvider>
      <TestConsumer />
    </VideosContextProvider>
  );
}

test('fetches and provides videos on mount', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockVideos),
    })
  ) as jest.Mock;

  renderWithProvider();

  expect(screen.getByText('Loading...')).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText('Test Video')).toBeInTheDocument();
  });

  expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
});

test('sets error when fetch fails', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({ ok: false })
  ) as jest.Mock;

  renderWithProvider();

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('Failed to fetch videos');
  });
});

test('sets error when fetch throws', async () => {
  global.fetch = jest.fn(() =>
    Promise.reject(new Error('Network error'))
  ) as jest.Mock;

  renderWithProvider();

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('Network error');
  });
});

test('addVideo creates a video and appends it to the list', async () => {
  const createdVideo: Video = {
    id: 'v-002',
    title: 'New Video',
    thumbnail_url: 'https://picsum.photos/seed/video1/300/200',
    created_at: '2025-04-07T00:00:00Z',
    duration: 120,
    views: 0,
    tags: ['tag1'],
  };

  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockVideos),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(createdVideo),
    }) as jest.Mock;

  renderWithProvider();

  await waitFor(() => {
    expect(screen.getByText('Test Video')).toBeInTheDocument();
  });

  await userEvent.click(screen.getByText('Add'));

  await waitFor(() => {
    expect(screen.getByText('New Video')).toBeInTheDocument();
  });

  expect(screen.getByText('Test Video')).toBeInTheDocument();
});

test('addVideo calls onSuccess callback', async () => {
  const onSuccess = jest.fn();

  function TestConsumerWithCallback() {
    const { videos, isLoading, addVideo } = useContext(VideosContext);
    return (
      <div>
        {isLoading && <p>Loading...</p>}
        <ul>
          {videos.map((v) => (
            <li key={v.id}>{v.title}</li>
          ))}
        </ul>
        <button onClick={() => addVideo('New Video', ['tag1'], onSuccess)}>Add</button>
      </div>
    );
  }

  const createdVideo: Video = {
    id: 'v-002',
    title: 'New Video',
    thumbnail_url: '',
    created_at: '2025-04-07T00:00:00Z',
    duration: 120,
    views: 0,
    tags: ['tag1'],
  };

  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockVideos),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(createdVideo),
    }) as jest.Mock;

  render(
    <VideosContextProvider>
      <TestConsumerWithCallback />
    </VideosContextProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Test Video')).toBeInTheDocument();
  });

  await userEvent.click(screen.getByText('Add'));

  await waitFor(() => {
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });
});

test('addVideo handles creation failure gracefully', async () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockVideos),
    })
    .mockResolvedValueOnce({
      ok: false,
    }) as jest.Mock;

  renderWithProvider();

  await waitFor(() => {
    expect(screen.getByText('Test Video')).toBeInTheDocument();
  });

  await userEvent.click(screen.getByText('Add'));

  // Original video still present, no new one added
  await waitFor(() => {
    expect(consoleSpy).toHaveBeenCalled();
  });

  expect(screen.queryByText('New Video')).not.toBeInTheDocument();
  expect(screen.getByText('Test Video')).toBeInTheDocument();

  consoleSpy.mockRestore();
});

test('addVideo calls onError callback on failure', async () => {
  const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  const onError = jest.fn();

  function TestConsumerWithErrorCallback() {
    const { videos, isLoading, addVideo } = useContext(VideosContext);
    return (
      <div>
        {isLoading && <p>Loading...</p>}
        <ul>
          {videos.map((v) => (
            <li key={v.id}>{v.title}</li>
          ))}
        </ul>
        <button onClick={() => addVideo('New Video', ['tag1'], undefined, onError)}>Add</button>
      </div>
    );
  }

  global.fetch = jest.fn()
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockVideos),
    })
    .mockResolvedValueOnce({
      ok: false,
    }) as jest.Mock;

  render(
    <VideosContextProvider>
      <TestConsumerWithErrorCallback />
    </VideosContextProvider>
  );

  await waitFor(() => {
    expect(screen.getByText('Test Video')).toBeInTheDocument();
  });

  await userEvent.click(screen.getByText('Add'));

  await waitFor(() => {
    expect(onError).toHaveBeenCalledTimes(1);
  });

  consoleSpy.mockRestore();
});
