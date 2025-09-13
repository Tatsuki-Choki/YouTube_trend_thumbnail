
export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface ThumbnailDetails {
  default: Thumbnail;
  medium: Thumbnail;
  high: Thumbnail;
  standard?: Thumbnail;
  maxres?: Thumbnail;
}

export interface VideoSnippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: ThumbnailDetails;
  channelTitle: string;
  tags: string[];
  categoryId: string;
  liveBroadcastContent: string;
  localized: {
    title: string;
    description: string;
  };
}

export interface YouTubeVideo {
  kind: string;
  etag: string;
  id: string;
  snippet: VideoSnippet;
}
   