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
    primary: '#c9d1d9',
    secondary: '#010409',
    highlight: '#161b22',
    background: '#0d1117',
    lightOrDark: 'dark',
    highlightedLine: {
      color: '#f0f6fc',
      backgroundColor: '#161b22',
    },
    editor: makeMonacoTheme(
      {
        base: 'vs-dark',
        colors: {
          primary: '#c9d1d9',
          background: '#0A0A0A',
          comment: '#8b949e',
          delimiter: '#d2a8ff',
          annotation: '#a5d6ff',
          constant: '#ff7b72',
          number: '#f2cc60',
          string: '#79c0ff',
          operator: '#ff7b72',
          keyword: '#ff7b72',
          type: '#ffa657',
          variable: '#ffa657',
          logInfo: '#3fb950',
          logError: '#f85149',
          logWarning: '#d29922',
          logDate: '#33B3AE',
          logException: '#f8e3a1',
          diffMeta: '#33B3AE',
          diffAddition: '#3fb950',
          diffDeletion: '#f85149',
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
