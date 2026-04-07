import React from 'react';
import { Video } from '../../types';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './VideoCard.css';

interface VideoCardProps {
  video: Video;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export default function VideoCard({ video }: VideoCardProps): React.ReactElement {
  const { created_at: createdAt, thumbnail_url: thumbnailURL, title, duration, views, tags } = video;

  return (
    <div className="video-card" data-testid={`video-card-${video.id}`}>
      <img
        src={thumbnailURL}
        alt={title}
        className="video-thumbnail"
      />
      <div className="video-info">
        <h3 className="video-title">{title}</h3>
        <p className="video-meta">
          <span className='views'>
            <VisibilityIcon /> 
            {views.toLocaleString()}
          </span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
          <span>{formatDuration(duration)}</span>
        </p>
        <div className="video-tags">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
