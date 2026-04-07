import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddVideoButton from './AddVideoButton';
import { VideosContext } from '../../contexts/VideosContext/VideosContext';
import { Video } from '../../types';

const mockAddVideo = jest.fn();

const defaultContextValue = {
  videos: [] as Video[],
  isLoading: false,
  error: null as string | null,
  addVideo: mockAddVideo,
};

function renderWithContext() {
  return render(
    <VideosContext.Provider value={defaultContextValue}>
      <AddVideoButton />
    </VideosContext.Provider>
  );
}

beforeEach(() => {
  mockAddVideo.mockReset();
});

test('renders the Add Video button', () => {
  renderWithContext();
  expect(screen.getByText('Add Video')).toBeInTheDocument();
});

test('opens modal when Add Video is clicked', async () => {
  renderWithContext();

  await userEvent.click(screen.getByText('Add Video'));

  expect(screen.getByText('Add a New Video')).toBeInTheDocument();
  expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
  expect(screen.getByLabelText(/Tags/)).toBeInTheDocument();
  expect(screen.getByText('Submit')).toBeInTheDocument();
});

test('calls addVideo with title and tags on submit', async () => {
  renderWithContext();

  await userEvent.click(screen.getByText('Add Video'));

  const textboxes = screen.getAllByRole('textbox');
  const titleInput = textboxes[0];
  const tagsInput = textboxes[1];

  await userEvent.type(titleInput, 'My New Video');
  await userEvent.type(tagsInput, 'comedy, music');

  await userEvent.click(screen.getByText('Submit'));

  expect(mockAddVideo).toHaveBeenCalledTimes(1);
  expect(mockAddVideo).toHaveBeenCalledWith(
    'My New Video',
    ['comedy', 'music'],
    expect.any(Function),
    expect.any(Function)
  );
});

test('clears form and closes modal after successful submit', async () => {
  mockAddVideo.mockImplementation((_title: string, _tags: string[], onSuccess?: () => void) => {
    if (onSuccess) onSuccess();
  });

  renderWithContext();

  await userEvent.click(screen.getByText('Add Video'));
  await userEvent.type(screen.getByLabelText(/Title/), 'My New Video');
  await userEvent.click(screen.getByText('Submit'));

  await waitFor(() => {
    expect(screen.queryByText('Add a New Video')).not.toBeInTheDocument();
  });
});

test('shows success snackbar after successful submit', async () => {
  mockAddVideo.mockImplementation((_title: string, _tags: string[], onSuccess?: () => void) => {
    if (onSuccess) onSuccess();
  });

  renderWithContext();

  await userEvent.click(screen.getByText('Add Video'));
  await userEvent.type(screen.getByLabelText(/Title/), 'My New Video');
  await userEvent.click(screen.getByText('Submit'));

  await waitFor(() => {
    expect(screen.getByText('Video added successfully')).toBeInTheDocument();
  });
});

test('does not close modal if addVideo does not call onSuccess', async () => {
  mockAddVideo.mockImplementation(() => {});

  renderWithContext();

  await userEvent.click(screen.getByText('Add Video'));
  await userEvent.type(screen.getByLabelText(/Title/), 'My New Video');
  await userEvent.click(screen.getByText('Submit'));

  expect(screen.getByText('Add a New Video')).toBeInTheDocument();
});

test('submit button is disabled when title is empty', async () => {
  renderWithContext();

  await userEvent.click(screen.getByText('Add Video'));

  expect(screen.getByText('Submit').closest('button')).toBeDisabled();
});

test('shows error snackbar when onError is called', async () => {
  mockAddVideo.mockImplementation((_title: string, _tags: string[], _onSuccess?: () => void, onError?: () => void) => {
    if (onError) onError();
  });

  renderWithContext();

  await userEvent.click(screen.getByText('Add Video'));
  await userEvent.type(screen.getByLabelText(/Title/), 'My New Video');
  await userEvent.click(screen.getByText('Submit'));

  await waitFor(() => {
    expect(screen.getByText('Failed to add video')).toBeInTheDocument();
  });
});
