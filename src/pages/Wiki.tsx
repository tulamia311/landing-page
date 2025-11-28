import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useNavigate } from 'react-router-dom'

// Import markdown files as raw strings
import deploymentMd from '../../docs/deployment.md?raw'
import uiOverviewMd from '../../docs/ui-overview.md?raw'
import techOverviewMd from '../../docs/tech-overview.md?raw'
import contentCustomizationMd from '../../docs/content-customization.md?raw'

const docs = [
  { id: 'ui-overview', title: 'UI Overview', content: uiOverviewMd },
  { id: 'tech-overview', title: 'Technical Overview', content: techOverviewMd },
  { id: 'content-customization', title: 'Content Customization', content: contentCustomizationMd },
  { id: 'deployment', title: 'Deployment Guide', content: deploymentMd },
]

export default function Wiki() {
  const [activeDocId, setActiveDocId] = useState(docs[0].id)
  const navigate = useNavigate()

  const activeDoc = docs.find(d => d.id === activeDocId) || docs[0]

  return (
    <div className="wiki-container">
      <aside className="wiki-sidebar">
        <div className="wiki-header">
          <button onClick={() => navigate('/')} className="back-btn">
            ← Back to App
          </button>
          <h2>Wiki / Docs</h2>
        </div>
        <nav className="wiki-nav">
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
      <main className="wiki-content">
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {activeDoc.content}
          </ReactMarkdown>
        </div>
      </main>
    </div>
  )
}
