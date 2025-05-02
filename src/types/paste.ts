export type Paste = {
  /**
   * The paste's ID.
   */
  id: string;
  /**
   * The paste's key (same as id, used for URLs).
   */
  key: string;
  /**
   * The paste's content.
   */
  content: string;
  /**
   * The paste's file extension.
   */
  ext: string;
  /**
   * The paste's programming language.
   */
  language: string;
  /**
   * The paste's expiration date.
   */
  expires_at: string | null;
  /**
   * The paste's size in bytes.
   */
  size: number;
  /**
   * The paste's creation timestamp.
   */
  timestamp: string;
  /**
   * The paste's view count.
   */
  views: number;
};
