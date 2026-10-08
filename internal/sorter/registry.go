package sorter

import (
	"sort"
	"sync"
)

var (
	registryMu sync.RWMutex
	registry   = make(map[string]Sorter)
)

func init() {
	Register(&BubbleSorter{})
	Register(&InsertionSorter{})
	Register(&SelectionSorter{})
	Register(&QuickSorter{})
	Register(&MergeSorter{})
	Register(&HeapSorter{})
	Register(&CountingSorter{})
	Register(&RadixSorter{})
}

// Register adds a Sorter to the registry.
func Register(s Sorter) {
	registryMu.Lock()
	defer registryMu.Unlock()
	registry[s.Meta().ID] = s
}

// Get retrieves a Sorter by its ID.
func Get(id string) (Sorter, bool) {
	registryMu.RLock()
	defer registryMu.RUnlock()
	s, ok := registry[id]
	return s, ok
}

// List returns a slice of AlgorithmMeta for all registered algorithms, sorted by name.
func List() []AlgorithmMeta {
	registryMu.RLock()
	defer registryMu.RUnlock()

	var metas []AlgorithmMeta
	for _, s := range registry {
		metas = append(metas, s.Meta())
	}

	sort.Slice(metas, func(i, j int) bool {
		return metas[i].Name < metas[j].Name
	})

	return metas
}
