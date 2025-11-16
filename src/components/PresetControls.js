// src/components/PresetControls.js
import React, { useState } from 'react';

export default function PresetControls({ controls, songText, onPresetLoaded }) {
    const [presetName, setPresetName] = useState('default');
    const [alert, setAlert] = useState(null);

    const storageKey = (name) => `strudelPreset_${name}`;

    const handleSave = () => {
        try {
            const data = { controls, songText };
            localStorage.setItem(storageKey(presetName), JSON.stringify(data));
            setAlert({ type: 'success', text: `Preset "${presetName}" saved.` });
        } catch (err) {
            console.error('Error saving preset:', err);
            setAlert({ type: 'danger', text: 'Failed to save preset.' });
        }
    };

    const handleLoad = () => {
        try {
            const raw = localStorage.getItem(storageKey(presetName));
            if (!raw) {
                setAlert({
                    type: 'warning',
                    text: `No preset found for "${presetName}".`,
                });
                return;
            }
            const parsed = JSON.parse(raw);
            onPresetLoaded(parsed);
            setAlert({ type: 'success', text: `Preset "${presetName}" loaded.` });
        } catch (err) {
            console.error('Error loading preset:', err);
            setAlert({
                type: 'danger',
                text: 'Failed to load preset (invalid or corrupt JSON).',
            });
        }
    };

    return (
        <div className="card">
            <div className="card-header">Presets (JSON)</div>
            <div className="card-body">
                <div className="row g-2 align-items-end">
                    <div className="col-md-6">
                        <label htmlFor="presetName" className="form-label mb-1">
                            Preset name
                        </label>
                        <input
                            id="presetName"
                            type="text"
                            className="form-control"
                            value={presetName}
                            onChange={(e) => setPresetName(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 d-flex gap-2">
                        <button
                            type="button"
                            className="btn btn-outline-primary flex-fill"
                            onClick={handleSave}
                        >
                            Save Preset
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary flex-fill"
                            onClick={handleLoad}
                        >
                            Load Preset
                        </button>
                    </div>
                </div>

                {alert && (
                    <div
                        className={`alert alert-${alert.type} py-2 mt-3 mb-0`}
                        role="alert"
                    >
                        {alert.text}
                    </div>
                )}
            </div>
        </div>
    );
}