package sorter

import (
	"fmt"
	"math/rand"
	"time"
)

// BogoSorter implements Bogo Sort (permutation sort) with a safety iteration limit.
type BogoSorter struct{}

func (s *BogoSorter) Meta() AlgorithmMeta {
	return AlgorithmMeta{
		ID:              "bogo",
		Name:            "Bogo Sort",
		Category:        "comparison",
		BestTime:        "O(n)",
		AverageTime:     "O((n+1)!)",
		WorstTime:       "O(∞)",
		SpaceComplexity: "O(1)",
		Stable:          false,
		Description:     "A highly ineffective, humorous sorting algorithm that repeatedly shuffles an array until it happens to be sorted. Capped by an O(n²) Bubble Sort operation budget to prevent browser freeze.",
	}
}

// calculateMaxShuffles bounds Bogo Sort shuffles so total operations match
// Bubble Sort's O(n²) ceiling, preventing client lag while giving small arrays a chance to sort.
func calculateMaxShuffles(n int) int {
	if n <= 4 {
		return 20
	}
	// Bubble Sort performs at most n*(n-1)/2 comparisons and n*(n-1)/2 swaps (~n² steps).
	// In Bogo Sort, each shuffle requires ~2n steps.
	// Allowing n shuffles yields ~2n² steps, staying strictly on par with Bubble Sort's O(n²).
	// We cap at 100 shuffles to guarantee the web client stays fast and responsive.
	shuffles := n
	if shuffles > 100 {
		shuffles = 100
	}
	return shuffles
}

func (s *BogoSorter) Sort(input []int) Trace {
	startTime := time.Now()

	arr := make([]int, len(input))
	copy(arr, input)

	tracer := NewTracer(arr, len(arr)*20)

	n := len(arr)
	if n > 1 {
		rng := rand.New(rand.NewSource(time.Now().UnixNano()))

		isSorted := func() bool {
			for i := 0; i < n-1; i++ {
				desc := fmt.Sprintf("BogoSort check: comparing arr[%d] (%d) and arr[%d] (%d)", i, tracer.arr[i], i+1, tracer.arr[i+1])
				if tracer.Compare(i, i+1, desc) {
					return false
				}
			}
			return true
		}

		maxShuffles := calculateMaxShuffles(n)
		sorted := isSorted()
		for attempt := 1; attempt <= maxShuffles && !sorted; attempt++ {
			// Fisher-Yates shuffle
			for i := n - 1; i > 0; i-- {
				j := rng.Intn(i + 1)
				if i != j {
					tracer.Swap(i, j, fmt.Sprintf("BogoSort shuffle %d: swapping arr[%d] and arr[%d]", attempt, i, j))
				}
			}

			if isSorted() {
				sorted = true
				break
			}
		}

		if sorted {
			for i := range arr {
				tracer.MarkSorted(i, fmt.Sprintf("arr[%d] is sorted", i))
			}
		} else {
			tracer.steps = append(tracer.steps, Step{
				Type:        StepCompare,
				Indices:     []int{0},
				Description: fmt.Sprintf("BogoSort safety limit reached (%d shuffles, capped on par with Bubble Sort O(n²) operations to prevent browser freeze)", maxShuffles),
			})
		}
	} else if n == 1 {
		tracer.MarkSorted(0, "arr[0] is sorted")
	}

	executionTime := time.Since(startTime).Microseconds()

	initialCopy := make([]int, len(input))
	copy(initialCopy, input)
	return Trace{
		Algorithm:       "bogo",
		InitialArray:    initialCopy,
		FinalArray:      tracer.arr,
		Steps:           tracer.steps,
		TotalSteps:      len(tracer.steps),
		Comparisons:     tracer.comps,
		Swaps:           tracer.swaps,
		ExecutionTimeUS: executionTime,
	}
}
