export class videoUtils {
    // Helper functions for media handling
static getGoogleDriveEmbedUrl = (url: string) => {
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (fileIdMatch) {
    return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
  }
  return url;
};

static getYoutubeEmbedUrl = (url: string) => {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
  );
  if (videoIdMatch) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
  }
  return url;
};

static getVimeoEmbedUrl = (url: string) => {
  const videoIdMatch = url.match(/vimeo\.com\/(\d+)/);
  if (videoIdMatch) {
    return `https://player.vimeo.com/video/${videoIdMatch[1]}`;
  }
  return url;
};

static getMediaElement = (url: string) => {
  const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const videoExtensions = [".mp4", ".webm", ".ogg"];

  if (imageExtensions.some((ext) => url.toLowerCase().endsWith(ext))) {
    return { type: "image", src: url };
  }
  if (videoExtensions.some((ext) => url.toLowerCase().endsWith(ext))) {
    return { type: "video", src: url };
  }
  if (url.includes("drive.google.com")) {
    return { type: "iframe", src: this.getGoogleDriveEmbedUrl(url) };
  }
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return { type: "iframe", src: this.getYoutubeEmbedUrl(url) };
  }
  if (url.includes("vimeo.com")) {
    return { type: "iframe", src: this.getVimeoEmbedUrl(url) };
  }
  return { type: "iframe", src: url };
};
}