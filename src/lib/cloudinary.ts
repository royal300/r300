/**
 * Rewrites a stored Cloudinary delivery URL to request a right-sized,
 * auto-format/auto-quality variant. Cloudinary generates and edge-caches each
 * distinct transformation on first request, so every screen size gets its own
 * optimized asset without us pre-generating anything at upload time.
 *
 * Non-Cloudinary URLs (legacy local `/uploads/...` and seeded `/public/...`
 * assets) are returned unchanged — this is safe to wrap around any image or
 * video src in the app.
 */

const CLOUDINARY_MARKER = "/upload/";

function injectTransform(url: string, transform: string): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes(CLOUDINARY_MARKER)) {
    return url;
  }
  const idx = url.indexOf(CLOUDINARY_MARKER) + CLOUDINARY_MARKER.length;
  return `${url.slice(0, idx)}${transform}/${url.slice(idx)}`;
}

export interface ImageOptions {
  /** Target display width in CSS px. Cloudinary picks the matching device pixel ratio automatically via dpr_auto. */
  width: number;
  height?: number;
  /** 'fill' crops to exact box, 'limit' scales down without cropping or upscaling. */
  crop?: "fill" | "limit";
}

export function cldImage(url: string, { width, height, crop = "limit" }: ImageOptions): string {
  const parts = [`f_auto`, `q_auto`, `dpr_auto`, `w_${Math.round(width)}`];
  if (height) parts.push(`h_${Math.round(height)}`);
  parts.push(`c_${crop}`);
  return injectTransform(url, parts.join(","));
}

export interface VideoOptions {
  width: number;
}

/** Optimized video source: auto format (webm/mp4 per browser) + auto (bitrate-aware) quality, capped width. */
export function cldVideo(url: string, { width }: VideoOptions): string {
  return injectTransform(url, `f_auto,q_auto,w_${Math.round(width)},c_limit`);
}

/** A jpg poster frame pulled straight from a Cloudinary video URL, sized for a thumbnail/card. */
export function cldVideoPosterFromVideoUrl(videoUrl: string, width = 600): string | undefined {
  if (!videoUrl.includes("res.cloudinary.com") || !videoUrl.includes(CLOUDINARY_MARKER)) {
    return undefined;
  }
  const transformed = injectTransform(videoUrl, `so_0,f_jpg,q_auto,w_${width},c_limit`);
  // Video delivery URLs end in the original extension (e.g. .mp4); swap it for
  // .jpg so Cloudinary returns an image, not a transcoded video.
  return transformed.replace(/\.[a-zA-Z0-9]+(\?.*)?$/, ".jpg$1");
}
