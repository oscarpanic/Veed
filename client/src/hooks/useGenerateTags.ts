import { useState } from 'react';
import { generateTags } from '../api/videosApi';

interface UseGenerateTagsResult {
  tags: string[];
  isLoading: boolean;
  error: string | null;
  generate: (title: string) => Promise<void>;
}

export default function useGenerateTags(): UseGenerateTagsResult {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (title: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateTags(title);
      setTags(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate tags');
    } finally {
      setIsLoading(false);
    }
  };

  return { tags, isLoading, error, generate };
}
