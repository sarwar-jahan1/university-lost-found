
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";
import useModal from "../hooks/useModal";
import { useToast } from "./ui/toastContext";

const ClaimForm = ({ itemId, onClose }) => {
  const { notify } = useToast();
  const textareaRef = useRef(null);

  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (!submitting) onClose();
  };

  useModal(handleClose);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = async (event) => {
    event?.preventDefault();
    setError("");

    if (!description.trim()) {
      setError("Please describe why this item belongs to you.");
      textareaRef.current?.focus();
      return;
    }

    try {
      setSubmitting(true);

      // Send a number when the id is numeric, otherwise keep it as-is
      // (Number("abc") would become NaN and be sent as null).
      const numericId = Number(itemId);

      await apiRequest("/api/claims/", {
        method: "POST",
        body: JSON.stringify({
          itemId: Number.isNaN(numericId) ? itemId : numericId,
          description: description.trim(),
        }),
      });

      setSubmitted(true);
      notify("Claim submitted successfully.", "success");
    } catch (err) {
      setError(err.message || "Unable to submit your claim.");
    } finally {
      setSubmitting(false);
    }
  };

  // Ctrl/Cmd + Enter submits from the textarea
  const handleKeyDown = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      handleSubmit();
    }
  };

  const overlayClass =
    "animate-fade fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm";

  const handleBackdrop = (event) => {
    if (event.target === event.currentTarget) handleClose();
  };

  if (submitted) {
    return (
      <div
        className={overlayClass}
        onMouseDown={handleBackdrop}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Claim submitted"
          className="animate-pop w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
            ✓
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            Claim Submitted Successfully!
          </h2>

          <p className="mt-3 text-slate-600">
            Your claim request has been submitted.
          </p>

          <p className="mt-2 text-slate-600">
            Your claim status is currently{" "}
            <strong className="text-amber-700">Pending</strong>.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            You can check your submitted claims from the Track Claim
            page.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Close
            </button>

            <Link
              to="/track-claim"
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Track My Claim →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={overlayClass} onMouseDown={handleBackdrop}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="claim-title"
        className="animate-pop relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close claim form"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200"
        >
          ✕
        </button>

        <h2
          id="claim-title"
          className="pr-10 text-2xl font-bold text-slate-900"
        >
          Claim This Item
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Describe the item or provide details that can help verify
          your ownership.
        </p>

        <form onSubmit={handleSubmit} className="mt-6">
          <label
            htmlFor="claim-description"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Why is this item yours?
          </label>

          <textarea
            id="claim-description"
            ref={textareaRef}
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Describe the item or provide proof of ownership..."
            rows={5}
            required
            className="min-h-32 w-full resize-y rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>
              Tip: mention colors, marks, contents or serial numbers.
            </span>
            <span>{description.length} characters</span>
          </div>

          {error && (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {submitting ? "Submitting..." : "Submit Claim"}
            </button>
          </div>

          <p className="mt-3 hidden text-right text-xs text-slate-400 sm:block">
            Press Ctrl + Enter to submit · Esc to close
          </p>
        </form>
      </div>
    </div>
  );
};

export default ClaimForm;
