// Vimeo and YouTube identity parsing. Vimeo thumbnails come from saved metadata.

export type VideoProvider = 'youtube' | 'vimeo' | 'unknown'

export interface VideoInfo {
  provider: VideoProvider
  id: string
  embedUrl: string
  thumbnailUrl: string
}

export function parseVideoUrl(url: string): VideoInfo | null {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
    if (!['https:', 'http:'].includes(parsed.protocol)) return null;
  } catch { return null; }
  const host = parsed.hostname.replace(/^www\./, '');
  const parts = parsed.pathname.split('/').filter(Boolean);
  let youtubeId = '';
  if (host === 'youtu.be') youtubeId = parts[0] || '';
  else if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)) {
    youtubeId = parsed.searchParams.get('v') ||
      (['embed', 'shorts', 'live'].includes(parts[0]) ? parts[1] : '') || '';
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(youtubeId)) {
    return {
      provider: 'youtube', id: youtubeId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&color=white`,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`,
    };
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const index = parts.findIndex(part => /^\d+$/.test(part));
    if (index < 0) return null;
    const id = parts[index];
    const hash = parsed.searchParams.get('h') || parts[index + 1];
    const params = new URLSearchParams({ autoplay: '1', title: '0', byline: '0', portrait: '0', color: 'f5d0a0', dnt: '1' });
    if (hash && /^[a-zA-Z0-9]+$/.test(hash)) params.set('h', hash);
    return {
      provider: 'vimeo', id,
      embedUrl: `https://player.vimeo.com/video/${id}?${params}`,
      thumbnailUrl: '',
    };
  }

  return null;
}

export function getThumbnailFromUrl(url: string): string {
  const info = parseVideoUrl(url)
  if (!info) return ''
  return info.thumbnailUrl
}
