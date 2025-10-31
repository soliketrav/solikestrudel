// src/components/TransportControls.js
import React from 'react';

export default function TransportControls({ onProcess, onProcessAndPlay, onPlay, onStop }) {
    return (
        <div className="btn-group" role="group" aria-label="Transport Controls">
            <button onClick={onProcess} className="btn btn-outline-primary">
                Preprocess
            </button>
            <button onClick={onProcessAndPlay} className="btn btn-outline-primary">
                Proc &amp; Play
            </button>
            <button onClick={onPlay} className="btn btn-outline-success">
                Play
            </button>
            <button onClick={onStop} className="btn btn-outline-danger">
                Stop
            </button>
        </div>
    );
}