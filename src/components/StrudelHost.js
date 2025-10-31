// src/components/StrudelHost.js
import React, { useEffect, useRef } from 'react';
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import console_monkey_patch from '../console-monkey-patch';

export default function StrudelHost({ onReady, initialCode }) {
    const hasRun = useRef(false);
    const canvasRef = useRef(null);
    const editorContainerRef = useRef(null);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        console_monkey_patch();

        // Setup canvas
        const canvas = canvasRef.current;
        canvas.width = canvas.width * 2;
        canvas.height = canvas.height * 2;
        const drawContext = canvas.getContext('2d');
        const drawTime = [-2, 2];

        // Create the Strudel editor
        const editor = new StrudelMirror({
            defaultOutput: webaudioOutput,
            getTime: () => getAudioContext().currentTime,
            transpiler,
            root: editorContainerRef.current,
            drawTime,
            onDraw: (haps, time) =>
                drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
            prebake: async () => {
                initAudioOnFirstClick();
                const loadModules = evalScope(
                    import('@strudel/core'),
                    import('@strudel/draw'),
                    import('@strudel/mini'),
                    import('@strudel/tonal'),
                    import('@strudel/webaudio'),
                );
                await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
            },
        });

        // Load initial code if provided
        if (initialCode) {
            editor.setCode(initialCode);
        }

        // Send the editor instance to parent
        if (onReady) {
            onReady(editor);
        }
    }, [onReady, initialCode]);

    return (
        <div>
            <div ref={editorContainerRef} />
            <canvas id="roll" ref={canvasRef} style={{ width: '100%', height: '200px' }} />
        </div>
    );
}