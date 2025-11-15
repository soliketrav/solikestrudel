// src/components/InstrumentControls.js
import React from 'react';

export default function InstrumentControls({ instruments, onChange, onChangeAndPlay }) {
    const handleToggle = (name) => (e) => {
        const updated = { ...instruments, [name]: e.target.checked };
        onChange(updated);
        if (onChangeAndPlay) {
            onChangeAndPlay();
        }
    };

    return (
        <div>
            <p className="mb-1 fw-bold">Instruments</p>

            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="inst-bassline"
                    checked={instruments.bassline}
                    onChange={handleToggle('bassline')}
                />
                <label className="form-check-label" htmlFor="inst-bassline">
                    Bassline
                </label>
            </div>

            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="inst-main-arp"
                    checked={instruments.mainArp}
                    onChange={handleToggle('mainArp')}
                />
                <label className="form-check-label" htmlFor="inst-main-arp">
                    Main Arp
                </label>
            </div>

            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="inst-drums"
                    checked={instruments.drums}
                    onChange={handleToggle('drums')}
                />
                <label className="form-check-label" htmlFor="inst-drums">
                    Drums
                </label>
            </div>

            <div className="form-check">
                <input
                    className="form-check-input"
                    type="checkbox"
                    id="inst-drums2"
                    checked={instruments.drums2}
                    onChange={handleToggle('drums2')}
                />
                <label className="form-check-label" htmlFor="inst-drums2">
                    Drums 2
                </label>
            </div>
        </div>
    );
}
