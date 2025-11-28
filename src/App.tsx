import { useState } from 'react'
import './App.css'
import ThemeToggle from './components/ThemeToggle'
import { luffyStates, type LuffyState } from './luffyStates'

function App() {
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null)
  const [toggledGroups, setToggledGroups] = useState<number[]>([])
  const [activeLuffyState, setActiveLuffyState] = useState<LuffyState | null>(null)
  const [isLuffyModalOpen, setIsLuffyModalOpen] = useState(false)

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

  const pickRandomLuffyState = (previous?: LuffyState | null): LuffyState => {
    if (luffyStates.length === 0) {
      throw new Error('No Luffy states configured')
    }

    const pool =
      luffyStates.length > 1 && previous
        ? luffyStates.filter(state => state.id !== previous.id)
        : luffyStates

    const index = Math.floor(Math.random() * pool.length)
    return pool[index]
  }

  const handleCenterHover = () => {
    setActiveLuffyState(prev => pickRandomLuffyState(prev))
  }

  const handleCenterClick = () => {
    setActiveLuffyState(prev => prev ?? pickRandomLuffyState(null))
    setIsLuffyModalOpen(true)
  }

  const closeLuffyModal = () => {
    setIsLuffyModalOpen(false)
  }

  // Topics for inner squares
  const topics: Record<number, string> = {
    6: 'Infrastructure',
    7: 'Projects',
    10: 'Miscellaneous',
    11: 'Documentation'
  }

  return (
    <div className="app-shell">
      <ThemeToggle />
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
              data-topic={topics[squareNum]}
            />
          )
        })}
        <div
          className="center-circle"
          onMouseEnter={handleCenterHover}
          onClick={handleCenterClick}
        />
        {activeLuffyState && (
          <div className="luffy-tooltip">
            {activeLuffyState.title}
          </div>
        )}
      </div>
      {isLuffyModalOpen && activeLuffyState && (
        <div className="luffy-modal-backdrop" onClick={closeLuffyModal}>
          <div
            className="luffy-modal"
            onClick={event => {
              event.stopPropagation()
            }}
          >
            <button
              type="button"
              className="luffy-modal-close"
              onClick={closeLuffyModal}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="luffy-modal-title">{activeLuffyState.title}</h2>
            {activeLuffyState.description && (
              <div className="luffy-modal-body">
                {activeLuffyState.description.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}
            {activeLuffyState.projects && activeLuffyState.projects.length > 0 && (
              <div className="luffy-modal-body">
                <ul>
                  {activeLuffyState.projects.map(project => (
                    <li key={project.url}>
                      <a href={project.url} target="_blank" rel="noreferrer">
                        {project.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeLuffyState.links && activeLuffyState.links.length > 0 && (
              <div className="luffy-modal-body">
                <ul>
                  {activeLuffyState.links.map(link => (
                    <li key={link.url}>
                      <a href={link.url} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
