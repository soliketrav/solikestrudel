// src/components/InstrumentControls.js
import React from 'react';

export default function InstrumentControls({ p1, onChange, onChangeAndPlay }) {
    const handleChange = (value) => {
        onChange(value);
        // Triggers a reprocess & play
        if (onChangeAndPlay) onChangeAndPlay();
    };

    return (
        <div>
            <p className="mb-1 fw-bold">Instruments</p>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="p1"
                    id="p1-on"
                    checked={p1 === 'on'}
                    onChange={() => handleChange('on')}
                />
                <label className="form-check-label" htmlFor="p1-on">
                    p1: ON
                </label>
            </div>
            <div className="form-check">
                <input
                    className="form-check-input"
                    type="radio"
                    name="p1"
                    id="p1-hush"
                    checked={p1 === 'hush'}
                    onChange={() => handleChange('hush')}
                />
                <label className="form-check-label" htmlFor="p1-hush">
                    p1: HUSH
                </label>
            </div>
        </div>
    );
}
