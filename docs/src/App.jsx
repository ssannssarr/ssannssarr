import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import Lenis from 'lenis'
import Scene from './Scene'

const GH = 'https://github.com/ssannssarr'
const ease = [0.16, 1, 0.3, 1]
const nav = ['about', 'work', 'skills', 'currently', 'education', 'contact']
let lenis

const projects = [
  {
    label: '01 · WEB / PWA', name: 'CITK Notes', featured: true,
    desc: 'A portable notes platform for CIT Kokrajhar students. Built to make class notes easier to access, share, and use across devices.',
    story: [
      ['Problem', "Students often depend on class notes and miss material when they aren't able to attend."],
      ['Built', 'A documentation-style web app with an installable PWA experience.'],
      ['Stack', 'MkDocs · Markdown · CSS · JavaScript · GitHub Pages'],
    ],
    tags: ['PWA', 'MkDocs', 'GitHub Pages'],
    live: 'https://ssannssarr.github.io/notes/', repo: GH + '/notes',
  },
  {
    label: '02 · AI / CLI', name: 'Zuni',
    desc: 'A lightweight AI-assisted terminal companion for quick technical questions, sitting between web search and heavyweight AI tools.',
    story: [
      ['Problem', 'Switching between search engines and large AI tools can interrupt a terminal workflow.'],
      ['Built', 'A Python CLI combining LLM responses, parsing, tools, and web search for quick terminal-first answers.'],
      ['Stack', 'Python · LLM APIs · CLI · Web Search · HTTP APIs'],
    ],
    tags: ['Python', 'LLMs', 'CLI'],
    live: 'https://ssannssarr.github.io/Zuni/', repo: GH + '/Zuni',
  },
]

const skills = [
  ['Languages', ['Python', 'JavaScript', 'HTML', 'CSS']],
  ['Tools', ['Git', 'GitHub', 'Linux', 'Termux']],
  ['Exploring', ['AI / ML', 'LLMs', 'Web Development', 'APIs']],
]

/* Scroll-driven depth: each block tilts in from below, sits flat, then recedes. */
function Depth({ children, className = '' }) {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const opacity = useTransform(p, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const scale = useTransform(p, [0, 0.25, 0.75, 1], [0.86, 1, 1, 0.94])
  const rotateX = useTransform(p, [0, 0.25, 0.75, 1], [16, 0, 0, -8])
  const y = useTransform(p, [0, 1], [70, -70])
  return (
    <div ref={ref} className={'depth ' + className}>
      <motion.div style={{ opacity, scale, rotateX, y, transformOrigin: '50% 100%' }}>{children}</motion.div>
    </div>
  )
}

const Heading = ({ n, title }) => (
  <Depth>
    <div className="section-heading"><span className="section-number">{n}</span><h2>{title}</h2></div>
  </Depth>
)

function Word({ text, delay, className }) {
  return (
    <span className={'word ' + (className || '')}>
      {[...text].map((c, i) => (
        <motion.span key={i} className="ch" initial={{ y: '110%', rotateX: -80 }} animate={{ y: 0, rotateX: 0 }}
          transition={{ duration: 1.1, delay: delay + i * 0.05, ease }}>{c}</motion.span>
      ))}
    </span>
  )
}

function Hero() {
  const ref = useRef(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(p, [0, 1], [0, 160])
  const opacity = useTransform(p, [0, 0.8], [1, 0])
  const scale = useTransform(p, [0, 1], [1, 0.88])
  const fade = (d) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay: d, ease } })
  return (
    <section className="hero" ref={ref}>
      <motion.div className="hero-content" style={{ y, opacity, scale }}>
        <motion.div className="avatar-wrapper" {...fade(0)}>
          <img src="https://github.com/ssannssarr.png" alt="SANTANU SARKAR GitHub avatar" className="avatar" />
          <span className="status-dot" />
        </motion.div>
        <motion.p className="eyebrow" {...fade(0.1)}>CSE STUDENT · CIT KOKRAJHAR</motion.p>
        <h1><Word text="SANTANU" delay={0.25} /><Word text="SARKAR" delay={0.6} className="dim" /></h1>
        <motion.p className="hero-title" {...fade(1.1)}>CSE Student exploring the <span>SWE world.</span></motion.p>
        <motion.p className="hero-description" {...fade(1.25)}>
          I build things to understand how they work. Currently exploring software engineering, AI/ML,
          web development, and whatever interesting problem comes next.
        </motion.p>
        <motion.div className="hero-actions" {...fade(1.4)}>
          <a href={GH} target="_blank" rel="noopener noreferrer" className="button button-primary">View GitHub ↗</a>
          <a href="#work" className="button button-secondary">See my work ↓</a>
        </motion.div>
      </motion.div>
    </section>
  )
}

