import type { YouTubeVideo } from '../types';

const API_URL = 'https://www.googleapis.com/youtube/v3/videos';

export const fetchTrendingVideos = async (apiKey: string, regionCode: string): Promise<YouTubeVideo[]> => {
  if (!apiKey) {
    throw new Error('YouTube APIキーが設定されていません。');
  }
  
  const params = new URLSearchParams({
    part: 'snippet',
    chart: 'mostPopular',
    regionCode: regionCode,
    maxResults: '50',
    key: apiKey,
  });

  try {
    const response = await fetch(`${API_URL}?${params.toString()}`);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('YouTube API Error:', errorData);
      throw new Error(`APIエラーが発生しました: ${errorData.error.message}`);
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Fetching trending videos failed:', error);
    if (error instanceof Error) {
        throw new Error(`動画の取得に失敗しました。ネットワーク接続を確認するか、APIキーが正しいか確認してください。 Details: ${error.message}`);
    }
    throw new Error('動画の取得中に不明なエラーが発生しました。');
  }
};