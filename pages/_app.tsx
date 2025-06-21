// pages/_app.tsx

import type { AppProps } from 'next/app';
import { createContext, useReducer, ReactNode, useContext } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import ErrorBoundary from '../components/ErrorBoundary';

const GlobalStyle = createGlobalStyle`
  /* CSS Reset + Smooth font rendering + custom variables */
  *, *::before, *::after {
    box-sizing: border-box;
  }
  html, body {
    margin: 0;
    padding: 0;
    background-color: #010c1f;
    color: #d4e2fc;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
  }
  a {
    color: #3b82f6;
    text-decoration: none;
    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }
`;

const theme = {
  colors: {
    primary: '#3b82f6',
    background: '#010c1f',
    text: '#d4e2fc',
    error: '#f87171',
  },
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
  },
};

type State = {
  link: string;
  highlight: string;
  error: string | null;
  loading: boolean;
  shortUrl: string | null;
  preview: string | null;
};

type Action =
  | { type: 'SET_LINK'; payload: string }
  | { type: 'SET_HIGHLIGHT'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SHORTURL'; payload: string | null }
  | { type: 'SET_PREVIEW'; payload: string | null }
  | { type: 'RESET' };

const initialState: State = {
  link: '',
  highlight: '',
  error: null,
  loading: false,
  shortUrl: null,
  preview: null,
};

const AppContext = createContext<
  { state: State; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LINK':
      return { ...state, link: action.payload };
    case 'SET_HIGHLIGHT':
      return { ...state, highlight: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_SHORTURL':
      return { ...state, shortUrl: action.payload };
    case 'SET_PREVIEW':
      return { ...state, preview: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}

function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <AppProvider>
            <Component {...pageProps} />
          </AppProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </>
  );
}
