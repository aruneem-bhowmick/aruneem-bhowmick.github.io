import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

// How long the cursor must rest on a term before it activates. Without this,
// a cursor merely passing through one term en route to another (they sit a
// few characters apart in the same sentence) instantly flips its underline
// blue via plain CSS :hover, even though the pointer never really stops there.
const HOVER_INTENT_DELAY = 120

// Dotted-underline term with a hover/focus popup: a plain definition plus the
// moral case for working in that field. Position is clamped in JS (not pure
// CSS centering) because the trigger phrase can land anywhere along a
// full-width sentence, including near the viewport edge.
export default function ResearchTerm({ definition, moral, children }) {
  const [open, setOpen] = useState(false)
  const [offset, setOffset] = useState(0)
  const wrapRef = useRef(null)
  const popupRef = useRef(null)
  const openTimerRef = useRef(null)
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

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current)
    }
  }, [])

  const clearOpenTimer = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
  }

  const scheduleOpen = () => {
    clearOpenTimer()
    openTimerRef.current = setTimeout(() => setOpen(true), HOVER_INTENT_DELAY)
  }

  const closeNow = () => {
    clearOpenTimer()
    setOpen(false)
  }

  return (
    <span
      ref={wrapRef}
      className={`research-term${open ? ' is-active' : ''}`}
      tabIndex={0}
      aria-describedby={tooltipId}
      onMouseEnter={scheduleOpen}
      onMouseLeave={closeNow}
      onFocus={() => setOpen(true)}
      onBlur={closeNow}
      onKeyDown={(e) => {
        if (e.key === 'Escape') closeNow()
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
