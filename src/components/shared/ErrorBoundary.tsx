import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '4em', marginBottom: '20px' }}>😿</div>
          <h1 style={{ color: '#667eea', marginBottom: '10px' }}>Jejda, něco se pokazilo!</h1>
          <p style={{ fontSize: '1.2em', color: '#666', marginBottom: '30px' }}>
            Zkus to znovu kliknutím na tlačítko.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/';
            }}
            style={{
              padding: '15px 40px',
              fontSize: '1.2em',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
            }}
          >
            🏠 Zpět na začátek
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
