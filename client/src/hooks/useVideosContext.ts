import { useContext } from "react";
import { VideosContext } from "../contexts/VideosContext/VideosContext";

export function useVideosContext() {
    const context = useContext(VideosContext);

    if (!context) {
        throw new Error("useVideosContext must be used within a VideosContextProvider");
    }

    return context;
}