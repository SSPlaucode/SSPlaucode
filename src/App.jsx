import { useEffect, useRef, useState } from 'react'

const PROJECTS = [
  {
    tag: 'MSN 01',
    name: 'ORBIS',
    line: 'Real-time satellite tracker',
    detail: 'Built solo in 48 hours at HackJMI 2026. Propagates live orbits from Celestrak TLE data using SGP4 and satellite.js.',
    stack: ['SGP4', 'satellite.js', 'TLE / Celestrak'],
    status: 'flagship',
    link: 'https://github.com/SSPlaucode/orbis',
    linkLabel: 'View code →',
  },
  {
    tag: 'MSN 02',
    name: 'AETHER',
    line: 'Autonomous constellation manager',
    detail: 'Built for the National Space Hackathon at IIT Delhi. Focused on autonomous coordination of satellite constellations.',
    stack: ['Constellation logic', 'Autonomy'],
    status: 'flagship',
    link: 'https://github.com/SSPlaucode/aether-acm',
    linkLabel: 'View code →',
  },
  {
    tag: 'MSN 03',
    name: 'ADCS Simulator',
    line: 'Attitude determination & control, in Python',
    detail: 'Year 1 of a three-year roadmap toward CubeSat hardware — simulating attitude dynamics and control before touching a board.',
    stack: ['Python', 'Control systems'],
    status: 'in progress',
    link: null,
  },
  {
    tag: 'MSN 04',
    name: 'CampusMove',
    line: 'Real-time e-rickshaw queue management PWA',
    detail: 'Reached the offline finals at SAU Smart Campus Hackathon (out of 28 teams), which led directly to a summer research internship extending the platform under Dr. Kavita Khanna.',
    stack: ['React', 'Node.js/Express', 'PostgreSQL', 'Socket.IO'],
    status: 'live · internship',
    link: 'https://campusmove-wd9m.vercel.app',
    linkLabel: 'View live →',
  },
]

const LOG = [
  {
    when: '2026',
    what: 'Summer Research Intern',
    where: 'South Asian University — under Dr. Kavita Khanna',
    detail: 'Extending CampusMove: bug fixes, GPS integration, analytics, documentation. Migrated production database to Neon (PostgreSQL). Coordinating remotely with an in-person teammate.',
  },
  {
    when: '2025 — present',
    what: 'Robotics Wing Member',
    where: 'CSTC, South Asian University',
    detail: 'Working on robotics and automation projects alongside coursework.',
  },
  {
    when: '2025 — 2029',
    what: 'B.Tech, Computer Science & Engineering',
    where: 'South Asian University, New Delhi',
    detail: 'Second year. Coursework in data structures, systems, and AI, alongside an independent aerospace/robotics track.',
  },
]

const SYSTEMS = [
  { group: 'Languages', items: ['Python', 'C', 'C++'] },
  { group: 'AI / ML', items: ['LLMs', 'REST API integration', 'Prompt engineering', 'AI pipeline design'] },
  { group: 'Frameworks & tools', items: ['FastAPI', 'React', 'Node.js / Express', 'PostgreSQL', 'Socket.IO', 'Git'] },
  { group: 'Currently calibrating', items: ['ROS2', 'LangChain', 'RAG systems', 'Vector databases', 'Agentic workflows'] },
]

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight)
      setProgress(Math.min(1, Math.max(0, scrolled || 0)))
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return progress
}

function AttitudeIndicator() {
  const ref = useRef(null)
  const [tilt, setTilt] = useState({ roll: -6, pitch: 3 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
      setTilt({
        roll: Math.max(-30, Math.min(30, -x * 30)),
        pitch: Math.max(-16, Math.min(16, y * 16)),
      })
    }
    const onLeave = () => setTilt({ roll: -6, pitch: 3 })
    window.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div className="ai-instrument" ref={ref} aria-hidden="true">
      <svg viewBox="0 0 240 240" className="ai-svg">
        <defs>
          <clipPath id="aiClip">
            <circle cx="120" cy="120" r="98" />
          </clipPath>
        </defs>
        <circle cx="120" cy="120" r="102" className="ai-bezel" />
        <g clipPath="url(#aiClip)">
          <g style={{ transform: `rotate(${tilt.roll}deg) translateY(${tilt.pitch * 4}px)`, transformOrigin: '120px 120px' }}>
            <rect x="-60" y="-260" width="360" height="380" className="ai-sky" />
            <rect x="-60" y="120" width="360" height="380" className="ai-ground" />
            <line x1="-60" y1="120" x2="300" y2="120" className="ai-horizon" />
            {[-40, -20, 20, 40].map((deg) => (
              <line
                key={deg}
                x1="90" y1={120 - deg} x2="150" y2={120 - deg}
                className="ai-pitchline"
              />
            ))}
          </g>
        </g>
        <line x1="60" y1="120" x2="95" y2="120" className="ai-index" />
        <line x1="145" y1="120" x2="180" y2="120" className="ai-index" />
        <polygon points="120,108 112,124 128,124" className="ai-index-center" />
        <circle cx="120" cy="120" r="102" className="ai-bezel-ring" />
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i * 10 * Math.PI) / 180
          const long = i % 9 === 0
          const r1 = long ? 88 : 94
          const x1 = 120 + r1 * Math.sin(a)
          const y1 = 120 - r1 * Math.cos(a)
          const x2 = 120 + 100 * Math.sin(a)
          const y2 = 120 - 100 * Math.cos(a)
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="ai-tick" />
        })}
      </svg>
      <div className="ai-readout">
        <span>ROLL {tilt.roll.toFixed(1)}°</span>
        <span>PITCH {tilt.pitch.toFixed(1)}°</span>
      </div>
    </div>
  )
}

