import React from 'react';
import type { YouTubeVideo } from '../types';

interface ThumbnailCardProps {
  video: YouTubeVideo;
  onClick: (video: YouTubeVideo) => void;
}

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const ThumbnailCard: React.FC<ThumbnailCardProps> = ({ video, onClick }) => {
  // 高解像度のサムネイルを優先的に選択
  const thumbnailUrl = video.snippet.thumbnails.maxres?.url || 
                       video.snippet.thumbnails.standard?.url || 
                       video.snippet.thumbnails.high.url;

  const handleDownload = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const response = await fetch(thumbnailUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      // ファイル名を動画IDから生成
      a.download = `${video.id}_thumbnail.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('サムネイルのダウンロードに失敗しました:', error);
      alert('サムネイルのダウンロードに失敗しました。');
    }
  };

  return (
    <div 
      className="relative aspect-video group/card overflow-hidden rounded-lg shadow-lg transition-transform duration-300 ease-in-out hover:!scale-110 hover:z-10 cursor-pointer"
      onClick={() => onClick(video)}
    >
      <div
        className="block w-full h-full"
      >
        <img
          src={thumbnailUrl}
          alt={video.snippet.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover/card:bg-opacity-60 transition-all duration-300 flex flex-col justify-between p-3 text-white">
          <div className="opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
            <h3 className="font-bold text-sm drop-shadow-lg">{video.snippet.title}</h3>
            <p className="text-xs text-gray-300 drop-shadow-md">{video.snippet.channelTitle}</p>
          </div>
          <button
            onClick={handleDownload}
            className="absolute top-2 right-2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 hover:scale-110 transition-all duration-300 opacity-0 group-hover/card:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-red-500"
            aria-label="サムネイルをダウンロード"
          >
            <DownloadIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailCard;