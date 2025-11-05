// src/App.js
import React, { useState, useRef, useCallback, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import StrudelHost from './components/StrudelHost';
import PreprocessEditor from './components/PreprocessEditor';
import TransportControls from './components/TransportControls';
import InstrumentControls from './components/InstrumentControls';
import VolumeControl from './components/VolumeControl';
import { stranger_tune } from './tunes';

function App() {
    // Song text the user sees/edits
    const [songText, setSongText] = useState(stranger_tune);

    // The “control state” for preprocessing
    const [controls, setControls] = useState({
        p1: 'on',        // or 'hush'
        volume: 1.0,
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

        // Push to Strudel editor
        editorRef.current.setCode(processed);

        return processed;
    }, [songText, controls]);

    // Process + play combined
    const handleProcAndPlay = useCallback(() => {
        const processed = runPreprocess();
        if (editorRef.current && editorRef.current.repl?.state?.started) {
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
            <h2 className="mb-3">Strudel Reactor</h2>
            <div className="row">
                {/* LEFT: editor + controls */}
                <div className="col-md-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <div className="card mb-3">
                        <div className="card-header">Preprocessor</div>
                        <div className="card-body">
                            <PreprocessEditor value={songText} onChange={setSongText} />
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-header">Transport</div>
                        <div className="card-body">
                            <TransportControls
                                onProcess={runPreprocess}
                                onProcessAndPlay={handleProcAndPlay}
                                onPlay={() => editorRef.current && editorRef.current.evaluate()}
                                onStop={() => editorRef.current && editorRef.current.stop()}
                            />
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-header">Instruments</div>
                        <div className="card-body">
                            <InstrumentControls
                                p1={controls.p1}
                                onChange={(newP1) => setControls((prev) => ({ ...prev, p1: newP1 }))}
                                onChangeAndPlay={handleProcAndPlay}
                            />
                        </div>
                    </div>

                    <div className="card mb-3">
                        <div className="card-header">Mix</div>
                        <div className="card-body">
                            <VolumeControl
                                volume={controls.volume}
                                onChange={(newVolume) => setControls((prev) => ({ ...prev, volume: newVolume }))}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT: Strudel host */}
                <div className="col-md-8">
                    <div className="card">
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