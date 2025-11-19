import React, { useState } from 'react';

export default function ItemIcon({ name, image, size = "w-12 h-12", className = "" }) {
  const [error, setError] = useState(false);

  const src = image ? `/images/items/${image}` : '';

  if (error || !image) {
    return (
      <div className={`${size} ${className} bg-purple-900/50 rounded-lg flex items-center justify-center border border-purple-500/30 text-xs text-center overflow-hidden p-1`} title={name}>
        {name ? name.substring(0, 2).toUpperCase() : "?"}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={name}
      className={`${size} ${className} object-contain drop-shadow-md`}
      onError={() => setError(true)} 
    />
  );
}