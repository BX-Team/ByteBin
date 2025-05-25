export const Config = {
  idLength: Number(process.env.PASTE_ID_LENGTH) ?? 10,
  maxPasteSize: Number(process.env.PASTE_MAX_SIZE) ?? 1024 * 50,
  pasteExpiry: Number(process.env.PASTE_EXPIRY) ?? 30, // Default to 30 days
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bin.bxteam.org',
  siteTitle: process.env.NEXT_PUBLIC_SITE_TITLE ?? 'ByteBin',
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;

if (Config.idLength <= 0) {
  console.error('Invalid paste id length, please set PASTE_ID_LENGTH to a positive integer.');
  process.exit(1);
}

if (Config.maxPasteSize <= 0) {
  console.error('Invalid paste max size, please set PASTE_MAX_SIZE to a positive integer.');
  process.exit(1);
}
