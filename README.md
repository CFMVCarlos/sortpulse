# SortPulse ⚡

An interactive, high-performance sorting algorithm visualization lab built with a **Go** backend engine and a **React + TypeScript** frontend with HTML5 Canvas and synthesized audio.

Built as a personal project for [Boot.dev](https://boot.dev).

---

## 🎯 Features

- **High-Performance Go Sorter Engine**: Algorithms generate deterministic step-by-step traces (`compare`, `swap`, `overwrite`, `pivot`, `mark_sorted`).
- **Video-Style Playback Controls**: Play, pause, speed adjustment (1x–50x), step forward, step backward, and timeline scrubbing.
- **HTML5 Canvas 60 FPS Rendering**: Smooth, hardware-accelerated bar animations with intuitive color coding.
- **Web Audio API Synth**: Dynamic tone frequency mapped to element values—hear the algorithm sort in real time!
- **Comprehensive Algorithm Lab**:
  - **O(n²)**: Bubble Sort, Selection Sort, Insertion Sort
  - **O(n log n)**: Quick Sort, Merge Sort, Heap Sort
  - **O(n)**: Counting Sort, Radix Sort (LSD)
- **Pedagogical Callouts & Metrics**: Real-time comparison counts, swap counts, execution time, and algorithmic complexity badges.
- **Single-Binary Distribution**: Production build embeds the compiled React frontend into the Go executable via `//go:embed`.

---

## 📂 Project Structure

```text
sortpulse/
├── cmd/
│   └── server/          # Go HTTP server and embedded static file serving
├── internal/
│   ├── sorter/          # Core sorting algorithms and trace recording engine
│   └── api/             # REST API handlers and CORS middleware
├── frontend/            # React + TypeScript + Vite frontend application
│   └── src/             # Canvas visualizer, playback controls, and audio engine
├── ARCHITECTURE.md      # Detailed system architecture and data contracts
├── PLAN.md              # 20–40 hour phased implementation roadmap
└── README.md            # Project documentation and quickstart
```

---

## 🚀 Getting Started

### Prerequisites

- [Go](https://golang.org/) (version 1.22+)
- [Node.js](https://nodejs.org/) (version 18+) and `npm`

### Local Development Setup

To run both backend and frontend with live reloading:

1. **Start the Go Backend Server**:
   ```bash
   go run ./cmd/server
   ```
   The backend API will run on `http://localhost:8080`.

2. **Start the React Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🧪 Testing

Run backend algorithm unit tests:

```bash
go test -v ./internal/sorter/...
```

---

## 📖 Architecture & Implementation Plan

- Read [ARCHITECTURE.md](file:///home/cfmv/BootDev/sortpulse/ARCHITECTURE.md) for deep-dive diagrams, data schemas, and component design.
- Follow [PLAN.md](file:///home/cfmv/BootDev/sortpulse/PLAN.md) for the 20–40 hour step-by-step development roadmap.
