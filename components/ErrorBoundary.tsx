// components/ErrorBoundary.tsx
import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Uncaught error:', error, info);
    // Optionally log to external service here
  }

  render() {
    if (this.state.hasError) {
      return (
        <main role="alert" style={{ padding: '2rem', color: '#f87171' }}>
          <h1>Oops! Something went wrong.</h1>
          <p>Please try refreshing the page or come back later.</p>
        </main>
      );
    }

    return this.props.children;
  }
}
