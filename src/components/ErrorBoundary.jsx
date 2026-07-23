import { Component } from "react"

// Top-level safety net: if any descendant throws during render or in an effect,
// React would otherwise unmount the whole tree and leave a blank page. This catches
// it and shows a recoverable message instead. Uses inline styles on purpose, so the
// fallback still renders even if the CSS/Tailwind layer is the thing that failed.
export class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Surface it for debugging (visible in the browser console / Netlify logs).
    console.error("App crash caught by ErrorBoundary:", error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: 24,
            background: "#0a0a0a",
            color: "#f5f5f5",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          <div style={{ maxWidth: 480 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
              Something went wrong
            </h1>
            <p style={{ opacity: 0.7, marginBottom: 20, fontSize: 14, lineHeight: 1.5 }}>
              {String(this.state.error?.message || this.state.error)}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                color: "#fff",
                background: "linear-gradient(to right, #ef4444, #9333ea, #3b82f6)",
              }}
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
