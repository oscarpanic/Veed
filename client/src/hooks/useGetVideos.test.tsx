import { renderHook } from '@testing-library/react';
import React from 'react';
import useGetVideos from './useGetVideos';
import { VideosContext } from '../contexts/VideosContext/VideosContext';
import { Video } from '../types';

const mockVideos: Video[] = [
  {
    id: 'v-001',
    title: 'Oldest Video',
    thumbnail_url: '',
    created_at: '2025-01-01T00:00:00Z',
    duration: 100,
    views: 500,
    tags: ['a'],
  },
  {
    id: 'v-002',
    title: 'Newest Video',
    thumbnail_url: '',
    created_at: '2025-03-01T00:00:00Z',
    duration: 200,
    views: 1000,
    tags: ['b'],
  },
  {
    id: 'v-003',
    title: 'Middle Video',
    thumbnail_url: '',
    created_at: '2025-02-01T00:00:00Z',
    duration: 150,
    views: 750,
    tags: ['c'],
  },
];

const defaultContextValue = {
  videos: mockVideos,
  isLoading: false,
  error: null as string | null,
  addVideo: jest.fn(),
};

function wrapper(contextValue = defaultContextValue) {
  return ({ children }: { children: React.ReactNode }) => (
    <VideosContext.Provider value={contextValue}>
      {children}
    </VideosContext.Provider>
  );
}

test('returns videos in default order when sortBy is "default"', () => {
  const { result } = renderHook(() => useGetVideos({ sortBy: 'default' }), {
    wrapper: wrapper(),
  });

  expect(result.current.videos).toEqual(mockVideos);
});

test('returns videos sorted newest first', () => {
  const { result } = renderHook(() => useGetVideos({ sortBy: 'newest' }), {
    wrapper: wrapper(),
  });

  expect(result.current.videos[0].title).toBe('Newest Video');
  expect(result.current.videos[1].title).toBe('Middle Video');
  expect(result.current.videos[2].title).toBe('Oldest Video');
});

test('returns videos sorted oldest first', () => {
  const { result } = renderHook(() => useGetVideos({ sortBy: 'oldest' }), {
    wrapper: wrapper(),
  });

  expect(result.current.videos[0].title).toBe('Oldest Video');
  expect(result.current.videos[1].title).toBe('Middle Video');
  expect(result.current.videos[2].title).toBe('Newest Video');
});

test('defaults to "default" sort when no sortBy is provided', () => {
  const { result } = renderHook(() => useGetVideos(), {
    wrapper: wrapper(),
  });

  expect(result.current.videos).toEqual(mockVideos);
});

test('returns isLoading from context', () => {
  const { result } = renderHook(() => useGetVideos(), {
    wrapper: wrapper({ ...defaultContextValue, isLoading: true }),
  });

  expect(result.current.isLoading).toBe(true);
});

test('returns error from context', () => {
  const { result } = renderHook(() => useGetVideos(), {
    wrapper: wrapper({ ...defaultContextValue, error: 'Something went wrong' }),
  });

  expect(result.current.error).toBe('Something went wrong');
});
