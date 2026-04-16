import { useCallback, useEffect, useMemo, useState } from "react";
import { VideosContext } from "./VideosContext";
import { Video } from "../../types";
import { createVideo, fetchVideos } from "../../api/videosApi";

interface IVideosContextProvider {
    children: React.ReactNode
}

export function VideosContextProvider({children}: IVideosContextProvider) {
    const [videos, setVideos] = useState<Video[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
            const fetchData = async () => {
                setIsLoading(true);
                setError(null);
    
                try {
                    const videos = await fetchVideos();
    
                    setVideos(videos);
                } catch (err) {
                    if (err instanceof Error) {
                        setError(err.message);
                    } else {
                        setError("An unknown error occurred");
                    }
                } finally {
                    setIsLoading(false);
                }
            };
    
            fetchData();
        }, []);

    const addVideo = useCallback(async (title: string, tags: string[], onSuccess?: () => void, onError?: () => void) => {    
        try{
            const newVideo = await createVideo({
                title,
                tags,
                thumbnail_url: "https://picsum.photos/seed/video1/300/200",
                duration: 120,
                views: 0,
                created_at: new Date().toISOString(),
            });

            setVideos((prevVideos) => [...prevVideos, newVideo]);
        } catch (err) {
            console.error("Failed to create video:", err);
            if (onError) {
                onError();
            }
            return;
        } finally {
            if (onSuccess) {
                onSuccess();
            }
        }
        
    }, [setVideos]);

    const contextValue = useMemo(() => ({
        videos,
        isLoading,
        error,
        addVideo,
    }), [videos, isLoading, error, addVideo]);

    return (
        <VideosContext.Provider value={contextValue}>
            {children}
        </VideosContext.Provider>
    )
}