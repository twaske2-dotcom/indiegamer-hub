import React, { useState } from 'react';

export default function ScreenshotGallery({ screenshots }) {
  const [active, setActive] = useState(0);
  if (!screenshots?.length) return null;

  return (
    <div>
      <img
        src={screenshots[active]}
        alt={`Screenshot ${active + 1}`}
        style={{ width: '100%', borderRadius: 10, maxHeight: 420, objectFit: 'cover', marginBottom: 10 }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 8 }}>
        {screenshots.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Thumb ${i + 1}`}
            onClick={() => setActive(i)}
            style={{
              width: '100%', height: 60, objectFit: 'cover', borderRadius: 6, cursor: 'pointer',
              border: `2px solid ${i === active ? 'var(--accent)' : 'transparent'}`
            }}
          />
        ))}
      </div>
    </div>
  );
}
