import { createContext } from "react";
import { Video } from "../../types";

export const VideosContext = createContext({
    videos: [] as Video[],
    isLoading: false,
    error: null as string | null,
    addVideo: (title: string, tags: string[], onSuccess?: () => void, onError?: () => void) => {},
})

