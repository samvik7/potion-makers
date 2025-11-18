import React, { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onDone }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDone, 500);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onDone]);

  if (!message) return null;

  const baseStyle = "fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-xl text-white font-semibold transition-all duration-500 z-50";
  const typeStyle = {
    success: "bg-green-600",
    error: "bg-red-600",
  };
  const visibilityStyle = visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full";

  return (
    <div className={`${baseStyle} ${typeStyle[type]} ${visibilityStyle}`}>
      {message}
    </div>
  );
}