function Card({ p }) {
  const rx = useSpring(0, { stiffness: 160, damping: 16 })
  const ry = useSpring(0, { stiffness: 160, damping: 16 })
  const move = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 10)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10)
  }
  return (
    <motion.article className={'project-card' + (p.featured ? ' featured' : '')}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={move} onMouseLeave={() => { rx.set(0); ry.set(0) }}>
      <div className="project-top">
        <div><span className="project-label">{p.label}</span><h3>{p.name}</h3></div>
        <span className="project-arrow">↗</span>
      </div>
      <p className="project-description">{p.desc}</p>
      <div className="project-story">
        {p.story.map(([k, v]) => (<div key={k}><span>{k}</span><p>{v}</p></div>))}
      </div>
      <div className="project-footer">
        <div className="tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>
        <div className="project-links">
          <a href={p.live} target="_blank" rel="noopener noreferrer">Live ↗</a>
          <a href={p.repo} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        </div>
      </div>
    </motion.article>
  )
}

/* Outlined marquee that slides sideways as you scroll. */
function Band() {
  const { scrollYProgress } = useScroll()
  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-70%'])
  const t = 'BUILD · BREAK · DEBUG · REBUILD · '
  return <div className="band" aria-hidden="true"><motion.div style={{ x }}>{t.repeat(6)}</motion.div></div>
}

export default function App() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 })
    let id
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf) }
    id = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(id); lenis.destroy(); lenis = null }
  }, [])

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -50% 0px' }
    )
    document.querySelectorAll('section[id]').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  const go = (e) => {
    const h = e.currentTarget.getAttribute('href')
    if (!h?.startsWith('#')) return
    e.preventDefault()
    setOpen(false)
    lenis ? lenis.scrollTo(h, { duration: 1.6 }) : document.querySelector(h)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Scene progress={scrollYProgress} />
      <div className="vignette" />
      <motion.div className="progress" style={{ scaleX: bar }} />

      <header className="nav">
        <button className={'menu-button' + (open ? ' open' : '')} aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
          <span /><span />
        </button>
        <nav className={'nav-links' + (open ? ' open' : '')}>
          {nav.map((n) => (
            <a key={n} href={'#' + n} onClick={go} className={active === n ? 'active' : ''}>{n[0].toUpperCase() + n.slice(1)}</a>
          ))}
        </nav>
        <a href={GH} target="_blank" rel="noopener noreferrer" className="nav-github">GitHub ↗</a>
      </header>

      <main>
        <Hero />

        <section id="about" className="section">
          <Heading n="01" title="About" />
          <Depth>
            <div className="about-grid">
              <p className="large-text">I started with Python, but I don't really think in terms of one language.</p>
              <div className="about-text">
                <p>I'm a first-semester Diploma CSE student at CIT Kokrajhar, interested in software engineering and AI/ML.</p>
                <p>I learn technologies when I need them, usually by building something and figuring out why it breaks. Debugging is one of the parts of development I enjoy most.</p>
                <p>My goal is to keep moving deeper into software engineering while exploring AI systems and machine learning.</p>
              </div>
            </div>
          </Depth>
        </section>

        <section id="work" className="section">
          <Heading n="02" title="Selected Work" />
          <Depth><p className="section-description">A few things I've built while learning.</p></Depth>
          {projects.map((p) => (<Depth key={p.name}><Card p={p} /></Depth>))}
        </section>

        <Band />

        <section id="skills" className="section">
          <Heading n="03" title="What I Work With" />
          <div className="skills">
            {skills.map(([label, list]) => (
              <Depth key={label}>
                <div className="skill-group">
                  <span className="skill-label">{label}</span>
                  <div className="skill-list">
                    {list.map((s) => (<motion.span key={s} whileHover={{ y: -3, color: '#fff' }}>{s}</motion.span>))}
                  </div>
                </div>
              </Depth>
            ))}
          </div>
        </section>

        <section id="currently" className="section">
          <Heading n="04" title="Currently" />
          <Depth>
            <div className="currently">
              <div className="currently-main">
                <span className="pulse" />
                <p>Learning, building, breaking things, and rebuilding them.</p>
              </div>
              <div className="currently-list">
                {['Software Engineering', 'AI / ML', 'LLM Systems', 'Web Development', 'Developer Tools'].map((s) => (
                  <motion.span key={s} whileHover={{ x: 8, color: '#fff' }}>{s}</motion.span>
                ))}
              </div>
            </div>
          </Depth>
        </section>

        <section id="education" className="section">
          <Heading n="05" title="Education" />
          <Depth>
            <div className="education-card">
              <div>
                <span className="education-label">2026 — Present</span>
                <h3>Diploma in Computer Science &amp; Engineering</h3>
                <p>Central Institute of Technology Kokrajhar</p>
              </div>
              <span className="education-location">Assam, India</span>
            </div>
          </Depth>
        </section>

        <section id="contact" className="contact">
          <Depth>
            <p className="eyebrow">06 · CONTACT</p>
            <h2>Let's build <span>something.</span></h2>
            <p className="contact-text">I'm interested in interesting problems, software, and things worth building.</p>
            <div className="contact-links">
              <motion.a whileHover={{ y: -3 }} href="mailto:ssannssarrai@gmail.com" className="contact-link">Email ↗</motion.a>
              <motion.a whileHover={{ y: -3 }} href={GH} target="_blank" rel="noopener noreferrer" className="contact-link">GitHub ↗</motion.a>
            </div>
          </Depth>
        </section>
      </main>

      <footer className="footer">
        <span>© {new Date().getFullYear()} SANTANU SARKAR</span>
        <span>CSE Student exploring the SWE world.</span>
      </footer>
    </>
  )
}
