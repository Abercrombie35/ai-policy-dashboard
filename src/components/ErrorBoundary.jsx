import React from 'react';
import { APP_VERSION } from '../version';

// Catches rendering errors so a failure in one view shows a readable message
// (with the error text, for reporting) instead of a blank page. It resets when
// `resetKey` changes, for example when the reader navigates elsewhere.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('Dashboard view failed to render:', error, info?.componentStack);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div className="error-panel" role="alert">
        <h2>This view could not be displayed</h2>
        <p>Something in this part of the dashboard failed to load. The rest of the site still works.</p>
        <p className="error-detail"><code>{String(error?.message || error)}</code></p>
        <p className="fine-print">Version {APP_VERSION}. If this keeps happening, report the message above.</p>
        <div className="error-actions">
          <a className="chip" href="#/">Back to map</a>
          <button type="button" className="chip" onClick={() => window.location.reload()}>Reload</button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
