'use client';

import { MonacoEditor } from '@/components/monaco-editor';
import { ThemeProvider } from '@/providers/theme-provider';
import { Footer } from '@/components/footer';
import { Paste } from '@/types/paste';
import { useState } from 'react';

interface PasteViewProps {
  paste: Paste | null;
  id: string;
}

export function PasteView({ paste, id }: PasteViewProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(paste?.language?.toLowerCase() || 'plain');

  const handleLanguageChange = (newLanguage: string) => {
    setSelectedLanguage(newLanguage);
  };

  return (
    <ThemeProvider>
      <main className='flex flex-col gap-1 h-full grow'>
        <div className='overflow-x-auto h-full flex grow w-full text-sm'>
          {paste ? (
            <MonacoEditor content={paste.content} language={selectedLanguage} readOnly={true} onChange={() => {}} />
          ) : (
            <div className='text-center w-full items-center mt-5'>
              <p className='text-xl text-red-400'>404</p>
              <p>Paste &#39;{id}&#39; not found, maybe it expired?</p>
            </div>
          )}
        </div>

        {paste && (
          <Footer
            paste={{ ...paste, language: selectedLanguage }}
            onLanguageChange={handleLanguageChange}
            selectedLanguage={selectedLanguage}
          />
        )}
      </main>
    </ThemeProvider>
  );
}
