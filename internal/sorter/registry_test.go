package sorter

import (
	"reflect"
	"testing"
)

type mockSorter struct {
	id string
}

func (m *mockSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{ID: m.id, Name: "Mock Sort " + m.id}
}

func (m *mockSorter) Sort(input []int) Trace {
	return Trace{}
}

func TestRegistry(t *testing.T) {
	// Clear registry for test
	registryMu.Lock()
	registry = make(map[string]Sorter)
	registryMu.Unlock()

	s1 := &mockSorter{id: "mock1"}
	s2 := &mockSorter{id: "mock2"}

	Register(s1)
	Register(s2)

	t.Run("Get", func(t *testing.T) {
		s, ok := Get("mock1")
		if !ok {
			t.Errorf("Expected to get mock1, but it was not found")
		}
		if s.Meta().ID != "mock1" {
			t.Errorf("Expected mock1 ID, got %s", s.Meta().ID)
		}

		_, ok = Get("mock3")
		if ok {
			t.Errorf("Expected not to get mock3, but it was found")
		}
	})

	t.Run("List", func(t *testing.T) {
		metas := List()
		if len(metas) != 2 {
			t.Errorf("Expected 2 registered algorithms, got %d", len(metas))
		}

		expected := []AlgorithmMeta{
			{ID: "mock1", Name: "Mock Sort mock1"},
			{ID: "mock2", Name: "Mock Sort mock2"},
		}

		if !reflect.DeepEqual(metas, expected) {
			t.Errorf("Expected list %v, got %v", expected, metas)
		}
	})
}
