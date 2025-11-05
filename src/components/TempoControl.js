// src/components/TempoControl.js
import React from 'react';

export default function TempoControl({ tempo, onChange, onChangeAndPlay }) {
    const handleChange = (e) => {
        const newVal = Number(e.target.value);
        onChange(newVal);
        if (onChangeAndPlay) onChangeAndPlay();
    };

    return (
        <div>
            <p className="mb-1 fw-bold">Tempo</p>
            <input
                type="range"
                className="form-range"
                min="60"
                max="180"
                step="1"
                value={tempo}
                onChange={handleChange}
            />
            <small className="text-muted">Current: {tempo} BPM</small>
        </div>
    );
}
