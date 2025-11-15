// src/components/AdvancedControlsAccordion.js
import React, { useState } from 'react';
import VolumeControl from './VolumeControl';
import TempoControl from './TempoControl';

export default function AdvancedControlsAccordion({
    volume,
    tempo,
    onVolumeChange,
    onTempoChange,
    onProcAndPlay,
}) {
    const [open, setOpen] = useState(true);

    const toggleOpen = () => setOpen((prev) => !prev);

    return (
        <div className="accordion" id="advancedControlsAccordion">
            <div className="accordion-item">
                <h2 className="accordion-header" id="advancedControlsHeading">
                    <button
                        className={`accordion-button ${open ? '' : 'collapsed'}`}
                        type="button"
                        onClick={toggleOpen}
                    >
                        Advanced Controls
                    </button>
                </h2>
                <div
                    className={`accordion-collapse collapse ${open ? 'show' : ''}`}
                >
                    <div className="accordion-body">
                        {/* Volume */}
                        <div className="mb-3">
                            <VolumeControl
                                volume={volume}
                                onChange={onVolumeChange}
                            />
                        </div>

                        <hr className="my-3" />

                        {/* Tempo */}
                        <div>
                            <TempoControl
                                tempo={tempo}
                                onChange={onTempoChange}
                                onChangeAndPlay={onProcAndPlay}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}