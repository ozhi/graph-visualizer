package main

// 5т! бизнес процес - блок схема (написано+нарисувано): как се къпя

import (
	"flag"
	"fmt"
	"math/rand"
	"time"
)

// Solution holds a potential solution to the n queens problem, which has >= 0 conflicts.
type Solution struct {
	n      int
	queens []int
	rand   *rand.Rand
}

// NewSolution creates a new potential solution.
func NewSolution(n int) *Solution {
	return &Solution{
		n:      n,
		queens: make([]int, n, n),
		rand:   rand.New(rand.NewSource(time.Now().UnixNano())),
	}
}

// EliminateConflicts iteratively eliminates the solution's conflicts,
// using the min conflicts algorithm.
func (s *Solution) EliminateConflicts() {
	for s.totalConflicts() > 0 {
		queen := s.mostConflictingQueen()
		pos := s.bestPosition(queen)
		s.queens[queen] = pos
	}
}

// Print prints the solution.
func (s *Solution) Print() {
	for row := 0; row < s.n; row++ {
		for col := 0; col < s.n; col++ {
			queenFound := false
			for queen := 0; queen < s.n; queen++ {
				if queen == col && s.queens[col] == row {
					queenFound = true
				}
			}

			if queenFound {
				fmt.Print("\u265B")
			} else {
				fmt.Print(" ")
			}
		}

		fmt.Println()
	}
}

// conflicts returns how many conflicts the given queen makes.
func (s *Solution) conflicts(queen int) int {
	s.check(queen)

	count := 0
	for i := 0; i < s.n; i++ {
		if s.queens[i] == s.queens[queen] ||
			s.queens[i]-i == s.queens[queen]-queen ||
			s.queens[i]+i == s.queens[queen]+queen {

			count++
		}
	}

	return count - 1 // not counting the queen's conflict with itself
}

// totalConflicts returns how many conflicts there are on the board in total.
func (s *Solution) totalConflicts() int {
	count := 0
	for q := 0; q < s.n; q++ {
		count += s.conflicts(q)
	}
	if count%2 != 0 {
		panic(fmt.Errorf("Unexpected (odd) number of conflicts: %d", count))
	}
	return count / 2
}

// mostConflictingQueen returns one (random) of the most conflicting queens.
func (s *Solution) mostConflictingQueen() int {
	mostConflicts := -1
	mostConflicting := make([]int, 0)

	for queen := 0; queen < s.n; queen++ {
		conflicts := s.conflicts(queen)

		if conflicts > mostConflicts {
			mostConflicts = conflicts
			mostConflicting = []int{queen}
		} else if conflicts == mostConflicts {
			mostConflicting = append(mostConflicting, queen)
		}
	}

	return mostConflicting[s.rand.Intn(len(mostConflicting))]
}

// bestPosition returns one (random) of the best positions the given queen can be moved to.
func (s *Solution) bestPosition(queen int) int {
	s.check(queen)

	leastConflicts := s.n
	bestPositions := make([]int, 0)
	oldPosition := s.queens[queen]

	for pos := 0; pos < s.n; pos++ {
		s.queens[queen] = pos
		conflicts := s.conflicts(queen)

		if conflicts < leastConflicts {
			leastConflicts = conflicts
			bestPositions = []int{pos}
		} else if conflicts == leastConflicts {
			bestPositions = append(bestPositions, pos)
		}
	}

	s.queens[queen] = oldPosition
	return bestPositions[s.rand.Intn(len(bestPositions))]
}

// check ensures that the given queen is valid.
func (s *Solution) check(queen int) {
	if queen < 0 || queen >= s.n {
		panic(fmt.Errorf("queen %d out of bounds", queen))
	}
}

func main() {
	var n int
	flag.IntVar(&n, "n", 8, "number of queens")
	flag.Parse()

	solution := NewSolution(n)
	fmt.Printf("Solving for %d queens...\n", n)
	solution.EliminateConflicts()
	solution.Print()
}
