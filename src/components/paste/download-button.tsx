'use client';

import { Paste } from '@/types/paste';
import { Button } from '@/components/button';
import { downloadFile } from '@/common/utils/browser.util';
import { fileExtensions } from '@/common/utils/lang.util';

export function DownloadPasteButton({ paste }: { paste: Paste }) {
  const getFileName = (paste: Paste) => {
    if (paste.language.toLowerCase() === 'dockerfile') return 'Dockerfile';
    const extension = fileExtensions[paste.language.toLowerCase()] || 'txt';
    return `${paste.id}.${extension}`;
  };

  return <Button onClick={() => downloadFile(getFileName(paste), paste.content)}>Download</Button>;
}
