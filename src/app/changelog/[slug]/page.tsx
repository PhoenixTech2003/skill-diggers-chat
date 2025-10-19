import { createMdxComponent, getEntryBySlug } from "~/lib/changelog";
import { notFound } from "next/navigation";
import { useMDXComponents } from "~/mdx-components";

interface ChangelogSlugPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ChangelogSlugPage({
  params,
}: ChangelogSlugPageProps) {
  const slug = (await params).slug;
  const entry = await getEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const components = useMDXComponents();
  const Mdx = await createMdxComponent(entry.content, components);
  return <Mdx />;
}
