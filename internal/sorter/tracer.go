package sorter

// Tracer manages trace history recording, operation counters, and array state during sorting execution.
type Tracer struct {
	arr   []int
	steps []Step
	comps int
	swaps int
}

// Compare records a comparison operation between arr[i] and arr[j], increments comparisons, and returns true if arr[i] > arr[j].
func (t *Tracer) Compare(i, j int, desc string) bool {
	t.comps++
	t.steps = append(t.steps, Step{
		Type:        StepCompare,
		Indices:     []int{i, j},
		Description: desc,
	})
	return t.arr[i] > t.arr[j]
}

// Swap exchanges values at indices i and j, increments the swap counter, and logs a swap step.
func (t *Tracer) Swap(i, j int, desc string) {
	t.swaps++
	t.arr[i], t.arr[j] = t.arr[j], t.arr[i]
	t.steps = append(t.steps, Step{
		Type:        StepSwap,
		Indices:     []int{i, j},
		Description: desc,
	})
}

// Overwrite places val at index i, updating internal array state and logging an overwrite step.
func (t *Tracer) Overwrite(i int, val int, desc string) {
	t.arr[i] = val
	valCopy := val
	t.steps = append(t.steps, Step{
		Type:        StepOverwrite,
		Indices:     []int{i},
		Description: desc,
		Value:       &valCopy,
	})
}

// Pivot logs a pivot selection step for partition-based algorithms like quicksort.
func (t *Tracer) Pivot(i int, desc string) {
	t.steps = append(t.steps, Step{
		Type:        StepPivot,
		Indices:     []int{i},
		Description: desc,
	})
}

// MarkSorted logs that the element at index i has reached its definitive sorted location.
func (t *Tracer) MarkSorted(i int, desc string) {
	t.steps = append(t.steps, Step{
		Type:        StepMarkSorted,
		Indices:     []int{i},
		Description: desc,
	})
}
