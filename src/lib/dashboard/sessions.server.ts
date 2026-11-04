export type LiveSession = { id: string; exp: number };

export type SessionRegistry = {
  list: () => Promise<LiveSession[]>;
  save: (sessions: LiveSession[]) => Promise<void>;
};

export const SESSION_BLOB_PATH = "dashboard/sessions.json";
const MAX_SESSIONS = 8;

export function pruneSessions(sessions: LiveSession[], now: number): LiveSession[] {
  return sessions
    .filter(
      (session) =>
        typeof session.id === "string" &&
        session.id.length > 0 &&
        typeof session.exp === "number" &&
        session.exp > now,
    )
    .slice(-MAX_SESSIONS);
}

export function memorySessions(): SessionRegistry {
  let rows: LiveSession[] = [];
  return {
    async list() {
      return rows.map((session) => ({ ...session }));
    },
    async save(next) {
      rows = next.map((session) => ({ ...session }));
    },
  };
}

export function blobSessions(token: string): SessionRegistry {
  return {
    async list() {
      const { BlobNotFoundError, get } = await import("@vercel/blob");
      try {
        const result = await get(SESSION_BLOB_PATH, {
          access: "private",
          token,
          useCache: false,
        });
        if (!result || result.statusCode !== 200 || !result.stream) return [];
        const parsed = JSON.parse(await new Response(result.stream).text()) as {
          sessions?: LiveSession[];
        };
        return Array.isArray(parsed.sessions) ? parsed.sessions : [];
      } catch (error) {
        if (error instanceof BlobNotFoundError) return [];
        throw error;
      }
    },
    async save(sessions) {
      const { put } = await import("@vercel/blob");
      await put(SESSION_BLOB_PATH, JSON.stringify({ sessions }), {
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
