import useModal from "../../hooks/useModal";

const ConfirmDialog = ({
  title,
  message,
  confirmLabel = "Confirm",
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}) => {
  useModal(() => {
    if (!busy) onCancel();
  });

  return (
    <div
      className="animate-fade fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onCancel();
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="animate-pop w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl ${
            danger ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
          }`}
        >
          {danger ? "!" : "?"}
        </div>

        <h2 id="confirm-title" className="text-xl font-bold text-slate-900">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">{message}</p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {busy && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {busy ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
