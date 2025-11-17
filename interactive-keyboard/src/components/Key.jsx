import React from 'react'

export default function Key({
  k,
  displayLabel,
  shiftedChar,
  isLetterKey,
  active,
  pressed,
  onClick,
  onPointerDown,
  onPointerUp,
  ariaPressed
}) {
  const classes = ['key', k.length > 1 ? 'wide' : '']
  if (active) classes.push('active')
  if (pressed) classes.push('pressed')

  const labelNode = shiftedChar && !isLetterKey ? (
    <div className="key-label">
      <span className="primary">{k}</span>
      <span className="secondary">{shiftedChar}</span>
    </div>
  ) : (
    displayLabel
  )

  return (
    <button
      className={classes.join(' ')}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onPointerLeave={onPointerUp}
      aria-pressed={ariaPressed}
    >
      {labelNode}
    </button>
  )
}
