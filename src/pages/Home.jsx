import { Brain, Compass, Zap } from 'lucide-react'
import Header from '../components/Header.jsx'
import SEO from '../components/SEO.jsx'
import PaperCard from '../components/PaperCard.jsx'
import ResearchTerm from '../components/ResearchTerm.jsx'
import { EncryptedText } from '../components/ui/encrypted-text.jsx'
import KaggleIcon from '../components/icons/KaggleIcon.jsx'
import { papers } from '../data/papers.js'
import { siteDescription } from '../data/site.js'
import { researchTerms } from '../data/researchTerms.js'
import { problemSolvingLinks, sweLinks } from '../data/misc.js'

const dockLinks = [
  {
    href: 'https://github.com/aruneem-bhowmick',
    icon: 'bi-github',
    label: 'github',
  },
  {
    href: 'https://www.kaggle.com/aruneembhowmick',
    icon: KaggleIcon,
    label: 'kaggle',
  },
  {
    href: 'https://www.linkedin.com/in/aruneem-bhowmick/',
    icon: 'bi-linkedin',
    label: 'linkedin',
  },
  {
    href: 'https://substack.com/@aruneembhowmick',
    icon: 'bi-substack',
    label: 'substack',
  },
  {
    href: 'https://x.com/aruneembhowmick',
    icon: 'bi-twitter-x',
    label: 'x',
  },
]

export default function Home() {
  return (
    <div className="app-shell">
      <SEO title="Aruneem Bhowmick" description={siteDescription} path="/" />
      <Header />

      <main className="home">
        <section className="bio-section">
          <div className="bio-portrait-col">
            <div className="bio-portrait">
              <img src="/images/pfp.jpg" alt="profile photo" />
            </div>

            <nav className="dock" aria-label="quick links">
              {dockLinks.map((d) => (
                <a
                  key={d.href}
                  href={d.href}
                  className="dock-item"
                  target="_blank"
                  rel="noreferrer"
                  aria-label={d.label}
                  title={d.label}
                >
                  {typeof d.icon === 'string' ? (
                    <i className={`bi ${d.icon}`} aria-hidden="true"></i>
                  ) : (
                    <d.icon />
                  )}
                </a>
              ))}
            </nav>
          </div>

          <div className="bio-text">
            <h1 className="brand-name">
              <EncryptedText
                text="Aruneem Bhowmick"
                encryptedClassName="encrypted-char"
                revealDelayMs={60}
                flipDelayMs={40}
              />
            </h1>
            <p>Hi, I'm Aruneem Bhowmick.</p>
            <p>
              I study computer science, data science, and mathematics at the{' '}
              <a href="https://raikes.unl.edu/" target="_blank" rel="noreferrer">
                Raikes School
              </a>{' '}
              at the University of Nebraska-Lincoln.
            </p>
            <p>
              I'm currently researching informed early-halting criteria for LLMs, with the goal
              of designing halting signals based on representation geometry rather than
              output-based heuristics.
            </p>
            <p>
              I ship software to become a better researcher, read philosophy to become a
              better thinker, and design systems to become a better learner.
            </p>
          </div>
        </section>

        <section className="section">
          <h2 className="section-heading">
            research <span className="heading-sep" aria-hidden="true">•</span>{' '}
            <span className="heading-icon" aria-hidden="true">
              <Brain size={20} strokeWidth={2} />
              <Zap size={11} strokeWidth={2.5} className="heading-icon-badge" />
            </span>
          </h2>
          <p className="section-blurb">
            My interests include{' '}
            <ResearchTerm {...researchTerms['reasoning architectures']}>
              reasoning architectures
            </ResearchTerm>
            ,{' '}
            <ResearchTerm {...researchTerms['representation learning']}>
              representation learning
            </ResearchTerm>
            , and{' '}
            <ResearchTerm {...researchTerms['mechanistic interpretability']}>
              mechanistic interpretability
            </ResearchTerm>
            .
          </p>

          <div className="paper-list">
            {papers.map((p) => (
              <PaperCard key={p.id} paper={p} />
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-heading">
            elsewhere <span className="heading-sep" aria-hidden="true">•</span>{' '}
            <span className="heading-icon" aria-hidden="true">
              <Compass size={20} strokeWidth={2} />
            </span>
          </h2>

          <div className="misc-row">
            <div className="misc-tag">
              <i className="bi bi-puzzle" aria-hidden="true"></i> problem solving
            </div>
            <ul className="plain-list misc-links">
              {problemSolvingLinks.map((w) => (
                <li key={w.href}>
                  <a href={w.href} target="_blank" rel="noreferrer">
                    {w.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="misc-row">
            <div className="misc-tag">
              <i className="bi bi-code-slash" aria-hidden="true"></i> swe
            </div>
            <ul className="plain-list misc-links">
              {sweLinks.map((w) => (
                <li key={w.href}>
                  <a href={w.href} target="_blank" rel="noreferrer">
                    {w.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}
