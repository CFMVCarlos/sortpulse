package frontend

import (
	"embed"
	"io/fs"
)

//go:embed all:dist
var distFS embed.FS

// DistFS returns a filesystem containing the frontend build assets.
func DistFS() (fs.FS, error) {
	return fs.Sub(distFS, "dist")
}
