#!/bin/bash
go run ./cmd/server > server_output.log 2>&1 &
npm --prefix frontend run dev > frontend_output.log 2>&1 &
