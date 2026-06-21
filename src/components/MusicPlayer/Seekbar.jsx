import React from 'react';
import { GiFastBackwardButton, GiFastForwardButton } from 'react-icons/gi';

const Seekbar = ({ value, min, max, onInput, setSeekTime, appTime, fullScreen }) => {
  const getTime = (time) =>
    `${Math.floor(time / 60)}:${(`0${Math.floor(time % 60)}`).slice(-2)}`;

  const progress = max > 0 ? (value / max) * 100 : 0;

  return (
    <div className={`${!fullScreen ? 'hidden sm:flex' : 'flex mt-5'} flex-row items-center gap-2`}>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setSeekTime(appTime - 5); }}
        className="hidden lg:block"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px",
          color: "rgba(255,255,255,0.7)",
          padding: "4px 8px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        <GiFastBackwardButton size={16} />
      </button>

      <p style={{
        color: "#94a3b8",
        fontSize: "12px",
        minWidth: "32px",
        textAlign: "right",
        fontVariantNumeric: "tabular-nums",
      }}>
        {value === 0 ? '0:00' : getTime(value)}
      </p>

      <div style={{ position: "relative", flex: 1, maxWidth: "650px" }}>
        <input
          onClick={(e) => e.stopPropagation()}
          type="range"
          step="any"
          value={value}
          min={min}
          max={max || 1}
          onInput={onInput}
          style={{
            WebkitAppearance: "none",
            appearance: "none",
            width: "100%",
            height: "4px",
            borderRadius: "2px",
            outline: "none",
            cursor: "pointer",
            background: `linear-gradient(to right, #a855f7 ${progress}%, rgba(255,255,255,0.15) ${progress}%)`,
            transition: "background 0.1s",
          }}
          className="glass-slider w-full"
        />
      </div>

      <p style={{
        color: "#64748b",
        fontSize: "12px",
        minWidth: "32px",
        fontVariantNumeric: "tabular-nums",
      }}>
        {max === 0 ? '0:00' : getTime(max)}
      </p>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setSeekTime(appTime + 5); }}
        className="hidden lg:block"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "8px",
          color: "rgba(255,255,255,0.7)",
          padding: "4px 8px",
          cursor: "pointer",
        }}
      >
        <GiFastForwardButton size={16} />
      </button>
    </div>
  );
};

export default Seekbar;
