import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import VideoList from './VideoList';
import { Video } from '../../types';

const mockVideos: Video[] = [
  {
    id: 'v-001',
    title: 'First Video',
    thumbnail_url: 'https://picsum.photos/seed/v1/300/200',
    created_at: '2025-01-15T14:23:11Z',
    duration: 184,
    views: 1000,
    tags: ['tutorial'],
  },
  {
    id: 'v-002',
    title: 'Second Video',
    thumbnail_url: 'https://picsum.photos/seed/v2/300/200',
    created_at: '2025-01-10T09:45:22Z',
    duration: 300,
    views: 2000,
    tags: ['advanced'],
  },
];

afterEach(() => {
  jest.restoreAllMocks();
});

test('shows loading state initially', () => {
  global.fetch = jest.fn(() => new Promise(() => {})) as jest.Mock;
  render(<VideoList />);
  expect(screen.getByText('Loading videos...')).toBeInTheDocument();
});

test('renders video cards after loading', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockVideos),
    })
  ) as jest.Mock;

  render(<VideoList />);

  await waitFor(() => {
    expect(screen.getByText('First Video')).toBeInTheDocument();
    expect(screen.getByText('Second Video')).toBeInTheDocument();
  });
});

test('shows error message on fetch failure', async () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: false,
    })
  ) as jest.Mock;

  render(<VideoList />);

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent('Error');
  });
});
