import { createMdxComponent, getLatestEntry } from "~/lib/changelog";
import { notFound } from "next/navigation";
import { useMDXComponents } from "~/mdx-components";

export default async function ChangelogPage() {
  const latestEntry = await getLatestEntry();

  if (!latestEntry) {
    notFound();
  }

  const components = useMDXComponents();
  const Mdx = await createMdxComponent(latestEntry.content, components);
  return <Mdx />;
}
