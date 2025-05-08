import Link from 'next/link';
import { ReactNode, useState } from 'react';
import { Paste } from '@/types/paste';
import { formatBytes, formatNumber } from '@/common/utils/string.util';
import { getRelativeTime } from '@/common/utils/date.util';
import Tooltip from './tooltip';
import { Button } from '@/components/button';
import { PasteCreatedTime } from '@/components/paste/created-time';
import { DownloadPasteButton } from '@/components/paste/download-button';
import { PasteEditDetails } from '@/types/paste-edit-details';
import { LanguageSelect } from '@/components/language-select';

type PasteDetails = {
  type: 'paste' | 'edit';
  render: (paste?: Paste, editDetails?: PasteEditDetails) => ReactNode | string;
};

const pasteDetails: PasteDetails[] = [
  // Paste details
  {
    type: 'paste',
    render: (paste?: Paste) => paste && formatBytes(paste.size),
  },
  {
    type: 'paste',
    render: (paste?: Paste) => paste && `${formatNumber(paste.views)} View${paste.views === 1 ? '' : 's'}`,
  },
  {
    type: 'paste',
    render: (paste?: Paste) => {
      if (!paste || !paste.expires_at) {
        return undefined;
      }

      const expiresAt = new Date(paste.expires_at);
      return (
        <Tooltip display={expiresAt.toLocaleString()}>
          <p>Expires {getRelativeTime(expiresAt)}</p>
        </Tooltip>
      );
    },
  },
  {
    type: 'paste',
    render: (paste?: Paste) => paste && null, // This will be replaced with LanguageSelect in PasteDetails
  },

  // Paste edit details
  {
    type: 'edit',
    render: (paste?: Paste, editDetails?: PasteEditDetails) =>
      !editDetails ? undefined : (
        <p>
          {editDetails.lines} lines, {editDetails.words} words, {editDetails.characters} characters
        </p>
      ),
  },
  {
    type: 'edit',
    render: (paste?: Paste, editDetails?: PasteEditDetails) =>
      !editDetails ? undefined : <p>{formatBytes(Buffer.byteLength(editDetails.content))}</p>,
  },
];

function PasteDetails({
  paste,
  editDetails,
  currentLanguage,
  onLanguageChange,
}: {
  paste?: Paste;
  editDetails?: PasteEditDetails;
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
}) {
  const renderedPasteDetails = pasteDetails.map((detail, index) => {
    let rendered = detail.render(paste, editDetails);

    // Replace language rendering with LanguageSelect
    if (detail.type === 'paste' && paste && index === 3) {
      rendered = (
        <LanguageSelect
          value={(currentLanguage || paste.language).toLowerCase()}
          onChange={onLanguageChange || (() => {})}
        />
      );
    }

    if (rendered == undefined) {
      return undefined;
    }

    return (
      <div key={index} className='flex flex-row gap-1 px-2'>
        {rendered}
      </div>
    );
  });

  return (
    <div className='text-xs flex items-center justify-center flex-wrap divide-x-2 divide-secondary'>
      {renderedPasteDetails}
    </div>
  );
}

type FooterProps = {
  paste?: Paste;
  editDetails?: PasteEditDetails;
  selectedLanguage?: string;
  onLanguageChange?: (language: string) => void;
};

export function Footer({ paste, editDetails, selectedLanguage, onLanguageChange }: FooterProps) {
  const [currentLanguage, setCurrentLanguage] = useState<string | undefined>(paste?.language || selectedLanguage);

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    if (onLanguageChange) {
      onLanguageChange(newLanguage);
    }
  };

  return (
    <div
      className={
        'min-h-[40px] p-1.5 px-3 bg-background-secondary select-none gap-1 flex flex-col justify-between items-center text-sm w-full border-t border-border/50'
      }
    >
      <div className='flex gap-2 items-center w-full justify-center md:justify-between'>
        <div className='flex gap-2 items-center'>
          {!paste && onLanguageChange && (
            <LanguageSelect value={selectedLanguage || 'plain'} onChange={onLanguageChange} />
          )}
          <div className='hidden md:block'>
            {paste || editDetails ? (
              <PasteDetails
                paste={paste}
                editDetails={editDetails}
                currentLanguage={currentLanguage}
                onLanguageChange={handleLanguageChange}
              />
            ) : null}
          </div>
        </div>

        <>
          {paste ? (
            <div className='flex gap-2'>
              <DownloadPasteButton paste={paste} />
              <Link href={`/?duplicate=${encodeURI(paste.id)}`} prefetch={false}>
                <Button>Duplicate</Button>
              </Link>
              <Link href={`/raw/${paste.id}`} prefetch={false}>
                <Button>Raw</Button>
              </Link>
              <Link href='/' prefetch={false}>
                <Button>New</Button>
              </Link>
            </div>
          ) : (
            <Button>Save</Button>
          )}
        </>
      </div>
      <div className='block md:hidden'>
        {paste || editDetails ? (
          <PasteDetails
            paste={paste}
            editDetails={editDetails}
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
        ) : null}
      </div>
    </div>
  );
}
