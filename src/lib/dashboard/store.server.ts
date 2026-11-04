import type { SnapshotStore } from "@/lib/dashboard/types";
import type { CleanSnapshot } from "@/lib/dashboard/redact";

export const SNAPSHOT_PATH = "dashboard/snapshot.json";

export class SnapshotConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SnapshotConfigError";
  }
}

export function blobToken(): string {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() ?? "";
}

export function blobStore(token: string): SnapshotStore {
  return {
    async read() {
      const { BlobNotFoundError, get } = await import("@vercel/blob");
      try {
        const result = await get(SNAPSHOT_PATH, { access: "private", token, useCache: false });
        if (!result || result.statusCode !== 200 || !result.stream) return null;
        return JSON.parse(await new Response(result.stream).text()) as unknown;
      } catch (error) {
        if (error instanceof BlobNotFoundError) return null;
        throw error;
      }
    },
    async write(snapshot: CleanSnapshot) {
      const { put } = await import("@vercel/blob");
      await put(SNAPSHOT_PATH, JSON.stringify(snapshot), {
        access: "private",
        token,
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        cacheControlMaxAge: 60,
      });
    },
  };
}
