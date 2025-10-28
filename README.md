# BeatForge Studio Pro 🎶

**BeatForge Studio Pro** is an advanced, browser-based beat sequencer and music production tool built with React and the Web Audio API. It was developed to provide a feature-rich, high-quality environment for creating and manipulating electronic music patterns, incorporating user-requested features like advanced sound libraries, a full mixer, custom sample uploads, and a RemixLive Studio-inspired editing panel.

## Features

This application goes beyond a standard beat maker, offering a robust set of tools for both beginners and experienced producers:

### 1. Core Sequencer & Sound Engine
*   **High-Quality Audio:** Uses synthesized and professional samples to avoid "MIDI-like" sounds.
*   **Extensive Sound Library:** Over **100+ categorized instruments** including Kicks, Snares, Hi-Hats, Cymbals, Percussion, Vocals, Bass, Leads, Pads, Synths, and FX.
*   **Flexible Length:** Sequencer length can be adjusted to **2, 4, 8, 16, 32, or 64 steps**.
*   **Tempo and Groove:** Includes adjustable **BPM** and **Swing** controls.
*   **Preset Kits:** Features multiple genre-specific preset kits, including **Techno, Minimal Techno, Industrial Techno, Detroit Techno, Acid Techno, Drum & Bass, Ambient, Trap, House, and Dubstep**.

### 2. Advanced Mixer & Effects
*   **Per-Track Mixer:** Individual controls for **Volume** and **Pan** for each of the 8 tracks.
*   **3-Band Equalizer (EQ):** Per-track **Low, Mid, and High gain** controls for precise frequency shaping.
*   **Multiple Effects:** Supports various effects like **Reverb, Delay, Distortion, Filter, Chorus, Phaser, and Bitcrush**, with per-track **Effect Amount** control.

### 3. RemixLive Studio Integration
A dedicated UI panel, accessible via the "Show RemixLive Studio" button, provides a visual hub for advanced sample manipulation:
*   **Track Selection:** A dropdown allows users to select the target track for editing.
*   **Functional Reverse Audio:** The "Reverse audio" button is fully functional, reversing the custom uploaded sample for the selected track in real-time.
*   **Equalizer Shortcut:** The "Equalizer" button provides a shortcut to the main Mixer panel for quick EQ adjustments.
*   **Placeholder Tools:** Includes UI placeholders for future implementation of advanced features like Trim, Split, Merge, Vocal Removal, and Text-to-Speech.

### 4. Workflow & Customization
*   **Custom Sample Upload:** Users can upload their own audio files (WAV, MP3, OGG, etc.) to any track to replace the built-in instrument.
*   **Save/Load:** Ability to save and load patterns as a JSON file.
*   **AI Generate:** A button to quickly generate a random pattern for inspiration.

## Project Structure

The core application logic resides in a single React component for simplicity and performance:

```
/beatforge-studio
├── src/
│   ├── App.jsx           # Main application component (Sequencer, Mixer, Logic)
│   └── App.css           # Styling for the application
├── index.html            # Main HTML file
└── README.md             # This file
```

## Getting Started

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Fabo85/BeatForge-Studio-Pro.git
    cd BeatForge-Studio-Pro
    ```
2.  **Install dependencies:**
    ```bash
    # Assuming you have Node.js and pnpm installed
    pnpm install
    ```
3.  **Start the development server:**
    ```bash
    pnpm run dev
    ```
4.  Open your browser to the address shown in the terminal (usually `http://localhost:5173`).

## License

This project is licensed under the MIT License.
