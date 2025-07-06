import type { AppProps } from 'next/app';
import Head from 'next/head';
import { createContext, useReducer, useContext, ReactNode } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import styled from 'styled-components';

import Menu from '@/components/Menu';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

//
// 🎨 Global Styles
//
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body {
    margin: 0;
    padding: 0;
    min-height: 100%;
    background: linear-gradient(180deg, #010c1f 0%, #1e293b 100%);
    color: #d4e2fc;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    scroll-behavior: smooth;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: #3b82f6;
    text-decoration: none;
    transition: color 0.18s ease-in-out;

    &:hover,
    &:focus {
      color: #ffd100;
      text-decoration: underline;
    }
  }

  #__next {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
`;

//
// 🎨 Theme
//
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

//
// ⚙️ App State & Context
//
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
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

//
// 🧱 Styled Layout Containers
//
const Main = styled.main`
  flex: 1;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem 1.5rem 4rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`;

const SkipToContent = styled.a`
  position: absolute;
  left: -999px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
  z-index: 9999;
  background: #fff200;
  color: #14213d;
  font-weight: 600;
  padding: 0.8em 1.2em;
  border-radius: 0 0 1em 1em;
  transition: left 0.2s ease;

  &:focus {
    left: 12px;
    width: auto;
    height: auto;
    outline: 2px solid #3b82f6;
    box-shadow: 0 2px 16px #3b82f699;
  }
`;

//
// 🚀 App Entry
//
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Jump2 — The Future of Smarter Sharing</title>
        <meta
          name="description"
          content="Jump2 lets you share files instantly, securely, and beautifully. No signups, no friction — just send and receive. Try it now and fall in love with simple sharing!"
        />
        <meta property="og:title" content="Jump2 — Share Files Instantly" />
        <meta property="og:description" content="Jump2 lets you share files instantly, securely, and beautifully." />
        <meta property="og:image" content="/jump2-social-card.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <GlobalStyle />

      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <AppProvider>
            <SkipToContent href="#main-content">Skip to content</SkipToContent>
            <Menu />
            <Main id="main-content">
              <Component {...pageProps} />
            </Main>
            <Footer contactEmail="support@jump2share.com" />
          </AppProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </>
  );
}
