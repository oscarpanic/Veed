import { use, useEffect, useMemo, useState } from "react";
import { SortOption, Video } from "../types";
import { fetchVideos } from "../api/videosApi";
import { useVideosContext } from "./useVideosContext";

interface UseGetVideosResult {
    videos: Video[];
    isLoading: boolean;
    error: string | null;
}

interface IUseGetVideosProps {
    sortBy?: SortOption;
}

export default function useGetVideos({ sortBy = "default" }: IUseGetVideosProps = {}): UseGetVideosResult {
    const { videos, isLoading, error } = useVideosContext();

    const videosResult = useMemo(() => {
        if (sortBy === "newest") {
            return [...videos].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); 
        } else if (sortBy === "oldest") {
            return [...videos].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()); 
        }
        return videos;
    }, [videos, sortBy]);

    return { videos: videosResult, isLoading, error };
}