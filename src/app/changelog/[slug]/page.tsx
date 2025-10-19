import { createMdxComponent, getEntryBySlug } from "~/lib/changelog";
import { notFound } from "next/navigation";
import { useMDXComponents } from "~/mdx-components";

interface ChangelogSlugPageProps {
  params: {
    slug: string;
  };
}

export default async function ChangelogSlugPage({
  params,
}: ChangelogSlugPageProps) {
  const entry = await getEntryBySlug(params.slug);

  if (!entry) {
    notFound();
  }

  const components = useMDXComponents();
  const Mdx = await createMdxComponent(entry.content, components);
  return <Mdx />;
}
