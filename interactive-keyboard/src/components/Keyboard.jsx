import Key from './Key'

export default function Keyboard({
  rows,
  shifted,
  capsLock,
  shiftActive,
  altActive,
  pressedKeys,
  handleKey,
  addPressedKey,
  removePressedKey
}) {
  return (
    <div className="keyboard">
      {rows.map((row, ri) => (
        <div className="row" key={ri}>
          {row.map((k, ki) => {
            const isLetterKey = k.length === 1 && /[a-zA-Z]/.test(k)
            let displayLabel = k
            if (isLetterKey) displayLabel = capsLock ? k.toUpperCase() : k.toLowerCase()
            if (isLetterKey && shiftActive) displayLabel = displayLabel === displayLabel.toLowerCase() ? displayLabel.toUpperCase() : displayLabel.toLowerCase()

            const hasShiftedVariant = k.length === 1 && Object.prototype.hasOwnProperty.call(shifted, k)
            const shiftedChar = hasShiftedVariant ? shifted[k] : null

            const isCaps = k === 'Caps'
            const isShift = k === 'Shift'
            const isAlt = k === 'Alt'
            const active = (isCaps && capsLock) || (isShift && shiftActive) || (isAlt && altActive)
            const pressed = pressedKeys.includes(k)

            return (
              <Key
                key={ki}
                k={k}
                displayLabel={displayLabel}
                shiftedChar={shiftedChar}
                isLetterKey={isLetterKey}
                isCaps={isCaps}
                isShift={isShift}
                isAlt={isAlt}
                active={active}
                pressed={pressed}
                onClick={() => handleKey(k === '\\' ? '\\' : k)}
                onPointerDown={() => addPressedKey(k)}
                onPointerUp={() => removePressedKey(k)}
                ariaPressed={isCaps ? capsLock : isShift ? shiftActive : isAlt ? altActive : undefined}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
