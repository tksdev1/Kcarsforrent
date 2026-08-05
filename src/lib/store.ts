import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * A tiny JSON document store.
 *
 * In production on Netlify this is backed by Netlify Blobs — no database to
 * provision, no connection string, and it persists across deploys. When the
 * Blobs environment isn't available (plain `next dev` on a laptop, or CI) it
 * transparently falls back to JSON files under `.data/`, which is gitignored.
 */
export interface JsonStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
}

const STORE_NAME = "kcarsforrent";

class BlobsStore implements JsonStore {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private store: any) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.store.get(key, { type: "json" });
    return (value ?? null) as T | null;
  }

  async set<T>(key: string, value: T): Promise<void> {
    await this.store.setJSON(key, value);
  }

  async remove(key: string): Promise<void> {
    await this.store.delete(key);
  }

  async list(prefix: string): Promise<string[]> {
    const { blobs } = await this.store.list({ prefix });
    return (blobs as { key: string }[]).map((b) => b.key);
  }
}

class FileStore implements JsonStore {
  private root = path.join(process.cwd(), ".data");

  private file(key: string) {
    // Keys use "/" as a namespace separator; keep that as a directory layout.
    return path.join(this.root, `${key}.json`);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await fs.readFile(this.file(key), "utf8");
      return JSON.parse(raw) as T;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw err;
    }
  }

  async set<T>(key: string, value: T): Promise<void> {
    const target = this.file(key);
    await fs.mkdir(path.dirname(target), { recursive: true });
    // Write-then-rename so a crash mid-write can't truncate existing data.
    const tmp = `${target}.${process.pid}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf8");
    await fs.rename(tmp, target);
  }

  async remove(key: string): Promise<void> {
    try {
      await fs.unlink(this.file(key));
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  }

  async list(prefix: string): Promise<string[]> {
    const dir = path.join(this.root, prefix);
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      return entries
        .filter((e) => e.isFile() && e.name.endsWith(".json"))
        .map((e) => `${prefix}${e.name.replace(/\.json$/, "")}`);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
      throw err;
    }
  }
}

let cached: JsonStore | null = null;

export function getStore(): JsonStore {
  if (cached) return cached;

  try {
    // Imported lazily so local dev never pays for it, and so a missing Blobs
    // environment surfaces here as a catchable error rather than at call time.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getStore: getBlobStore } = require("@netlify/blobs");
    const store = getBlobStore({ name: STORE_NAME, consistency: "strong" });
    cached = new BlobsStore(store);
  } catch {
    cached = new FileStore();
  }

  return cached;
}
