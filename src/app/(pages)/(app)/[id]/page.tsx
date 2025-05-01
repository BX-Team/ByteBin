import { Metadata } from 'next';
import { lookupPaste } from '@/common/utils/paste.util';
import { defaultMetadata } from '@/common/metadata';
import { formatBytes } from '@/common/utils/string.util';
import { getRelativeTime } from '@/common/utils/date.util';
import { Footer } from '@/components/footer';
import { PasteView } from '@/components/paste-view';

type PasteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata(props: PasteProps): Promise<Metadata> {
  const id = (await props.params).id;
  const paste = await lookupPaste(id);
  if (paste == null) {
    return defaultMetadata();
  }

  const formattedId = `${paste.id}.${paste.ext}`;
  return {
    ...defaultMetadata(false),
    title: formattedId,
    openGraph: {
      title: `Paste - ${formattedId}`,
      description: `
Lines: ${paste.content.split('\n').length}
Size: ${formatBytes(paste.size)}
Language: ${paste.language}
${
  paste.expires_at
    ? `
Expires ${getRelativeTime(new Date(paste.expires_at))}`
    : ''
}
Click to view the Paste.
`,
    },
  };
}

export default async function PastePage({ params }: PasteProps) {
  const id = (await params).id;
  const paste = await lookupPaste(id, true);

  return <PasteView paste={paste} id={id} />;
}