function OrbitRule() {
  const progress = useScrollProgress()
  return (
    <div className="orbit-rule" role="presentation">
      <div className="orbit-track">
        <div className="orbit-fill" style={{ width: `${progress * 100}%` }} />
        <div className="orbit-node" style={{ left: `${progress * 100}%` }} />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div className="page">
      <OrbitRule />

      <header className="topbar">
        <div className="topbar-id">
          <span className="topbar-callsign">S. PANWAR</span>
          <span className="topbar-sub">CSE · AEROSPACE &amp; ROBOTICS TRACK</span>
        </div>
        <nav className="topbar-nav">
          <a href="#log">Log</a>
          <a href="#missions">Missions</a>
          <a href="#systems">Systems</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-text">
            <p className="eyebrow">B.TECH CSE · SOUTH ASIAN UNIVERSITY · NEW DELHI</p>
            <h1>
              CS student working on attitude control,
              <span className="hero-accent"> robotics, and orbital systems.</span>
            </h1>
            <p className="hero-sub">
              Second-year CS student interested in aerospace, robotics, and space systems.
              Currently building an ADCS simulator in Python.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#missions">See the missions</a>
              <a className="btn btn-ghost" href="mailto:singhpanwarshubham704@gmail.com">Email me</a>
            </div>
            <div className="hero-links">
              <a href="https://github.com/SSPlaucode" target="_blank" rel="noreferrer">GitHub</a>
              <a href="https://linkedin.com/in/shubham-singh-panwar-34515b387" target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
          <AttitudeIndicator />
        </section>

        <section id="about" className="about">
          <p className="section-label">01 // TRAJECTORY</p>
          <p className="about-text">
            Working through a three-year technical roadmap: attitude determination and
            control simulation this year, autonomous ground robots with SLAM and ROS2 next,
            CubeSat ADCS hardware after that. Everything else — hackathons, the CampusMove
            internship, coursework — runs alongside that spine, not instead of it.
          </p>
        </section>

        <section id="log" className="log">
          <p className="section-label">02 // MISSION LOG</p>
          <div className="log-list">
            {LOG.map((entry) => (
              <div className="log-entry" key={entry.what}>
                <div className="log-when">{entry.when}</div>
                <div className="log-body">
                  <h3>{entry.what}</h3>
                  <p className="log-where">{entry.where}</p>
                  <p className="log-detail">{entry.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="missions" className="missions">
          <p className="section-label">03 // MISSIONS</p>
          <div className="mission-grid">
            {PROJECTS.map((p) => (
              <article className="mission-card" key={p.name}>
                <div className="mission-top">
                  <span className="mission-tag">{p.tag}</span>
                  <span className="mission-status">{p.status}</span>
                </div>
                <h3>{p.name}</h3>
                <p className="mission-line">{p.line}</p>
                <p className="mission-detail">{p.detail}</p>
                <div className="mission-stack">
                  {p.stack.map((s) => <span key={s}>{s}</span>)}
                </div>
                {p.link && (
                  <a className="mission-link" href={p.link} target="_blank" rel="noreferrer">
                    {p.linkLabel || 'View code →'}
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="systems" className="systems">
          <p className="section-label">04 // SYSTEMS</p>
          <div className="systems-grid">
            {SYSTEMS.map((s) => (
              <div className="systems-col" key={s.group}>
                <h4>{s.group}</h4>
                <ul>
                  {s.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="contact">
          <p className="section-label">05 // CONTACT</p>
          <h2>Open to research collaborations, internships, and a good technical argument.</h2>
          <div className="contact-links">
            <a href="mailto:singhpanwarshubham704@gmail.com">singhpanwarshubham704@gmail.com</a>
            <a href="https://github.com/SSPlaucode" target="_blank" rel="noreferrer">github.com/SSPlaucode</a>
            <a href="https://linkedin.com/in/shubham-singh-panwar-34515b387" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} Shubham Singh Panwar</span>
        <span>New Delhi, India</span>
      </footer>
    </div>
  )
}
