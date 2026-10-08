<div align="center">

# SortPulse ⚡

**Interactive, high-performance sorting algorithm visualization lab**

[![Go Version](https://img.shields.io/badge/Go-1.22+-00ADD8?style=for-the-badge&logo=go)](https://golang.org)
[![React Version](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

*Built as a personal project for [Boot.dev](https://boot.dev)*

</div>

---

## 🎯 Features

- 🚀 **High-Performance Go Sorter Engine**: Algorithms generate deterministic step-by-step traces (`compare`, `swap`, `overwrite`, `pivot`, `mark_sorted`).
- ⏯️ **Video-Style Playback Controls**: Play, pause, speed adjustment (1x–50x), step forward, step backward, and timeline scrubbing.
- 🎨 **HTML5 Canvas 60 FPS Rendering**: Smooth, hardware-accelerated bar animations with intuitive color coding.
- 🎵 **Web Audio API Synth**: Dynamic tone frequency mapped to element values—hear the algorithm sort in real time!
- 🧪 **Comprehensive Algorithm Lab**:
  - **O(n²)**: Bubble Sort, Selection Sort, Insertion Sort
  - **O(n log n)**: Quick Sort, Merge Sort, Heap Sort
  - **O(n)**: Counting Sort, Radix Sort (LSD)
- 📊 **Pedagogical Callouts & Metrics**: Real-time comparison counts, swap counts, execution time, and algorithmic complexity badges.
- 📦 **Single-Binary Distribution**: Production build embeds the compiled React frontend into the Go executable via `//go:embed`.

---

## 🕹️ Controls / API Reference

### Playback Controls
| Control | Action | Description |
| :--- | :--- | :--- |
| <kbd>Play</kbd> / <kbd>Pause</kbd> | Toggle Animation | Starts or pauses the current sorting algorithm animation. |
| <kbd>Speed Slider</kbd> | Adjust Delay | Changes playback speed dynamically from 1x to 50x. |
| <kbd>Scrubber</kbd> | Timeline Jump | Instantly navigate to any specific step in the sorting process. |
| <kbd>Step Forward</kbd> / <kbd>Backward</kbd> | Manual Nav | Advance or reverse the trace by exactly one discrete step. |

### REST API Endpoints
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/algorithms` | `GET` | Returns a JSON array of all registered algorithms and their metadata (Big-O complexities). |
| `/api/sort` | `POST` | Accepts a JSON payload with `algorithm` and `array`. Returns a fully deterministic `Trace` response. |

---

## 📂 Project Architecture Hierarchy

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

### 📦 Single-Binary Production Build

SortPulse can be compiled into a single executable where the React frontend is embedded directly into the Go binary.

Using `make` (recommended):
```bash
make build
./sortpulse
```

Or using the bash script directly:
```bash
./scripts/build.sh
./sortpulse
```

The application will be served fully on `http://localhost:8080`.

### 🛠️ Local Development Setup

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
   Open `http://localhost:5173` in your browser. The frontend will dynamically proxy API calls to the backend on `localhost:8080`.

---

## 🧪 Code Quality & Verification Commands

Using the Makefile:
```bash
make test  # Runs all Go unit tests
make lint  # Runs oxlint on the React frontend
```

Or manually:
```bash
go test -v ./...
npm --prefix frontend run lint
```

---

## 📖 Architecture & Implementation Plan

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for deep-dive diagrams, data schemas, and component design.
- Follow [PLAN.md](./PLAN.md) for the 20–40 hour step-by-step development roadmap.
