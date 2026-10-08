package api

import (
	"encoding/json"
	"net/http"

	"sortpulse/internal/sorter"
)

// HandleAlgorithms returns a list of all registered sorting algorithms.
func HandleAlgorithms(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	metas := sorter.List()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(metas)
}

type SortRequest struct {
	Algorithm string `json:"algorithm"`
	Array     []int  `json:"array"`
}

// HandleSort executes a sort using the specified algorithm and input array.
func HandleSort(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req SortRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid JSON payload", http.StatusBadRequest)
		return
	}

	if len(req.Array) == 0 {
		http.Error(w, "Array cannot be empty", http.StatusBadRequest)
		return
	}

	if len(req.Array) > 500 {
		http.Error(w, "Array is too large (max 500 items)", http.StatusBadRequest)
		return
	}

	s, ok := sorter.Get(req.Algorithm)
	if !ok {
		http.Error(w, "Unknown algorithm", http.StatusBadRequest)
		return
	}

	trace := s.Sort(req.Array)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trace)
}
