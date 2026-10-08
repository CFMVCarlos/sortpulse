package sorter

// StepType defines the classification of a discrete sorting operation.
type StepType string

const (
	// StepCompare represents an element comparison operation between two indices.
	StepCompare StepType = "compare"
	// StepSwap represents an exchange of elements between two indices.
	StepSwap StepType = "swap"
	// StepOverwrite represents writing a new value at a specific index (e.g. merge/counting sort).
	StepOverwrite StepType = "overwrite"
	// StepPivot represents selecting a pivot element (e.g. quicksort).
	StepPivot StepType = "pivot"
	// StepMarkSorted marks an element at an index as having reached its final sorted position.
	StepMarkSorted StepType = "mark_sorted"
)

// Step captures an individual operation event during algorithm execution for visualization replay.
type Step struct {
	Type        StepType `json:"type"`
	Indices     []int    `json:"indices"`
	Description string   `json:"description"`
	Value       *int     `json:"value,omitempty"`
}

// AlgorithmMeta provides pedagogical and asymptotic metadata for a sorting algorithm.
type AlgorithmMeta struct {
	ID              string `json:"id"`
	Name            string `json:"name"`
	Category        string `json:"category"`
	BestTime        string `json:"best_time"`
	AverageTime     string `json:"average_time"`
	WorstTime       string `json:"worst_time"`
	SpaceComplexity string `json:"space_complexity"`
	Stable          bool   `json:"stable"`
	Description     string `json:"description"`
}

// Trace holds the complete execution recording of a sorted array, including step history and performance metrics.
type Trace struct {
	Algorithm       string `json:"algorithm"`
	InitialArray    []int  `json:"initial_array"`
	FinalArray      []int  `json:"final_array"`
	Steps           []Step `json:"steps"`
	TotalSteps      int    `json:"total_steps"`
	Comparisons     int    `json:"comparisons"`
	Swaps           int    `json:"swaps"`
	ExecutionTimeUS int64  `json:"execution_time_us"`
}

// Sorter specifies the interface implemented by all sorting algorithms in SortPulse.
type Sorter interface {
	// Meta returns the algorithm's descriptive metadata and complexity properties.
	Meta() AlgorithmMeta
	// Sort executes the sorting algorithm over an input array and returns an execution trace.
	Sort(input []int) Trace
}
