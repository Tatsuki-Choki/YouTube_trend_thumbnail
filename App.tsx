import React, { useState, useEffect, useCallback } from 'react';
import { fetchTrendingVideos } from './services/youtubeService';
import type { YouTubeVideo } from './types';
import ThumbnailCard from './components/ThumbnailCard';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import Modal from './components/Modal';

const App: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [regionCode, setRegionCode] = useState<string>('JP');
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    const storedApiKey = localStorage.getItem('youtubeApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
  }, []);

  const getVideos = useCallback(async () => {
    if (!apiKey) {
      setVideos([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const trendingVideos = await fetchTrendingVideos(apiKey, regionCode);
      // Duplicate the videos to create a seamless loop for the animation
      setVideos([...trendingVideos, ...trendingVideos]);
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('has not been used') || err.message.includes('disabled')) {
          setError('APIキーが無効か、YouTube Data API v3が有効になっていません。Google CloudコンソールでAPIを有効にしてから、再度お試しください。');
        } else {
          setError(err.message);
        }
      } else {
        setError('不明なエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  }, [apiKey, regionCode]);

  useEffect(() => {
    getVideos();
  }, [getVideos]);

  const handleApiKeySubmit = (newApiKey: string) => {
    localStorage.setItem('youtubeApiKey', newApiKey);
    setApiKey(newApiKey);
  };
  
  const handleThumbnailClick = (video: YouTubeVideo) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  const renderContent = () => {
    if (loading && videos.length === 0) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <div className="text-center text-red-700 text-lg mt-20 p-4 bg-red-100 border border-red-300 rounded-lg max-w-2xl mx-auto">{error}</div>;
    }

    if (!apiKey) {
        return (
            <div className="text-center text-gray-600 mt-20 p-6 bg-gray-50 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-2">ようこそ！</h2>
                <p>ヘッダーの入力欄にYouTube APIキーを入力して「読み込み」ボタンを押してください。</p>
            </div>
        );
    }

    if (videos.length === 0 && !loading) {
      return <div className="text-center text-gray-500 mt-20">ビデオが見つかりませんでした。APIキーが正しいか確認するか、更新ボタンを押してください。</div>;
    }

    return (
      <div className="w-full h-[calc(100vh-180px)] overflow-hidden relative" style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}>
        <div className="absolute top-0 left-0 w-full h-full animate-scroll-up group">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
            {videos.map((video, index) => (
              <ThumbnailCard key={`${video.id}-${index}`} video={video} onClick={handleThumbnailClick} />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col items-center">
      <Header 
        onApiKeySubmit={handleApiKeySubmit} 
        initialApiKey={apiKey || ''} 
        onRefresh={getVideos}
        isLoading={loading}
        regionCode={regionCode}
        onRegionChange={setRegionCode}
      />
      <main className="w-full max-w-screen-2xl mx-auto flex-grow flex flex-col items-center justify-center px-4">
        {renderContent()}
      </main>
      {selectedVideo && <Modal video={selectedVideo} onClose={handleCloseModal} />}
    </div>
  );
};

export default App;