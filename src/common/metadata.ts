import { Metadata } from 'next';
import { Config } from './config';

/**
 * Default metadata for the app.
 *
 * @param openGraph Whether to include Open Graph metadata.
 * @returns The default metadata.
 */
export function defaultMetadata(openGraph: boolean = true): Metadata {
  return {
    title: {
      default: Config.siteTitle,
      template: `${Config.siteTitle} - %s`,
    },
    description: 'Modern and open-source pastebin service ',
    ...(openGraph && {
      openGraph: {
        title: Config.siteTitle,
        description: 'Modern and open-source pastebin service ',
      },
    }),
  };
}
