import { useState } from 'react'
import './App.css'

function App() {
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null)
  const [toggledGroups, setToggledGroups] = useState<number[]>([])

  // Map inner squares to their outer square targets
  const hoverTargets: Record<number, number[]> = {
    6: [1, 2, 5],
    7: [3, 4, 8],
    10: [9, 13, 14],
    11: [12, 15, 16]
  }

  // Outer squares that should be blurred by default
  const outerSquares = [1, 2, 3, 4, 5, 8, 9, 12, 13, 14, 15, 16]

  const toggleGroup = (groupNum: number) => {
    setToggledGroups(prev => {
      if (prev.includes(groupNum)) {
        return prev.filter(g => g !== groupNum)
      } else {
        return [...prev, groupNum]
      }
    })
  }

  const getClassName = (index: number) => {
    const squareNum = index + 1
    let classes = `grid-item square-${squareNum}`

    // If it's an outer square
    if (outerSquares.includes(squareNum)) {
      // Check if it belongs to any active group (hovered or toggled)
      const isVisible = Object.entries(hoverTargets).some(([group, targets]) => {
        const groupNum = parseInt(group)
        // Check if this square is a target of this group
        if (targets.includes(squareNum)) {
          // Visible if this group is hovered OR toggled
          return groupNum === hoveredGroup || toggledGroups.includes(groupNum)
        }
        return false
      })

      if (isVisible) {
        classes += ' visible'
      } else {
        classes += ' blurred'
      }
    }

    // Add active class to inner squares if they are toggled
    if (toggledGroups.includes(squareNum)) {
      classes += ' active-switch'
    }

    return classes
  }

  return (
    <div className="grid-container">
      {Array.from({ length: 16 }).map((_, index) => {
        const squareNum = index + 1
        const isInteractive = [6, 7, 10, 11].includes(squareNum)

        return (
          <div
            key={index}
            className={getClassName(index)}
            onMouseEnter={() => isInteractive && setHoveredGroup(squareNum)}
            onMouseLeave={() => isInteractive && setHoveredGroup(null)}
            onClick={() => isInteractive && toggleGroup(squareNum)}
          />
        )
      })}
      <div className="center-circle" />
    </div>
  )
}

export default App
