import React, { useState } from 'react';

export default function ItemIcon({ name, size = "w-12 h-12", className = "" }) {
  const [error, setError] = useState(false);

  const filename = name ? name.toLowerCase().replace(/\s+/g, '-') : 'unknown';
  
  const src = `/images/items/${filename}.png`;

  if (error) {
    return (
      <div className={`${size} ${className} bg-purple-900/50 rounded-lg flex items-center justify-center border border-purple-500/30 text-xs text-center overflow-hidden`} title={name}>
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