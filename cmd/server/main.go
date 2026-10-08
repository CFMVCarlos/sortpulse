package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"sortpulse/internal/api"
)

func main() {
	port := flag.Int("port", 8080, "Port to run the HTTP server on")
	flag.Parse()

	mux := http.NewServeMux()

	mux.HandleFunc("/api/algorithms", api.HandleAlgorithms)
	mux.HandleFunc("/api/sort", api.HandleSort)

	// Wrap mux with CORS middleware
	handler := api.WithCORS(mux)

	addr := fmt.Sprintf(":%d", *port)
	log.Printf("Starting server on %s", addr)

	if err := http.ListenAndServe(addr, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
