import { useId, useLayoutEffect, useRef, useState } from 'react'

// Dotted-underline term with a hover/focus popup: a plain definition plus the
// moral case for working in that field. Position is clamped in JS (not pure
// CSS centering) because the trigger phrase can land anywhere along a
// full-width sentence, including near the viewport edge.
export default function ResearchTerm({ definition, moral, children }) {
  const [open, setOpen] = useState(false)
  const [offset, setOffset] = useState(0)
  const wrapRef = useRef(null)
  const popupRef = useRef(null)
  const tooltipId = useId()

  useLayoutEffect(() => {
    if (!open) return
    const wrap = wrapRef.current
    const popup = popupRef.current
    if (!wrap || !popup) return

    const reposition = () => {
      const rect = wrap.getBoundingClientRect()
      const margin = 16
      const half = popup.offsetWidth / 2
      const center = rect.left + rect.width / 2
      const clampedCenter = Math.min(
        Math.max(center, half + margin),
        window.innerWidth - half - margin
      )
      setOffset(clampedCenter - center)
    }

    reposition()
    window.addEventListener('resize', reposition)
    return () => window.removeEventListener('resize', reposition)
  }, [open])

  return (
    <span
      ref={wrapRef}
      className="research-term"
      tabIndex={0}
      aria-describedby={tooltipId}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      onKeyDown={(e) => {
        if (e.key === 'Escape') setOpen(false)
      }}
    >
      {children}
      <span
        ref={popupRef}
        id={tooltipId}
        role="tooltip"
        className={`research-term-popup${open ? ' is-open' : ''}`}
        style={{ transform: `translateX(calc(-50% + ${offset}px))` }}
      >
        <span className="research-term-def">{definition}</span>
        <span className="research-term-moral">{moral}</span>
      </span>
    </span>
  )
}
