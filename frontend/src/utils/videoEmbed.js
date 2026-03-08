/**
 * Convert video URLs to embeddable format for iframe playback.
 * Supports YouTube (watch, shorts) and Google Drive.
 */
export function getEmbedUrl(url) {
  if (!url || typeof url !== "string") return url;

  const trimmed = url.trim();

  // YouTube: watch, shorts, youtu.be
  const youtubeWatch = trimmed.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (youtubeWatch) {
    return `https://www.youtube.com/embed/${youtubeWatch[1]}`;
  }

  const youtubeShorts = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (youtubeShorts) {
    return `https://www.youtube.com/embed/${youtubeShorts[1]}`;
  }

  const youtubeShort = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (youtubeShort) {
    return `https://www.youtube.com/embed/${youtubeShort[1]}`;
  }

  const youtubeEmbed = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (youtubeEmbed) {
    return trimmed; // already embed
  }

  // Google Drive: file links
  const driveFile = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFile) {
    return `https://drive.google.com/file/d/${driveFile[1]}/preview`;
  }

  const driveOpen = trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveOpen) {
    return `https://drive.google.com/file/d/${driveOpen[1]}/preview`;
  }

  // Already embed URL or unsupported - return as-is
  return trimmed;
}

/**
 * Get thumbnail URL for YouTube videos. Returns null for non-YouTube.
 */
export function getYoutubeThumbnail(url) {
  if (!url || typeof url !== "string") return null;

  let videoId = null;
  const watch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  const shorts = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  const embed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);

  videoId = watch?.[1] || shorts?.[1] || short?.[1] || embed?.[1];
  if (!videoId) return null;

  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
