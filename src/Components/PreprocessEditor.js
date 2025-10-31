// src/components/PreprocessEditor.js
import React from 'react';

export default function PreprocessEditor({ value, onChange }) {
    return (
        <div>
            <label className="form-label">Text to preprocess:</label>
            <textarea
                className="form-control"
                rows="15"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}