import { v2 as cloudinary } from "cloudinary";

const CLOUD_NAME = process.env["CLOUDINARY_CLOUD_NAME"];
const API_KEY = process.env["CLOUDINARY_API_KEY"];
const API_SECRET = process.env["CLOUDINARY_API_SECRET"];

export const isCloudinaryConfigured = Boolean(CLOUD_NAME && API_KEY && API_SECRET);

if (CLOUD_NAME && API_KEY && API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  resourceType: "image" | "video";
  format: string;
  width?: number;
  height?: number;
  duration?: number;
  bytes: number;
  // Auto-generated poster frame for videos (first frame, optimized), undefined for images.
  posterUrl?: string;
}

/**
 * Uploads a file buffer to Cloudinary. Images are eagerly capped to a sane max
 * dimension (Cloudinary still serves the original via transformations, this just
 * avoids storing/serving absurdly large source files). Delivery-time
 * optimization (format/quality/responsive sizing) happens via URL transforms —
 * see src/lib/cloudinary.ts — not here.
 */
export function uploadToCloudinary(
  buffer: Buffer,
  opts: { folder: string; resourceType: "image" | "video"; filenameHint?: string },
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured) {
    return Promise.reject(
      new Error(
        "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.",
      ),
    );
  }

  const uploadOptions: Record<string, unknown> = {
    folder: `royal300/${opts.folder}`,
    resource_type: opts.resourceType,
    use_filename: Boolean(opts.filenameHint),
    filename_override: opts.filenameHint,
    unique_filename: true,
    overwrite: false,
    // SDK default is 60s per HTTP request, too short for a slow connection
    // uploading a multi-chunk video. Give video uploads more room.
    timeout: opts.resourceType === "video" ? 600_000 : 60_000,
  };

  if (opts.resourceType === "video") {
    // 6MB chunking threshold for faster streaming delivery to Cloudinary
    uploadOptions["chunk_size"] = 6_000_000;
  }

  if (opts.resourceType === "image") {
    // Store at a sensible upper bound; per-placement sizing happens on delivery.
    uploadOptions["transformation"] = [{ width: 2400, height: 2400, crop: "limit" }];
  }

  return new Promise((resolve, reject) => {
    const onDone = (error: unknown, result: any) => {
      if (error || !result) {
        reject(error || new Error("Cloudinary upload returned no result"));
        return;
      }

      const posterUrl =
        opts.resourceType === "video"
          ? cloudinary.url(result.public_id, {
              resource_type: "video",
              format: "jpg",
              transformation: [{ start_offset: "0", width: 800, crop: "limit", quality: "auto" }],
              secure: true,
            })
          : undefined;

      resolve({
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: opts.resourceType,
        format: result.format,
        width: result.width,
        height: result.height,
        duration: result["duration"],
        bytes: result.bytes,
        ...(posterUrl ? { posterUrl } : {}),
      });
    };

    // Cloudinary's regular upload endpoint caps a single request at 10MB on
    // this account's plan — every video needs a chunked upload instead.
    //
    // NOTE: this package also exports `upload_large_stream`, which its .d.ts
    // documents with the same (options, callback) signature as upload_stream
    // — but the v2 API surface never actually adapts it (see
    // node_modules/cloudinary/lib/v2/uploader.js's v1_adapters() call), so at
    // runtime it's `undefined` on `cloudinary.uploader`. `upload_chunked_stream`
    // is the underlying chunking engine and the one that's actually properly
    // exposed on v2, so use that instead. Verified against cloudinary@2.11.0.
    const stream =
      opts.resourceType === "video"
        ? cloudinary.uploader.upload_chunked_stream(uploadOptions, onDone)
        : cloudinary.uploader.upload_stream(uploadOptions, onDone);

    stream.end(buffer);
  });
}
