Web Technology (INFT 2064) - React Assignment - Travis Middleton (midtw001)

This project is an extended version of a Strudel-based music sequencer built using React, Bootstrap, and D3.js. The provided scaffold was enhanced with new features, improved UI/UX, component refactoring, JSON state handling, and live graphical data visualisation. The application allows users to write algorithmic music patterns, preprocess them, play them through a Strudel engine, adjust playback controls, toggle individual instruments, save/load presets using JSON, and view a live graph of musical activity.

## Overview Of Features ##

Preprocessor

Users write or modify musical pattern text in the Preprocessor editor. The editor is a dedicated component (PreprocessEditor.js). When the user selects Preprocess or Proc & Play, the pattern text is transformed before being sent to Strudel for evaluation.

Transport Controls

Playback is controlled through a set of buttons: Preprocess, Proc & Play, Play, and Stop. These controls allow preprocessing without playback, preprocessing with playback, playing the last processed pattern, and stopping playback. Transport logic is contained in TransportControls.js.

Instrument Toggles

The app displays the instruments defined in the musical pattern which are: Bassline, Main Arp, Drums, and Drums 2. Each instrument can be toggled independently. Toggling applies .gain(1) or .gain(0) through preprocessing, allowing full or partial muting. This system is implemented in InstrumentControls.js with supporting definitions in tunes.js.

Advanced Controls

A collapsible accordion groups additional controls: Master Volume (0-200%), and Tempo (BPM). These are applied during preprocessing via .postgain() for volume and .fast() for tempo. This is implemented within AdvancedControlsAccordion.js.

JSON Presets (Save and Load)

Users can save presets containing all current control settings (volume, tempo, instrument states) and the preprocessed pattern text. Presets are stored in the browser using JSON.stringify(), JSON.parse(), and localStorage. Success and error states are indicated through Bootstrap alerts. This functionality is implemented in PresetControls.js.

Live D3 Graph (Strudel .log() Output)

A real time D3.js line graph visualises data produced by Strudel's .log() function during playback. The workflow is as follows: First strudel outputs logged values using .log(). console-monkey-patch.js intercepts these logs, extracts numeric values, and stores the most recent 100 entries. getD3Data() exposes these values to React. D3LogGraph.js polls this data every 250ms and renders a live-updating line graph using D3.

## Component Architecture ##

App.js
Global state, layout, and preprocessing pipeline

PreprocessEditor.js
Editor for the pattern text

TransportControls.js
Playback controls

InstrumentControls.js
Instrument muting toggles

AdvancedControlsAccordion.js
Container for volume/tempo settings

VolumeControl.js
Master volume slider

TempoControl.js
BPM slider

PresetControls.js
Saving and loading JSON presets

StrudelHost.js
Runs the Strudel REPL

D3LogGraph.js
Real-time D3 visualisation of Strudel .log() data

console-monkey-patch.js
Log interception and data extraction

This structure ensures separation of concerns, easier maintenance, and clear data flow.

## UI and UX Design Choices ##

- Three-column top layout: Left column contains the D3 graph, centre column contains transport controls and instruments, and right column contains advanced controls.

- Accordion used to reduce clutter.

- Bootstrap cards used for major interface sections.

- Consistent spacing and alignment with Bootstrap utilities.

- Responsive layout that adapts across screen sizes.

- Alerts provide immediate feedback for saving/loading presets.

## Technologies Used ##

React

Bootstrap

Strudel

D3.js

localStorage