import { useState, useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useNavigate } from 'react-router-dom'
import mermaid from 'mermaid'

// Import markdown files as raw strings
import uiOverviewMd from '../../docs/ui-overview.md?raw'
import techOverviewMd from '../../docs/tech-overview.md?raw'
import developerGuideMd from '../../docs/developer-guide.md?raw'
import portabilityStandardsMd from '../../docs/portability-standards.md?raw'
import dynamicContentMd from '../../docs/dynamic-content.md?raw'
import deploymentMd from '../../docs/deployment.md?raw'

const docs = [
  { id: 'ui-overview', title: 'UI Overview', content: uiOverviewMd },
  { id: 'tech-overview', title: 'Technical Overview', content: techOverviewMd },
  { id: 'developer-guide', title: 'Developer Guide', content: developerGuideMd },
  { id: 'portability', title: 'Portability Standards', content: portabilityStandardsMd },
  { id: 'dynamic-content', title: 'Dynamic Content', content: dynamicContentMd },
  { id: 'deployment', title: 'Deployment', content: deploymentMd },
]

// Mermaid component
const MermaidDiagram = ({ chart }: { chart: string }) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: document.getElementById('root')?.classList.contains('dark-mode') ? 'dark' : 'default',
        securityLevel: 'loose',
      })
      mermaid.run({
        nodes: [ref.current],
      })
    }
  }, [chart])

  return (
    <div className="mermaid" ref={ref}>
      {chart}
    </div>
  )
}

export default function Wiki() {
  const [activeDocId, setActiveDocId] = useState(docs[0].id)
  const navigate = useNavigate()

  const activeDoc = docs.find(d => d.id === activeDocId) || docs[0]

  return (
    <div className="lp-wiki-container">
      <aside className="lp-wiki-sidebar">
        <div className="lp-wiki-header">
          <button onClick={() => navigate('/')} className="lp-back-btn">
            ← Back to App
          </button>
          <h2>Wiki / Docs</h2>
        </div>
        <nav className="lp-wiki-nav">
          <ul>
            {docs.map(doc => (
              <li key={doc.id}>
                <button
                  className={activeDocId === doc.id ? 'active' : ''}
                  onClick={() => setActiveDocId(doc.id)}
                >
                  {doc.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="lp-wiki-content">
        <div className="lp-markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code(props) {
                const { children, className, ...rest } = props
                const match = /language-(\w+)/.exec(className || '')
                if (match && match[1] === 'mermaid') {
                  // Unescape literal \n characters from markdown raw string
                  return <MermaidDiagram chart={String(children).replace(/\n$/, '').replace(/\\n/g, '\n')} />
                }
                return (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                )
              }
            }}
          >
            {activeDoc.content}
          </ReactMarkdown>
        </div>
      </main>
    </div>
  )
}
