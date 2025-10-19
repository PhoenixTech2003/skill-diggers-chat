import { readdir, readFile } from "fs/promises";
import { join, basename } from "path";
import matter from "gray-matter";
import { compile, evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import React from "react";
import type { MDXComponents } from "mdx/types";

export interface ChangelogEntry {
  metadata: {
    date: string;
    title: string;
    slug: string;
    summary: string;
  };
  content: string;
}

export interface ChangelogMetadata {
  date: string;
  title: string;
  slug: string;
  summary: string;
}

/**
 * Get all MDX file paths from the changelog directory
 */
export async function getChangelogFilePaths(): Promise<string[]> {
  const changelogDir = join(process.cwd(), "src", "content", "changelog");

  try {
    const files = await readdir(changelogDir);
    return files
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => join(changelogDir, file));
  } catch (error) {
    console.error("Error reading changelog directory:", error);
    return [];
  }
}

/**
 * Load a changelog entry from a file path
 */
export async function loadEntry(
  filePath: string,
): Promise<ChangelogEntry | null> {
  try {
    const fileContent = await readFile(filePath, "utf8");
    const { content, data } = matter(fileContent);

    const metadata = data as ChangelogMetadata;
    if (!metadata?.date || !metadata?.title) {
      console.warn(
        `Invalid changelog entry at ${filePath}: missing required frontmatter`,
      );
      return null;
    }

    // slug fallback from filename if not provided
    if (!metadata.slug) {
      const file = basename(filePath, ".mdx");
      metadata.slug = file;
    }

    // Store the raw markdown content, we'll compile it on demand
    return {
      metadata,
      content,
    };
  } catch (error) {
    console.error(`Error loading changelog entry from ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all changelog entries, sorted by date (newest first)
 */
export async function getAllEntries(): Promise<ChangelogEntry[]> {
  const filePaths = await getChangelogFilePaths();
  const entries = await Promise.all(filePaths.map((path) => loadEntry(path)));

  const validEntries = entries.filter(
    (entry): entry is ChangelogEntry => entry !== null,
  );

  // Sort by date (newest first)
  return validEntries.sort((a, b) => {
    const dateA = new Date(a.metadata.date);
    const dateB = new Date(b.metadata.date);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Get the latest changelog entry
 */
export async function getLatestEntry(): Promise<ChangelogEntry | null> {
  const entries = await getAllEntries();
  return entries.length > 0 ? entries[0]! : null;
}

/**
 * Get a specific changelog entry by slug
 */
export async function getEntryBySlug(
  slug: string,
): Promise<ChangelogEntry | null> {
  const entries = await getAllEntries();
  return entries.find((entry) => entry.metadata.slug === slug) || null;
}

/**
 * Get all changelog entries for the sidebar (just metadata)
 */
export async function getChangelogSidebarItems(): Promise<ChangelogMetadata[]> {
  const entries = await getAllEntries();
  return entries.map((entry) => entry.metadata);
}

/**
 * Evaluate MDX content and return a React component using the JSX runtime.
 */
type MdxEvaluateResult = {
  default: React.ComponentType<Record<string, unknown>>;
};

export async function createMdxComponent(
  content: string,
  components: MDXComponents = {},
): Promise<React.ComponentType<Record<string, unknown>>> {
  const mod = (await evaluate(content, {
    ...runtime,
    development: false,
    useMDXComponents: () => components,
  })) as MdxEvaluateResult;

  return mod.default;
}
