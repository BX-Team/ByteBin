'use client';

import { useSearchParams } from 'next/navigation';
import { FormEvent, Suspense, useEffect, useState } from 'react';
import { usePasteExpiry } from '@/providers/paste-expiry-provider';
import { toast } from 'sonner';
import { getPaste, uploadPaste } from '@/common/api';
import { Config } from '@/common/config';
import { Footer } from '@/components/footer';
import { MonacoEditor } from '@/components/monaco-editor';
import { ThemeProvider } from '@/providers/theme-provider';

export default function PasteCreatePage() {
  return (
    <ThemeProvider>
      <Suspense>
        <Page />
      </Suspense>
    </ThemeProvider>
  );
}

function Page() {
  const searchParams = useSearchParams();
  const { expiry } = usePasteExpiry();

  const duplicate = searchParams.get('duplicate');
  const [content, setContent] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('plain');

  useEffect(() => {
    if (duplicate && content == '') {
      getPaste(duplicate).then(paste => {
        const newPage = '/';
        const newState = { page: newPage };
        window.history.replaceState(newState, '', newPage);
        setContent(paste.content);
        setSelectedLanguage(paste.language.toLowerCase());
      });
    }
  }, [content, duplicate]);

  /**
   * Creates a new paste.
   *
   * @param event
   */
  async function createPaste(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (content == null || content.length == 0) {
      toast.error('Paste cannot be empty');
      return;
    }

    const { paste, error } = await uploadPaste(content, expiry, selectedLanguage);
    if (error !== null || paste == null) {
      toast.error('Failed to create your paste :(');
      return;
    }

    toast.success('Paste created successfully, copied to clipboard!');
    await navigator.clipboard.writeText(`${Config.siteUrl}/${paste.id}`);
    window.location.href = `/${paste.id}`;
  }

  return (
    <form
      onSubmit={async event => {
        event.preventDefault();
        await createPaste(event);
      }}
      className='flex flex-col h-full grow gap-1 w-full'
    >
      <MonacoEditor content={content} onChange={setContent} language={selectedLanguage} />

      <Footer
        editDetails={{
          content: content,
          lines: content.length == 0 ? 0 : content.split('\n').length,
          words: content.length == 0 ? 0 : content.split(' ').length,
          characters: content.length == 0 ? 0 : content.split('').length,
        }}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
      />
    </form>
  );
}
