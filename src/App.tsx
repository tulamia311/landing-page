import { useState } from 'react'
import './App.css'
import ThemeToggle from './components/ThemeToggle'
import outerSquaresContent from './outerSquaresContent.json'
import innerSquaresContent from './innerSquaresContent.json'
import centerCircleContent from './centerCircleContent.json'

interface OuterSquareContent {
  id: number
  label: string
  tooltipTitle: string
  modalBody: string
}

interface InnerSquareContent {
  id: number
  topic: string
}

interface CenterCircleState {
  id: string
  type: string
  title: string
  description?: string
  projects?: { label: string; url: string }[]
  links?: { label: string; url: string }[]
}

function App() {
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null)
  const [toggledGroups, setToggledGroups] = useState<number[]>([])
  const [activeLuffyState, setActiveLuffyState] = useState<CenterCircleState | null>(null)
  const [isLuffyModalOpen, setIsLuffyModalOpen] = useState(false)
  const [hoveredOuterSquare, setHoveredOuterSquare] = useState<number | null>(null)
  const [activeOuterSquare, setActiveOuterSquare] = useState<OuterSquareContent | null>(null)
  const [isOuterModalOpen, setIsOuterModalOpen] = useState(false)

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

  const luffyStates = centerCircleContent.states as CenterCircleState[]

  const pickRandomLuffyState = (previous?: CenterCircleState | null): CenterCircleState => {
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

  // Helper to get outer square content by id
  const getOuterSquareContent = (squareNum: number): OuterSquareContent | undefined => {
    return (outerSquaresContent.squares as OuterSquareContent[]).find(s => s.id === squareNum)
  }

  // Check if an outer square is currently visible (not blurred)
  const isOuterSquareVisible = (squareNum: number): boolean => {
    return Object.entries(hoverTargets).some(([group, targets]) => {
      const groupNum = parseInt(group)
      if (targets.includes(squareNum)) {
        return groupNum === hoveredGroup || toggledGroups.includes(groupNum)
      }
      return false
    })
  }

  // Outer square hover handler
  const handleOuterSquareHover = (squareNum: number) => {
    if (isOuterSquareVisible(squareNum)) {
      setHoveredOuterSquare(squareNum)
    }
  }

  // Outer square click handler
  const handleOuterSquareClick = (squareNum: number) => {
    if (isOuterSquareVisible(squareNum)) {
      const content = getOuterSquareContent(squareNum)
      if (content) {
        setActiveOuterSquare(content)
        setIsOuterModalOpen(true)
      }
    }
  }

  const closeOuterModal = () => {
    setIsOuterModalOpen(false)
  }

  // Helper to get inner square content by id
  const getInnerSquareContent = (squareNum: number): InnerSquareContent | undefined => {
    return (innerSquaresContent.squares as InnerSquareContent[]).find(s => s.id === squareNum)
  }

  return (
    <div className="app-shell">
      <ThemeToggle />
      <div className="grid-container">
        {Array.from({ length: 16 }).map((_, index) => {
          const squareNum = index + 1
          const isInnerSquare = [6, 7, 10, 11].includes(squareNum)
          const isOuter = outerSquares.includes(squareNum)
          const outerContent = isOuter ? getOuterSquareContent(squareNum) : null
          const isVisible = isOuter && isOuterSquareVisible(squareNum)

          return (
            <div
              key={index}
              className={getClassName(index)}
              onMouseEnter={() => {
                if (isInnerSquare) setHoveredGroup(squareNum)
                if (isOuter) handleOuterSquareHover(squareNum)
              }}
              onMouseLeave={() => {
                if (isInnerSquare) setHoveredGroup(null)
                if (isOuter) setHoveredOuterSquare(null)
              }}
              onClick={() => {
                if (isInnerSquare) toggleGroup(squareNum)
                if (isOuter) handleOuterSquareClick(squareNum)
              }}
              data-topic={getInnerSquareContent(squareNum)?.topic}
            >
              {isOuter && outerContent && (
                <span className="outer-square-label">{outerContent.label}</span>
              )}
              {isOuter && isVisible && hoveredOuterSquare === squareNum && outerContent && (
                <div className="outer-square-tooltip">{outerContent.tooltipTitle}</div>
              )}
            </div>
          )
        })}
        <div
          className="center-circle"
          onMouseEnter={handleCenterHover}
          onMouseLeave={() => setActiveLuffyState(null)}
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
      {isOuterModalOpen && activeOuterSquare && (
        <div className="luffy-modal-backdrop" onClick={closeOuterModal}>
          <div
            className="luffy-modal"
            onClick={event => {
              event.stopPropagation()
            }}
          >
            <button
              type="button"
              className="luffy-modal-close"
              onClick={closeOuterModal}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="luffy-modal-title">{activeOuterSquare.tooltipTitle}</h2>
            <div className="luffy-modal-body">
              <p>{activeOuterSquare.modalBody}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
