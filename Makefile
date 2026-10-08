.PHONY: all build run test lint clean

all: build

build:
	@./scripts/build.sh

run: build
	./sortpulse

test:
	go test -v ./...

lint:
	npm --prefix frontend run lint

clean:
	rm -f sortpulse
	rm -rf frontend/dist
