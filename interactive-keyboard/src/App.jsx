import React from 'react'
import './App.css'

function App() {
  // Przechowuje aktualny tekst wpisywany przez użytkownika, 
  // historię czatu, stan klawisza Caps Lock oraz stan klawisza Shift
  const [text, setText] = React.useState('')
  const [chat, setChat] = React.useState([])
  const [capsLock, setCapsLock] = React.useState(false)
  const [shiftActive, setShiftActive] = React.useState(false)
  const [altActive, setAltActive] = React.useState(false)
  const idRef = React.useRef(1) 
  // idRef ---> dokładnie jeden ref do przechowywania ID wiadomości czatu

  // Znaki, które pojawiają się po naciśnięciu klawisza Shift wraz z danym klawiszem
  const shifted = {
    '`': '~',
    '1': '!',
    '2': '@',
    '3': '#',
    '4': '$',
    '5': '%',
    '6': '^',
    '7': '&',
    '8': '*',
    '9': '(',
    '0': ')',
    '-': '_',
    '=': '+',
    '[': '{',
    ']': '}',
    '\\': '|',
    ';': ':',
    "'": '"',
    ',': '<',
    '.': '>',
    '/': '?'
  }

  // Alt (AltGr) mapping for Polish diacritics when Alt is active + letter
  const altMap = {
    a: 'ą',
    c: 'ć',
    e: 'ę',
    l: 'ł',
    n: 'ń',
    o: 'ó',
    s: 'ś',
    z: 'ż',
    x: 'ź'
  }

  // Układ wierszy (ciągi znaków). Użyj '___________________________' dla długiego klawisza spacji.
  const rows = [
    ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'],
    ['Tab','Q','W','E','R','T','Y','U','I','O','P','[',']','\\'],
    ['Caps','A','S','D','F','G','H','J','K','L',';','\'','Enter'],
    ['Shift','Z','X','C','V','B','N','M',',','.','/','Shift'],
    ['Ctrl','Alt','___________________________','Alt','Ctrl']
  ]

  function computeChar(label) {
    // Zwraca znak do wstawienia zgodnie z zasadami CAPS LOCK/SHIFT
    if (label.length === 1) {
      const isLetter = /[a-zA-Z]/.test(label) // czy to litera
      if (isLetter) {
        const upper = capsLock ? label.toUpperCase() : label.toLowerCase()
        // jeśli SHIFT jest aktywny, odwróć wielkość liter
        return shiftActive ? (upper === label ? label.toLowerCase() : label.toUpperCase()) : (capsLock ? label.toUpperCase() : label.toLowerCase())
      }
      // jeśli SHIFT jest aktywny i istnieje odpowiednik w shifted, zwróć go
      if (shiftActive && shifted[label]) return shifted[label]
      if (shiftActive && /[a-zA-Z]/.test(label)) return label.toUpperCase() // a-zA-Z oznacza litery, które się zmieniają po naciśnięciu SHIFT
      return label
    }
    return '' // dla klawiszy specjalnych zwróć pusty ciąg
  }

  function handleKey(label) {
    if (label === 'Backspace') {
      setText(t => t.slice(0, -1))
      return
    }
    if (label === 'Tab') {
      setText(t => t + '\t')
      if (shiftActive) setShiftActive(false)
      return
    }
    if (label === '___________________________') { // Klawisz spacji
      setText(t => t + ' ')
      if (shiftActive) setShiftActive(false)
      return
    }
    if (label === 'Enter') {
      // Wysłanie czatu
      const value = text.trim()
      const id = idRef.current++
      if (value.length > 0) {
        setChat(c => [...c, { id, value }]) // Dodaj wiadomość do historii czatu
      }
      setText('') // Wyzerowanaie pola tekstowego po wysłaniu wiadomości
      if (shiftActive) setShiftActive(false)
      return
    }
    if (label === 'Caps') {
      setCapsLock(v => !v) // Przełącz stan CAPS LOCK
      return
    }
    if (label === 'Shift') {
      // Zrób SHIFT aktywnym dla następnego naciśnięcia klawisza
      setShiftActive(true)
      return
    }
    if (label === 'Alt') {
      setAltActive(v => !v)
      return
    }

    // --- CTRL I ALT nie robi nic na ten moment -----> program go ignoruje --> 
    if (label === 'Ctrl' || label === 'Alt') return

    // W przeciwnym razie wstaw znak(i)
    // If Alt virtual is active and letter -> use altMap
    const isLetter = label.length === 1 && /[a-zA-Z]/.test(label)
    if (altActive && isLetter) {
      const lower = label.toLowerCase()
      const mapped = altMap[lower]
      if (mapped) {
        const final = (capsLock || shiftActive) ? mapped.toUpperCase() : mapped
        setText(t => t + final)
        if (altActive) setAltActive(false)
        if (shiftActive) setShiftActive(false)
        return
      }
    }

    const ch = computeChar(label)
    if (ch) {
      // Jeśli to litera, zastosuj odpowiednio logikę caps/shift
      const finalChar = (() => {
        if (label.length === 1 && /[a-zA-Z]/.test(label)) {
          let base = label
          // CAPSLOCK sprawia, że litery są wielkie
          if (capsLock) base = base.toUpperCase()
          else base = base.toLowerCase()
          // jeśli SHIFT jest aktywny, odwróć wielkość liter
          if (shiftActive) base = base === base.toLowerCase() ? base.toUpperCase() : base.toLowerCase()
          return base
        }
        // jeśli SHIFT jest aktywny i istnieje odpowiednik w shifted, zwróć go
        // (jednocyfrowe/pojedyncze znaki nie będące literami)
        if (label.length === 1 && shifted[label] && shiftActive) return shifted[label]
        return label
      })()

      setText(t => t + finalChar)
    }

    // SHIFT działa tylko dla pojedynczego naciśnięcia
    if (shiftActive) setShiftActive(false)
    if (altActive) setAltActive(false)
  }

  // send current text as chat message (used by virtual Enter and physical Enter)
  function sendChat() {
    const value = text.trim()
    const id = idRef.current++
    if (value.length > 0) {
      setChat(c => [...c, { id, value }])
    }
    setText('')
    if (shiftActive) setShiftActive(false)
  }

  // Handlers for physical keyboard input in the textarea
  function handleKeyDownPhysical(e) {
    // update CapsLock visual state from modifier state
    try {
      const caps = e.getModifierState && e.getModifierState('CapsLock')
      setCapsLock(Boolean(caps))
      const alt = e.getModifierState && e.getModifierState('Alt')
      setAltActive(Boolean(alt))
    } catch {
      /* Ignoruj */
    }

    // shift held
    if (e.shiftKey) setShiftActive(true)

    // Tab
    if (e.key === 'Tab') {
      e.preventDefault()
      setText(t => t + '\t')
      return
    }

    // Space
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault()
      setText(t => t + ' ')
      return
    }

    // Alt + letter => diacritic map
    if (e.altKey && !e.ctrlKey) {
      const k = typeof e.key === 'string' ? e.key.toLowerCase() : ''
      if (altMap[k]) {
        e.preventDefault()
        const ch = (e.shiftKey || capsLock) ? altMap[k].toUpperCase() : altMap[k]
        setText(t => t + ch)
        // don't keep alt as sticky when using physical Alt
        return
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      sendChat()
    }
  }

  function handleKeyUpPhysical(e) {
    // update shift state when released
    if (e.key === 'Shift') setShiftActive(false)
    // also update CapsLock in case it toggled on keyup
    try {
      const caps = e.getModifierState && e.getModifierState('CapsLock')
      setCapsLock(Boolean(caps))
      const alt = e.getModifierState && e.getModifierState('Alt')
      setAltActive(Boolean(alt))
    } catch { /* ignore */ }
  }

  return (
    <div className="app-root">
      <h1>Klawiatura interaktywna</h1>

      <div className="input-area">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)} // Pozwala również na wpisywanie z fizycznej klawiatury
          onKeyDown={handleKeyDownPhysical}
          onKeyUp={handleKeyUpPhysical}
          placeholder="Kliknij przyciski klawiatury lub wpisz tutaj..."
        />

        <div className="chat-log">
          {chat.map(m => ( // dla każdej wiadomości w czacie
            <div key={m.id} className="chat-item">#{m.id}: {m.value}</div> // wyświetl wiadomość (ID i wartość wiadomości)
          ))}
        </div>
      </div>

      <div className="keyboard">
        {rows.map((row, ri) => ( // dla każdego wiersza w układzie klawiatury
            <div className="row" key={ri}> 
              {row.map((k, ki) => {
                const isLetterKey = k.length === 1 && /[a-zA-Z]/.test(k)
                // displayLabel: show letters uppercase when CapsLock is ON, otherwise lowercase
                let displayLabel = k
                if (isLetterKey) {
                  displayLabel = capsLock ? k.toUpperCase() : k.toLowerCase()
                  // If shift is active, invert display to indicate effect
                  if (shiftActive) displayLabel = displayLabel === displayLabel.toLowerCase() ? displayLabel.toUpperCase() : displayLabel.toLowerCase()
                }

                // For non-letter single-char keys that have shifted variants, prepare a dual-label rendering
                const hasShiftedVariant = k.length === 1 && Object.prototype.hasOwnProperty.call(shifted, k)
                const shiftedChar = hasShiftedVariant ? shifted[k] : null

                const isCaps = k === 'Caps'
                const isShift = k === 'Shift'
                const isAlt = k === 'Alt'
                const classes = ['key', k.length > 1 ? 'wide' : '']
                if ((isCaps && capsLock) || (isShift && shiftActive) || (isAlt && altActive)) classes.push('active')

                const labelNode = hasShiftedVariant && !isLetterKey ? (
                  <div className="key-label">
                    <span className="primary">{k}</span>
                    <span className="secondary">{shiftedChar}</span>
                  </div>
                ) : (
                  displayLabel
                )

                return (
                  <button
                    key={ki}
                    className={classes.join(' ')}
                    aria-pressed={isCaps ? capsLock : isShift ? shiftActive : isAlt ? altActive : undefined}
                    onClick={() => handleKey(k === '\\' ? '\\' : k)}
                  >
                    {labelNode}
                  </button>
                )
              })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

