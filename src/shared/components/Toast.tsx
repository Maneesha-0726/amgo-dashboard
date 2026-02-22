type Props = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
};

export default function Toast({
  message,
  actionLabel,
  onAction,
  onClose,
}: Props) {
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-2 rounded shadow flex items-center gap-3">
      <span>{message}</span>

      {actionLabel && onAction && (
        <button
          className="underline text-blue-400"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}

      <button onClick={onClose}>✕</button>
    </div>
  );
}