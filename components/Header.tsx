import React, { useState, useEffect } from 'react';

interface HeaderProps {
    initialApiKey: string;
    onApiKeySubmit: (apiKey: string) => void;
    onRefresh: () => void;
    isLoading: boolean;
    regionCode: string;
    onRegionChange: (regionCode: string) => void;
}

const countries = [
  { code: 'JP', name: '日本' },
  { code: 'US', name: 'アメリカ' },
  { code: 'GB', name: 'イギリス' },
  { code: 'KR', name: '韓国' },
  { code: 'FR', name: 'フランス' },
  { code: 'DE', name: 'ドイツ' },
  { code: 'CA', name: 'カナダ' },
  { code: 'IN', name: 'インド' },
  { code: 'BR', name: 'ブラジル' },
  { code: 'RU', name: 'ロシア' },
];

const RefreshIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
    </svg>
);


const Header: React.FC<HeaderProps> = ({ initialApiKey, onApiKeySubmit, onRefresh, isLoading, regionCode, onRegionChange }) => {
  const [localApiKey, setLocalApiKey] = useState(initialApiKey);
  const selectedCountryName = countries.find(c => c.code === regionCode)?.name || '国';

  useEffect(() => {
    setLocalApiKey(initialApiKey);
  }, [initialApiKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localApiKey.trim()) {
      onApiKeySubmit(localApiKey.trim());
    }
  };

  return (
    <header className="w-full py-4 text-center sticky top-0 bg-white/90 backdrop-blur-sm z-20 border-b border-gray-200">
      <div className="max-w-screen-2xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold">
          <span className="text-black">YouTube</span>
          <span className="text-red-600">サムネフロー</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">{selectedCountryName}の急上昇動画のサムネイルが流れ続けます</p>
        <form onSubmit={handleSubmit} className="mt-4 max-w-xl mx-auto">
            <div className="flex flex-col gap-2">
                <input
                    type="password"
                    value={localApiKey}
                    onChange={(e) => setLocalApiKey(e.target.value)}
                    placeholder="YouTube APIキーを入力"
                    className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-300"
                    aria-label="YouTube APIキー"
                />
                <div className="flex items-center gap-2">
                    <select
                        value={regionCode}
                        onChange={(e) => onRegionChange(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-300 bg-white"
                        aria-label="国を選択"
                    >
                        {countries.map(country => (
                        <option key={country.code} value={country.code}>{country.name}</option>
                        ))}
                    </select>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300 disabled:bg-gray-400 whitespace-nowrap"
                        disabled={!localApiKey.trim()}
                    >
                        読み込み
                    </button>
                    <button
                        type="button"
                        onClick={onRefresh}
                        disabled={isLoading}
                        className="p-2.5 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="サムネイルを更新"
                    >
                        <RefreshIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>
        </form>
      </div>
    </header>
  );
};

export default Header;