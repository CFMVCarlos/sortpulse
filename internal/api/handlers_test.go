package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"sortpulse/internal/sorter"
)

func TestHandleAlgorithms(t *testing.T) {
	// Ensure BubbleSorter is registered
	sorter.Register(&sorter.BubbleSorter{})

	req, err := http.NewRequest("GET", "/api/algorithms", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleAlgorithms)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	var metas []sorter.AlgorithmMeta
	err = json.Unmarshal(rr.Body.Bytes(), &metas)
	if err != nil {
		t.Fatal(err)
	}

	if len(metas) == 0 {
		t.Errorf("Expected at least 1 algorithm, got 0")
	}
}

func TestHandleSort_Valid(t *testing.T) {
	sorter.Register(&sorter.BubbleSorter{})

	reqBody := SortRequest{
		Algorithm: "bubble",
		Array:     []int{3, 1, 2},
	}
	bodyBytes, _ := json.Marshal(reqBody)

	req, err := http.NewRequest("POST", "/api/sort", bytes.NewReader(bodyBytes))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleSort)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}

	var trace sorter.Trace
	err = json.Unmarshal(rr.Body.Bytes(), &trace)
	if err != nil {
		t.Fatal(err)
	}

	if trace.Algorithm != "bubble" {
		t.Errorf("Expected algorithm 'bubble', got %v", trace.Algorithm)
	}
	if len(trace.FinalArray) != 3 {
		t.Errorf("Expected FinalArray of length 3, got %v", len(trace.FinalArray))
	}
}

func TestHandleSort_InvalidAlgorithm(t *testing.T) {
	reqBody := SortRequest{
		Algorithm: "unknown",
		Array:     []int{3, 1, 2},
	}
	bodyBytes, _ := json.Marshal(reqBody)

	req, err := http.NewRequest("POST", "/api/sort", bytes.NewReader(bodyBytes))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleSort)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusBadRequest)
	}
}

func TestHandleSort_EmptyArray(t *testing.T) {
	sorter.Register(&sorter.BubbleSorter{})

	reqBody := SortRequest{
		Algorithm: "bubble",
		Array:     []int{},
	}
	bodyBytes, _ := json.Marshal(reqBody)

	req, err := http.NewRequest("POST", "/api/sort", bytes.NewReader(bodyBytes))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleSort)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusBadRequest)
	}
}

func TestHandleSort_TooLargeArray(t *testing.T) {
	sorter.Register(&sorter.BubbleSorter{})

	arr := make([]int, 501)
	reqBody := SortRequest{
		Algorithm: "bubble",
		Array:     arr,
	}
	bodyBytes, _ := json.Marshal(reqBody)

	req, err := http.NewRequest("POST", "/api/sort", bytes.NewReader(bodyBytes))
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(HandleSort)

	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusBadRequest {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusBadRequest)
	}
}
