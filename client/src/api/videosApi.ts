import { Video } from '../types';

const API_BASE = '/api/videos';

export async function fetchVideos(): Promise<Video[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch videos');
  return res.json();
}

export async function fetchVideo(id: string): Promise<Video> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error('Video not found');
  return res.json();
}

export async function createVideo(video: Omit<Video, 'id'>): Promise<Video> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(video),
  });
  if (!res.ok) throw new Error('Failed to create video');
  return res.json();
}

export async function updateVideo(id: string, video: Partial<Video>): Promise<Video> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(video),
  });
  if (!res.ok) throw new Error('Failed to update video');
  return res.json();
}

export async function deleteVideo(id: string): Promise<Video> {
  const res = await fetch(`${API_BASE}/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete video');
  return res.json();
}
