import React, { useEffect, useState } from 'react';
import VideoCard from '../VideoCard/VideoCard';
import useGetVideos from '../../hooks/useGetVideos';
import './VideoList.css';
import { SortOption } from '../../types';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export default function VideoList(): React.ReactElement {
  const [sortOrder, setSortOrder] = useState<SortOption>();
  const { videos, isLoading, error } = useGetVideos({ sortBy: sortOrder });

  if (isLoading) return <p>Loading videos...</p>;
  if (error) return <p role="alert">Error: {error}</p>;

  return (
    <>
    <div className="video-list-header">
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="sort-dropdown-label">
          Sort by:
        </InputLabel> 
        <Select
          labelId='sort-dropdown-label'
          label='Sort by'
          id="sort-dropdown"
          aria-label="Sort videos"
          value={sortOrder}
          variant='standard'
          onChange={(e) => setSortOrder(e.target.value as SortOption)}
        >
          <MenuItem  value="newest">Newest</MenuItem >
          <MenuItem  value="oldest">Oldest</MenuItem >
          <MenuItem  value="default">Default</MenuItem >
        </Select>
      </FormControl >
      </div>

      <div className="video-list">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </>
  );
};
