// src/App.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import StrudelHost from './components/StrudelHost';
import PreprocessEditor from './components/PreprocessEditor';
import TransportControls from './components/TransportControls';
import InstrumentControls from './components/InstrumentControls';
import VolumeControl from './components/VolumeControl';
import TempoControl from './components/TempoControl';
import AdvancedControlsAccordion from './components/AdvancedControlsAccordion';
import PresetControls from './components/PresetControls';
import D3LogGraph from './components/D3LogGraph';
import { stranger_tune } from './tunes';

function App() {
    // Song text the user sees/edits
    const [songText, setSongText] = useState(stranger_tune);

    // The “control state” for preprocessing
    const [controls, setControls] = useState({
        instruments: {
            bassline: true,
            mainArp: true,
            drums: true,
            drums2: true,
        },
        volume: 1.0,
        tempo: 120,
    });

    // A reference to the Strudel editor
    const editorRef = useRef(null);

    // Called by StrudelHost once Strudel is ready
    const handleEditorReady = useCallback((editorInstance) => {
        editorRef.current = editorInstance;
    }, []);

    // Preprocessing logic
    const runPreprocess = useCallback(() => {
        if (!editorRef.current) return;

        let processed = songText;

        const { instruments, volume, tempo } = controls;

        processed = processed
            // Instrument gains: 1 = on, 0 = muted
            .replaceAll('<inst_bassline>', instruments.bassline ? '1' : '0')
            .replaceAll('<inst_main_arp>', instruments.mainArp ? '1' : '0')
            .replaceAll('<inst_drums>', instruments.drums ? '1' : '0')
            .replaceAll('<inst_drums2>', instruments.drums2 ? '1' : '0')
            // Advanced controls
            .replaceAll('<volume>', volume.toString())
            .replaceAll('<tempo>', tempo.toString());

        editorRef.current.setCode(processed);
        return processed;
    }, [songText, controls]);


    // Process + play combined
    const handleProcAndPlay = useCallback(() => {
        runPreprocess();
        if (editorRef.current) {
            editorRef.current.evaluate();
        }
    }, [runPreprocess]);

    // JSON save/load
    const handlePresetLoaded = useCallback((preset) => {
        if (preset.songText) {
            setSongText(preset.songText);
        }
        if (preset.controls) {
            setControls(preset.controls);
        }
    }, []);

    // Re-run preprocess & (if started) re-evaluate when volume changes
    useEffect(() => {
        if (!editorRef.current) return;
        runPreprocess();
        if (editorRef.current.repl?.state?.started) {
            editorRef.current.evaluate();
        }
    }, [controls.volume, runPreprocess]);

    return (
        <div className="container-fluid py-3">
            <h2 className="mb-3 text-center">Strudel Reactor</h2>

            {/* Top control bar */}
            <div className="bg-body-tertiary border rounded-3 p-3 mb-3">
                <div className="d-flex flex-wrap justify-content-center align-items-start gap-4">
                    {/* Left column */}
                    <div className="d-flex flex-column align-items-start gap-3">
                        {/* Transport */}
                        <TransportControls
                            onProcess={runPreprocess}
                            onProcessAndPlay={handleProcAndPlay}
                            onPlay={() => editorRef.current && editorRef.current.evaluate()}
                            onStop={() => editorRef.current && editorRef.current.stop()}
                        />

                        {/* Instruments */}
                        <InstrumentControls
                            instruments={controls.instruments}
                            onChange={(updatedInstruments) =>
                                setControls((prev) => ({ ...prev, instruments: updatedInstruments }))
                            }
                            onChangeAndPlay={handleProcAndPlay}
                        />

                    </div>

                    {/* Right column */}
                    {/* Advanced Controls Accordion */}
                    <div style={{ minWidth: 320 }}>
                        <AdvancedControlsAccordion
                            volume={controls.volume}
                            tempo={controls.tempo}
                            onVolumeChange={(newVolume) =>
                                setControls((prev) => ({ ...prev, volume: newVolume }))
                            }
                            onTempoChange={(newTempo) =>
                                setControls((prev) => ({ ...prev, tempo: newTempo }))
                            }
                            onProcAndPlay={handleProcAndPlay}
                        />
                    </div>
                </div>
            </div>

            {/* Presets (JSON save/load) */}
            <div className="mb-3">
                <PresetControls
                    controls={controls}
                    songText={songText}
                    onPresetLoaded={handlePresetLoaded}
                />
            </div>

            {/* Editor and host */}
            <div className="row g-3">
                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header">Preprocessor</div>
                        <div className="card-body">
                            <PreprocessEditor value={songText} onChange={setSongText} />
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card h-100">
                        <div className="card-header">Strudel Editor & Pianoroll</div>
                        <div className="card-body">
                            <StrudelHost onReady={handleEditorReady} initialCode={songText} />
                        </div>
                    </div>
                </div>
            </div>

            {/* D3 Graph row */}
            <div className="row g-3 mt-3">
                <div className="col-12">
                    <div className="card h-100">
                        <div className="card-header">Live D3 Graph</div>
                        <div className="card-body">
                            <D3LogGraph />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;