# SortPulse Implementation Plan & Roadmap

This plan provides a structured, step-by-step path to guide your implementation of **SortPulse** over **20–40 hours**. Each phase builds naturally upon the previous one with clear milestones and verification checks.

---

## Time Budget Overview

| Phase | Focus Area | Estimated Time |
| :--- | :--- | :--- |
| **Phase 1** | Go Core Domain & Sorter Engine (Models, Tracer, Bubble Sort) | 3 – 5 hours |
| **Phase 2** | Go HTTP REST API & CORS Middleware | 2 – 4 hours |
| **Phase 3** | React + Vite UI Setup & HTML5 Canvas Visualizer | 6 – 8 hours |
| **Phase 4** | Algorithm Suite Expansion (O(n²), O(n log n), O(n)) | 8 – 12 hours |
| **Phase 5** | Timeline Scrubber, Step Rewind & Audio Engine | 4 – 6 hours |
| **Phase 6** | Single-Binary Embedding, Polish & Documentation | 2 – 4 hours |
| **Total** | | **25 – 39 hours** |

---

## Phase 1: Go Core Domain & Sorter Engine (3–5 hrs)

### Objective
Create the core Go types and algorithm interface with an initial working Bubble Sort and comprehensive unit tests.

### Tasks
- [x] Create `internal/sorter/model.go`:
  - Define `StepType` constants: `compare`, `swap`, `overwrite`, `pivot`, `mark_sorted`.
  - Define `Step`, `AlgorithmMeta`, and `Trace` structs with JSON tags.
  - Define the `Sorter` interface (`Meta() AlgorithmMeta` and `Sort(input []int) Trace`).
- [x] Create `internal/sorter/tracer.go`:
  - Implement a helper struct `Tracer` that manages step history, comparison counts, swap counts, and array state.
  - Add helper methods: `Compare(i, j int, desc string) bool`, `Swap(i, j int, desc string)`, `MarkSorted(i int, desc string)`.
- [x] Create `internal/sorter/bubble.go`:
  - Implement standard Bubble Sort using the `Tracer`.
  - Ensure the output trace accurately records all comparisons and swaps.
  - Mark elements sorted as the outer loop finishes each pass.
- [x] Create `internal/sorter/bubble_test.go`:
  - Test with empty slice, single-element slice, already sorted slice, and reverse sorted slice.
  - Verify `final_array` matches standard `sort.Ints()` output.
  - Assert `total_steps > 0` and step indices are within bounds.

### Milestone 1 Check
Run `go test -v ./internal/sorter/...` and see all tests pass cleanly.

---

## Phase 2: Go HTTP REST API & CORS (2–4 hrs)

### Objective
Expose the sorting engine over clean HTTP endpoints and allow the React frontend to communicate during development.

### Tasks
- [x] Create `internal/sorter/registry.go`:
  - Build a central registry map (`map[string]Sorter`) with `Register()`, `Get(id string) (Sorter, bool)`, and `List() []AlgorithmMeta`.
  - Register `bubble` sort in the registry.
- [x] Create `internal/api/handlers.go`:
  - `GET /api/algorithms`: returns JSON array of all registered algorithm metadata.
  - `POST /api/sort`: decodes JSON request payload `{"algorithm": "...", "array": [...]}` and returns JSON `Trace`.
  - Add input validation: reject empty arrays, excessively large arrays (>500 items for safety), or unknown algorithm IDs.
- [x] Create `internal/api/cors.go`:
  - Implement simple CORS middleware to allow requests from `http://localhost:5173` (Vite dev server) with appropriate headers (`Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`).
- [x] Create `cmd/server/main.go`:
  - Wire the router, apply CORS middleware, parse command-line flags (e.g. `-port=8080`), and start the server.

### Milestone 2 Check
Start server via `go run ./cmd/server` and test with `curl`:
```bash
curl http://localhost:8080/api/algorithms
curl -X POST http://localhost:8080/api/sort -H "Content-Type: application/json" -d '{"algorithm":"bubble","array":[5,3,8,1]}'
```

---

## Phase 3: React + Canvas Visualizer (6–8 hrs)

### Objective
Build the interactive React frontend that fetches the trace and animates sorting bars on an HTML5 Canvas at 60 FPS.

### Tasks
- [x] Set up project structure in `frontend/src`:
  - `types/sort.ts`: TypeScript interfaces matching Go's JSON responses (`Step`, `Trace`, `AlgorithmMeta`).
  - `api/client.ts`: Fetch helpers for `/api/algorithms` and `/api/sort`.
- [x] Create `components/ControlBar.tsx`:
  - Dropdown to select algorithm.
  - Array size slider (e.g. 10 to 150 items).
  - "Generate New Array" / "Shuffle" button (with presets: Random, Reverse, Nearly Sorted).
  - Play / Pause button and Speed slider (delay per step from 1ms to 200ms).
- [x] Create `components/CanvasVisualizer.tsx`:
  - Render vertical bars inside an HTML5 `<canvas>` using `requestAnimationFrame`.
  - Dynamically calculate bar width, spacing, and height proportional to array values and canvas dimensions.
  - Color bars according to state (default blue, comparing yellow, swapping red, sorted green).
