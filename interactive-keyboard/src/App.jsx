import React from 'react'
import './App.css'

function App() {
  // Przechowuje aktualny tekst wpisywany przez użytkownika, 
  // historię czatu, stan klawisza Caps Lock oraz stan klawisza Shift
  const [text, setText] = React.useState('')
  const [chat, setChat] = React.useState([])
  const [capsLock, setCapsLock] = React.useState(false)
  const [shiftActive, setShiftActive] = React.useState(false)
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

    // --- CTRL I ALT nie robi nic na ten moment -----> program go ignoruje --> 
    if (label === 'Ctrl' || label === 'Alt') return

    // W przeciwnym razie wstaw znak(i) 
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
  }

  return (
    <div className="app-root">
      <h1>Klawiatura interaktywna</h1>

      <div className="input-area">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)} // Pozwala również na wpisywanie z fizycznej klawiatury
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
            {row.map((k, ki) => (
              <button
                key={ki}
                aria-pressed={k === 'Caps' ? capsLock : (k === 'Shift' ? shiftActive : undefined)}
                className={['key', k.length > 1 ? 'wide' : '', (k === 'Caps' && capsLock) || (k === 'Shift' && shiftActive) ? 'active' : ''].join(' ').trim()}
                onClick={() => handleKey(k === '\\' ? '\\' : k)}
              >
                {k}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default App

