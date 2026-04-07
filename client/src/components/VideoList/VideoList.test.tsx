import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VideoList from './VideoList';
import { Video } from '../../types';
import { VideosContext } from '../../contexts/VideosContext/VideosContext';

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

const defaultContextValue = {
  videos: [] as Video[],
  isLoading: false,
  error: null as string | null,
  addVideo: jest.fn(),
};

function renderWithContext(contextValue = defaultContextValue) {
  return render(
    <VideosContext.Provider value={contextValue}>
      <VideoList />
    </VideosContext.Provider>
  );
}

test('shows loading state when loading', () => {
  renderWithContext({ ...defaultContextValue, isLoading: true });
  expect(screen.getByText('Loading videos...')).toBeInTheDocument();
});

test('renders video cards after loading', () => {
  renderWithContext({ ...defaultContextValue, videos: mockVideos });
  expect(screen.getByText('First Video')).toBeInTheDocument();
  expect(screen.getByText('Second Video')).toBeInTheDocument();
});

test('shows error message on error', () => {
  renderWithContext({ ...defaultContextValue, error: 'Failed to fetch videos' });
  expect(screen.getByRole('alert')).toHaveTextContent('Error');
});

test('renders sort dropdown', () => {
  renderWithContext({ ...defaultContextValue, videos: mockVideos });
  expect(screen.getByLabelText('Sort videos')).toBeInTheDocument();
});
