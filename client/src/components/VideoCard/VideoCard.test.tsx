import React from 'react';
import { render, screen } from '@testing-library/react';
import VideoCard from './VideoCard';
import { Video } from '../../types';

const mockVideo: Video = {
  id: 'v-001',
  title: 'Test Video Title',
  thumbnail_url: 'https://picsum.photos/seed/test/300/200',
  created_at: '2025-01-15T14:23:11Z',
  duration: 184,
  views: 12453,
  tags: ['tutorial', 'beginner'],
};

test('renders video title', () => {
  render(<VideoCard video={mockVideo} />);
  expect(screen.getByText('Test Video Title')).toBeInTheDocument();
});

test('renders video thumbnail', () => {
  render(<VideoCard video={mockVideo} />);
  const img = screen.getByAltText('Test Video Title');
  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', mockVideo.thumbnail_url);
});

test('renders formatted duration', () => {
  render(<VideoCard video={mockVideo} />);
  expect(screen.getByText('3:04')).toBeInTheDocument();
});

test('renders view count', () => {
  render(<VideoCard video={mockVideo} />);
  expect(screen.getByText('12,453 views')).toBeInTheDocument();
});

test('renders tags', () => {
  render(<VideoCard video={mockVideo} />);
  expect(screen.getByText('tutorial')).toBeInTheDocument();
  expect(screen.getByText('beginner')).toBeInTheDocument();
});
