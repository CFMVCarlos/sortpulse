package sorter

type Tracer struct {
	arr   []int
	steps []Step
	comps int
	swaps int
}

func (t *Tracer) Compare(i, j int, desc string) bool {
	t.comps++
	t.steps = append(t.steps, Step{
		Type:        StepCompare,
		Indices:     []int{i, j},
		Description: desc,
	})
	return t.arr[i] > t.arr[j]
}

func (t *Tracer) Swap(i, j int, desc string) {
	t.swaps++
	t.arr[i], t.arr[j] = t.arr[j], t.arr[i]
	t.steps = append(t.steps, Step{
		Type:        StepSwap,
		Indices:     []int{i, j},
		Description: desc,
	})
}

func (t *Tracer) MarkSorted(i int, desc string) {
	t.steps = append(t.steps, Step{
		Type:        StepMarkSorted,
		Indices:     []int{i},
		Description: desc,
	})
}
