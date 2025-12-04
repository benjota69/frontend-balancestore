// Componente Deslizar Texto, el que está en "Home" al principio
// Textos que se desplazan a la izquierda o derecha

import { useState } from "react";

export default function DeslizarTexto({ messages, className = "" }) {
  const [i, setI] = useState(0);
  const prev = () => setI(v => (v - 1 + messages.length) % messages.length);
  const next = () => setI(v => (v + 1) % messages.length);

  return (
    <div className={`text-slider ${className}`}>
      <button type="button" className="slider-btn" onClick={prev} aria-label="Anterior">‹</button>
      <div className="text-slider-window">
        <div className="text-slider-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {messages.map((m, idx) => (
            <div className="text-slider-item" key={idx}>{m}</div>
          ))}
        </div>
      </div>
      <button type="button" className="slider-btn" onClick={next} aria-label="Siguiente">›</button>
    </div>
  );
}