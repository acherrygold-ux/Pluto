export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
    >
      <span aria-hidden="true">⚠️</span>
      <div className="flex-1">{message}</div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="text-rose-700 hover:text-rose-900"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}