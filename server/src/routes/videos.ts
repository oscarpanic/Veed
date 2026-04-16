import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Video, VideosData } from '../types';
import { GoogleGenAI } from "@google/genai";

const router = Router();
const dataPath = path.join(__dirname, '..', '..', 'data', 'videos.json');

function readVideos(): VideosData {
  const raw = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(raw);
}

function writeVideos(data: VideosData): void {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/videos - list all videos
router.get('/', (_req: Request, res: Response) => {
  const data = readVideos();
  res.json(data.videos);
});

// GET /api/videos/generate-tags - generate tags from a title
router.get('/generate-tags', async (req: Request, res: Response) => {
  const { title } = req.query;
  if (!title || typeof title !== 'string') {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const ai = new GoogleGenAI({});

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate exactly 3 relevant tags for a video with the title: "${title}". Return only the 3 tags separated by commas, nothing else.`,
  });

  const text = response.text ?? '';
  const tags = text.split(',').map(tag => tag.trim().toLowerCase()).filter(Boolean).slice(0, 3);

  res.json({ tags });
});

// GET /api/videos/:id - get a single video
router.get('/:id', (req: Request, res: Response) => {
  const data = readVideos();
  const video = data.videos.find((v) => v.id === req.params.id);
  if (!video) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }
  res.json(video);
});

// POST /api/videos - add a new video
router.post('/', (req: Request, res: Response) => {
  const data = readVideos();
  const newVideo: Video = {
    id: req.body.id || `v-${String(data.videos.length + 1).padStart(3, '0')}`,
    title: req.body.title,
    thumbnail_url: req.body.thumbnail_url || '',
    created_at: req.body.created_at || new Date().toISOString(),
    duration: req.body.duration || 0,
    views: req.body.views || 0,
    tags: req.body.tags || [],
  };
  data.videos.push(newVideo);
  writeVideos(data);
  res.status(201).json(newVideo);
});

// PUT /api/videos/:id - update a video
router.put('/:id', (req: Request, res: Response) => {
  const data = readVideos();
  const index = data.videos.findIndex((v) => v.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }
  data.videos[index] = { ...data.videos[index], ...req.body, id: req.params.id };
  writeVideos(data);
  res.json(data.videos[index]);
});

// DELETE /api/videos/:id - delete a video
router.delete('/:id', (req: Request, res: Response) => {
  const data = readVideos();
  const index = data.videos.findIndex((v) => v.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ error: 'Video not found' });
    return;
  }
  const [removed] = data.videos.splice(index, 1);
  writeVideos(data);
  res.json(removed);
});

export default router;
