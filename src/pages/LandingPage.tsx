import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'

// Static data for center circle (URLs don't need translation)
const centerCircleData = {
  stateIds: ['poem-intro', 'tech-stack', 'projects', 'random-page'],
  projects: [
    { key: 'food-shop', url: 'https://github.com/tulamia311/food-shop' },
    { key: 'landing-page', url: 'https://github.com/tulamia311/landing-page' },
  ],
  links: [
    { key: 'github', url: 'https://github.com/tulamia311' },
    { key: 'tulamia', url: 'https://tulamia.site' },
  ],
}

interface ActiveState {
  id: string
  type: string
}

function LandingPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null)
  const [toggledGroups, setToggledGroups] = useState<number[]>([])
  const [activeState, setActiveState] = useState<ActiveState | null>(null)
  const [isLuffyModalOpen, setIsLuffyModalOpen] = useState(false)
  const [hoveredOuterSquare, setHoveredOuterSquare] = useState<number | null>(null)
  const [activeOuterSquareId, setActiveOuterSquareId] = useState<number | null>(null)
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
    let classes = `lp-grid-item lp-square-${squareNum}`

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

  // Pick a random state ID (excluding previous if possible)
  const pickRandomStateId = (previousId?: string | null): ActiveState => {
    const ids = centerCircleData.stateIds
    const pool = ids.length > 1 && previousId ? ids.filter(id => id !== previousId) : ids
    const id = pool[Math.floor(Math.random() * pool.length)]
    // Determine type based on id
    let type = 'poem'
    if (id === 'tech-stack') type = 'tech'
    else if (id === 'projects') type = 'projects'
    else if (id === 'random-page') type = 'random'
    return { id, type }
  }

  const handleCenterHover = () => {
    setActiveState(prev => pickRandomStateId(prev?.id))
  }

  const handleCenterClick = () => {
    setActiveState(prev => prev ?? pickRandomStateId(null))
    setIsLuffyModalOpen(true)
  }

  const closeLuffyModal = () => {
    setIsLuffyModalOpen(false)
    // Clear the active state so the tooltip does not linger after closing
    setActiveState(null)
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
      setActiveOuterSquareId(squareNum)
      setIsOuterModalOpen(true)
    }
  }

  const closeOuterModal = () => {
    setIsOuterModalOpen(false)
  }

  return (
    <div className="lp-app-shell">
      <div className="lp-header-row">
        <div className="lp-lang-switcher">
          <button
            className={`lp-lang-btn ${i18n.resolvedLanguage === 'en' ? 'active' : ''}`}
            onClick={() => i18n.changeLanguage('en')}
          >
            EN
          </button>
          <span className="lp-divider">|</span>
          <button
            className={`lp-lang-btn ${i18n.resolvedLanguage === 'de' ? 'active' : ''}`}
            onClick={() => i18n.changeLanguage('de')}
          >
            DE
          </button>
        </div>
        <ThemeToggle />
        <button
          className="lp-wiki-btn"
          onClick={() => navigate('/wiki')}
          title="Open Documentation"
          aria-label="Open Documentation"
        >
          📖
        </button>
      </div>
      <div
        className="lp-grid-container"
        onMouseLeave={() => {
          // When leaving the grid entirely and no modal is open, clear the tooltip state
          if (!isLuffyModalOpen) {
            setActiveState(null)
          }
        }}
      >
        {Array.from({ length: 16 }).map((_, index) => {
          const squareNum = index + 1
          const isInnerSquare = [6, 7, 10, 11].includes(squareNum)
          const isOuter = outerSquares.includes(squareNum)
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
              data-topic={t(`innerSquares.${squareNum}.topic`, { defaultValue: '' })}
            >
              {isOuter && (
                <span className="lp-outer-square-label">{t(`outerSquares.${squareNum}.label`)}</span>
              )}
              {isOuter && isVisible && hoveredOuterSquare === squareNum && (
                <div className="lp-outer-square-tooltip">{t(`outerSquares.${squareNum}.tooltipTitle`)}</div>
              )}
            </div>
          )
        })}
        <div
          className="lp-center-circle"
          onMouseEnter={handleCenterHover}
          onClick={handleCenterClick}
        />
        {activeState && (
          <div className="lp-luffy-tooltip">
            {t(`centerCircle.states.${activeState.id}.title`)}
          </div>
        )}
      </div>
      {isLuffyModalOpen && activeState && (
        <div className="lp-modal-backdrop" onClick={closeLuffyModal}>
          <div
            className="lp-modal"
            onClick={event => {
              event.stopPropagation()
            }}
          >
            <button
              type="button"
              className="lp-modal-close"
              onClick={closeLuffyModal}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="lp-modal-title">{t(`centerCircle.states.${activeState.id}.title`)}</h2>
            {(activeState.type === 'poem' || activeState.type === 'tech') && (
              <div className="lp-modal-body">
                {t(`centerCircle.states.${activeState.id}.description`, { defaultValue: '' }).split('\n').map((line: string, index: number) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            )}
            {activeState.type === 'projects' && (
              <div className="lp-modal-body">
                <ul>
                  {centerCircleData.projects.map(project => (
                    <li key={project.url}>
                      <a href={project.url} target="_blank" rel="noreferrer">
                        {t(`centerCircle.projects.${project.key}`)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {activeState.type === 'random' && (
              <div className="lp-modal-body">
                <ul>
                  {centerCircleData.links.map(link => (
                    <li key={link.url}>
                      <a href={link.url} target="_blank" rel="noreferrer">
                        {t(`centerCircle.links.${link.key}`)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      {isOuterModalOpen && activeOuterSquareId && (
        <div className="lp-modal-backdrop" onClick={closeOuterModal}>
          <div
            className="lp-modal"
            onClick={event => {
              event.stopPropagation()
            }}
          >
            <button
              type="button"
              className="lp-modal-close"
              onClick={closeOuterModal}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="lp-modal-title">{t(`outerSquares.${activeOuterSquareId}.tooltipTitle`)}</h2>
            <div className="lp-modal-body">
              <p>{t(`outerSquares.${activeOuterSquareId}.modalBody`)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandingPage
