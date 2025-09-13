import React, { useEffect, MouseEvent, useState } from 'react';
import type { YouTubeVideo } from '../types';

interface ModalProps {
  video: YouTubeVideo;
  onClose: () => void;
}

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);

const YouTubeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-2"} fill="currentColor" viewBox="0 0 24 24">
        <path d="M21.582,6.186c-0.23-0.854-0.908-1.532-1.762-1.762C18.254,4,12,4,12,4S5.746,4,4.18,4.424 c-0.854,0.23-1.532,0.908-1.762,1.762C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.854,0.908,1.532,1.762,1.762 C5.746,20,12,20,12,20s6.254,0,7.82-0.424c0.854-0.23,1.532-0.908,1.762-1.762C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M9.75,15.5V8.5l6.5,3.5L9.75,15.5z" />
    </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5 mr-2"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
);

const Modal: React.FC<ModalProps> = ({ video, onClose }) => {
  const [copyButtonText, setCopyButtonText] = useState('クリップボードにコピー');
  const thumbnailUrl = video.snippet.thumbnails.maxres?.url || video.snippet.thumbnails.standard?.url || video.snippet.thumbnails.high.url;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownload = async () => {
     try {
      const response = await fetch(thumbnailUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
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

  const handleCopy = async () => {
    try {
      const response = await fetch(thumbnailUrl);
      const blob = await response.blob();
      
      if (!navigator.clipboard || !window.ClipboardItem) {
        alert('お使いのブラウザはクリップボードへの画像コピーをサポートしていません。');
        setCopyButtonText('コピーできません');
        return;
      }

      const clipboardItem = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([clipboardItem]);
      
      setCopyButtonText('コピーしました！');
      setTimeout(() => {
        setCopyButtonText('クリップボードにコピー');
      }, 2000);

    } catch (error) {
      console.error('画像のコピーに失敗しました:', error);
      alert('画像のコピーに失敗しました。');
      setCopyButtonText('クリップボードにコピー');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-full overflow-y-auto flex flex-col animate-fade-in-up">
        <div className="relative">
            <img src={thumbnailUrl} alt={video.snippet.title} className="w-full rounded-t-lg aspect-video object-cover" />
             <button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-75 transition-all duration-300"
                aria-label="閉じる"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{video.snippet.title}</h2>
          <p className="text-md text-gray-600 mb-6">{video.snippet.channelTitle}</p>
          <div className="flex flex-wrap gap-3">
             <a
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300"
            >
              <YouTubeIcon />
              YouTubeで見る
            </a>
            <button
              onClick={handleDownload}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-gray-600 text-white font-semibold rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-300"
            >
              <DownloadIcon />
              ダウンロード
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center px-5 py-2.5 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300"
            >
              <CopyIcon />
              {copyButtonText}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Modal;