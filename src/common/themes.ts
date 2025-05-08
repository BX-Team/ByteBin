import type { editor } from 'monaco-editor';
import dracula from 'monaco-themes/themes/Dracula.json';
import monokai from 'monaco-themes/themes/Monokai.json';
import solarizedDark from 'monaco-themes/themes/Solarized-dark.json';
import solarizedLight from 'monaco-themes/themes/Solarized-light.json';

type Color = `#${string}`;
type ColorRecord = Record<string, Color>;

export interface Theme {
  id: string;
  primary: Color;
  secondary: Color;
  highlight: Color;
  background: Color;
  lightOrDark: 'light' | 'dark';
  highlightedLine: {
    color: Color;
    backgroundColor: Color;
  };
  editor: editor.IStandaloneThemeData;
}

export interface Themes {
  dark: Theme;
}

const themes: Themes = {
  dark: {
    id: 'dark',
    primary: '#fafafa', // var(--foreground)
    secondary: '#111111', // var(--background)
    highlight: '#1e2e3d', // var(--secondary)
    background: '#111111', // var(--background)
    lightOrDark: 'dark',
    highlightedLine: {
      color: '#fafafa', // var(--foreground)
      backgroundColor: '#1e2e3d', // var(--secondary)
    },
    editor: makeMonacoTheme(
      {
        base: 'vs-dark',
        colors: {
          primary: '#fafafa', // var(--foreground)
          background: '#111111', // var(--background)
          comment: '#a3a3a3', // var(--muted-foreground)
          delimiter: '#1a8cff', // var(--primary)
          annotation: '#a3a3a3', // var(--muted-foreground)
          constant: '#ff5555', // var(--destructive)
          number: '#1a8cff', // var(--primary)
          string: '#1a8cff', // var(--primary)
          operator: '#fafafa', // var(--foreground)
          keyword: '#1a8cff', // var(--primary)
          type: '#a3a3a3', // var(--muted-foreground)
          variable: '#fafafa', // var(--foreground)
          logInfo: '#1a8cff', // var(--primary)
          logError: '#ff5555', // var(--destructive)
          logWarning: '#a3a3a3', // var(--muted-foreground)
          logDate: '#1e2e3d', // var(--secondary)
          logException: '#ff5555', // var(--destructive)
          diffMeta: '#1e2e3d', // var(--secondary)
          diffAddition: '#1a8cff', // var(--primary)
          diffDeletion: '#ff5555', // var(--destructive)
        },
      },
      {},
    ),
  },
};

export default themes;

interface ExtraColors {
  logInfo: Color;
  logError: Color;
  logWarning: Color;
  logDate: Color;
  logException: Color;
  diffMeta: Color;
  diffAddition: Color;
  diffDeletion: Color;
}

interface MonacoThemeProps {
  base: 'vs' | 'vs-dark';
  colors: {
    primary: Color;
    background: Color;
    string: Color;
    comment: Color;
    delimiter: Color;
    annotation: Color;
    constant: Color;
    number: Color;
    operator: Color;
    keyword: Color;
    type: Color;
    variable: Color;
  } & ExtraColors;
}

export function makeMonacoTheme(props: MonacoThemeProps, extraColors: ColorRecord): editor.IStandaloneThemeData {
  const colors = Object.fromEntries(
    Object.entries(props.colors).map(([key, color]) => [key, color.substring(1)]),
  ) as Record<keyof MonacoThemeProps['colors'], string>;

  const editorColors: ColorRecord = {
    'editor.background': `#${colors.background}`,
    'editor.foreground': `#${colors.primary}`,
  };

  return {
    base: props.base,
    inherit: true,
    rules: [
      {
        token: '' /* minimap */,
        foreground: colors.primary,
        background: colors.background,
      },
      { token: 'string', foreground: colors.string },
      { token: 'keyword', foreground: colors.keyword },
      { token: 'constant', foreground: colors.constant },
      { token: 'number', foreground: colors.number },
      { token: 'annotation', foreground: colors.annotation },
      { token: 'variable', foreground: colors.variable },
      { token: 'operator', foreground: colors.operator },
      { token: 'operators', foreground: colors.operator },
      { token: 'punctuation', foreground: colors.operator },
      { token: 'delimiter', foreground: colors.delimiter },
      { token: 'delimiter.square', foreground: colors.delimiter },
      { token: 'delimiter.bracket', foreground: colors.delimiter },
      { token: 'delimiter.parenthesis', foreground: colors.delimiter },
      { token: 'identifier', foreground: colors.primary },
      { token: 'type', foreground: colors.type },
      { token: 'comment', foreground: colors.comment },
      { token: 'info.log', foreground: colors.logInfo },
      { token: 'error.log', foreground: colors.logError, fontStyle: 'bold' },
      { token: 'warning.log', foreground: colors.logWarning },
      { token: 'date.log', foreground: colors.logDate },
      { token: 'exception.log', foreground: colors.logException },
      { token: 'meta.diff', foreground: colors.diffMeta },
      { token: 'addition.diff', foreground: colors.diffAddition },
      { token: 'deletion.diff', foreground: colors.diffDeletion },
    ],
    colors: { ...editorColors, ...extraColors },
  };
}

export function addExtraColors(
  theme: editor.IStandaloneThemeData,
  extraColors: ExtraColors,
): editor.IStandaloneThemeData {
  const colors = Object.fromEntries(
    Object.entries(extraColors).map(([key, color]) => [key, color.substring(1)]),
  ) as Record<keyof ExtraColors, string>;
  theme.rules.push(
    ...[
      { token: 'info.log', foreground: colors.logInfo },
      { token: 'error.log', foreground: colors.logError, fontStyle: 'bold' },
      { token: 'warning.log', foreground: colors.logWarning },
      { token: 'date.log', foreground: colors.logDate },
      { token: 'exception.log', foreground: colors.logException },
      { token: 'meta.diff', foreground: colors.diffMeta },
      { token: 'addition.diff', foreground: colors.diffAddition },
      { token: 'deletion.diff', foreground: colors.diffDeletion },
    ],
  );
  return theme;
}
