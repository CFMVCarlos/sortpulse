package sorter

type StepType string

const (
	StepCompare    StepType = "compare"
	StepSwap       StepType = "swap"
	StepOverwrite  StepType = "overwrite"
	StepPivot      StepType = "pivot"
	StepMarkSorted StepType = "mark_sorted"
)

type Step struct {
	Type        StepType `json:"type"`
	Indices     []int    `json:"indices"`
	Description string   `json:"description"`
	Value       *int     `json:"value,omitempty"`
}

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

type Sorter interface {
	Meta() AlgorithmMeta
	Sort(input []int) Trace
}
