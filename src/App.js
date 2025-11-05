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
import { stranger_tune } from './tunes';

function App() {
    // Song text the user sees/edits
    const [songText, setSongText] = useState(stranger_tune);

    // The “control state” for preprocessing
    const [controls, setControls] = useState({
        p1: 'on',
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

        // Replace p1 tag based on radio buttons
        processed = processed.replaceAll('<p1_Radio>', controls.p1 === 'hush' ? '_' : '');

        // Replace volume tag
        processed = processed.replaceAll('<volume>', controls.volume.toString());

        // Replace tempo tag
        processed = processed.replaceAll('<tempo>', controls.tempo.toString());

        // Push to Strudel editor
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
                <div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
                    {/* Instruments */}
                    <InstrumentControls
                        p1={controls.p1}
                        onChange={(newP1) => setControls((prev) => ({ ...prev, p1: newP1 }))}
                        onChangeAndPlay={handleProcAndPlay}
                    />

                    {/* Transport */}
                    <TransportControls
                        onProcess={runPreprocess}
                        onProcessAndPlay={handleProcAndPlay}
                        onPlay={() => editorRef.current && editorRef.current.evaluate()}
                        onStop={() => editorRef.current && editorRef.current.stop()}
                    />

                    {/* Volume */}
                    <div style={{ minWidth: 240 }}>
                        <VolumeControl
                            volume={controls.volume}
                            onChange={(newVolume) => setControls((prev) => ({ ...prev, volume: newVolume }))}
                        />
                    </div>

                    {/* Tempo */}
                    <div style={{ minWidth: 240 }}>
                        <TempoControl
                            tempo={controls.tempo}
                            onChange={(newTempo) => setControls(prev => ({ ...prev, tempo: newTempo }))}
                            onChangeAndPlay={handleProcAndPlay}
                        />
                    </div>
                </div>
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
        </div>
    );
}

export default App;