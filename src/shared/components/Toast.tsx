import { useEffect } from "react";

type Props = {
  message: string;
  onClose: () => void;
};

export default function Toast({ message, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 rounded shadow-lg animate-fadeIn">
      {message}
    </div>
  );
}