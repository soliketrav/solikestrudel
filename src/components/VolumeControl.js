// src/components/VolumeControl.js
import React from 'react';

export default function VolumeControl({ volume, onChange, onChangeAndPlay }) {
    const handleChange = (e) => {
        const newVal = Number(e.target.value);
        onChange(newVal);
        if (onChangeAndPlay) onChangeAndPlay();
    };

    return (
        <div>
            <p className="mb-1 fw-bold">Master Volume</p>
            <input
                type="range"
                className="form-range"
                min="0"
                max="2"
                step="0.1"
                value={volume}
                onChange={handleChange}
            />
            <small className="text-muted">Current: {volume.toFixed(1)}</small>
        </div>
    );
}