- [x] State Machine in `App.tsx`:
  - Fetch trace on sort trigger.
  - Maintain `currentStepIndex` state.
  - Step through `trace.steps` sequentially on timer ticks or animation frames.

### Milestone 3 Check
Launch Vite (`npm run dev`) and Go server. Click "Sort" and watch Bubble Sort animate smoothly with play/pause functionality!

---

## Phase 4: Algorithm Suite Expansion (8–12 hrs)

### Objective
Implement the comprehensive algorithm lab, covering quadratic, logarithmic, and linear non-comparison sorts.

### Algorithm Catalog to Implement

1. **Quadratic Sorts (O(n²))**:
   - [x] `internal/sorter/insertion.go`: Insertion Sort (tracks shifting elements).
   - [x] `internal/sorter/selection.go`: Selection Sort (highlights minimum candidate).
2. **Efficient Comparison Sorts (O(n log n))**:
   - [x] `internal/sorter/quick.go`: Quicksort (highlight pivot indices, show partition bounds).
   - [x] `internal/sorter/merge.go`: Merge Sort (uses `overwrite` step type as auxiliary arrays merge back).
   - [x] `internal/sorter/heap.go`: Heap Sort (visualize heapify sift-down operations and max-element extractions).
3. **Non-Comparison Distribution Sorts (O(n))**:
   - [x] `internal/sorter/counting.go`: Counting Sort (computes frequency array, overwrites values).
   - [x] `internal/sorter/radix.go`: Radix Sort (LSD digit-by-digit sorting).

### Tasks
- [x] Write unit tests for every newly added algorithm in `internal/sorter/*_test.go`.
- [x] Populate detailed `AlgorithmMeta` fields for each algorithm (Best, Average, Worst complexity, space, description).
- [x] Update frontend UI to display an educational info card with current algorithm specs and big-O notation.

### Milestone 4 Check
All 7 algorithms are listed in the dropdown, each passes unit tests, and each animates correctly in the browser.

---

## Phase 5: Timeline Scrubber & Web Audio Engine (4–6 hrs)

### Objective
Add video-style scrubber controls (rewind/scrub) and synthesized audio feedback.

### Tasks
- [x] **State Reconstruction / Bidirectional Scrubbing**:
  - Store initial array snapshot before sorting.
  - To jump to step `k`: replay steps `0` through `k` against a fresh copy of the initial array to compute exact array state at step `k`.
  - Connect this to an interactive `<input type="range" min="0" max={totalSteps} />` scrubber bar.
- [x] **Step-by-Step Navigation**:
  - Add "Step Forward" and "Step Backward" buttons for granular frame-by-frame analysis.
- [x] **Web Audio API Engine** (`utils/audio.ts`):
  - Initialize an `AudioContext`.
  - Create a frequency mapper: `freq = 120 + (val / maxVal) * (880 - 120)`.
  - On `compare` or `swap` steps, trigger a short oscillator tone (30ms duration, triangle waveform, linear volume decay).
  - Add a persistent mute/unmute toggle button with saved preference in `localStorage`.

### Milestone 5 Check
Drag the scrubber bar back and forth to see the array rewind and fast-forward cleanly. Unmute audio to hear pitch harmonies during the sort!

---

## Phase 6: Production Embedding & Polish (2–4 hrs)

### Objective
Create a unified, single-binary distribution using Go `embed`, polish styling, and prepare repository for Boot.dev submission.

### Tasks
- [x] Embed React build into Go:
  - Add `//go:embed all:frontend/dist` in `cmd/server/main.go`.
  - Use `http.FS` and `http.FileServer` to serve the embedded frontend as the fallback route for the root `/`.
- [x] Add Makefile or `scripts/build.sh`:
  - Automate `npm --prefix frontend run build` followed by `go build -o sortpulse ./cmd/server`.
- [x] Complete `README.md`:
  - Showcase features, architecture, and complexity table.
  - Include instructions for running in dev mode vs building the single binary.
  - Add screenshots or GIF recordings of the visualizer.
- [x] Push to GitHub and submit to Boot.dev!

---

## Git Commit Milestone Strategy

To show clean, professional version history:

1. `feat(core): initialize Go models, tracer, and bubble sort with unit tests`
2. `feat(api): add REST endpoints for algorithms and sort execution with CORS`
3. `feat(frontend): scaffold React Vite project and implement canvas bar renderer`
4. `feat(ui): add play/pause playback controls, speed slider, and shuffle generator`
5. `feat(sorter): implement insertion, selection, quick, and merge sorts`
6. `feat(sorter): implement heap, counting, and radix distribution sorts`
7. `feat(controls): implement timeline scrubber and bidirectional step navigation`
8. `feat(audio): add Web Audio API pitch synthesis and mute control`
9. `feat(build): embed frontend dist into Go binary for single-executable release`
10. `docs: add comprehensive README with setup instructions and architecture guide`
