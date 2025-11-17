import React from 'react'
import './App.css'
import Keyboard from './components/Keyboard'
import ChatLog from './components/ChatLog'

function App() {
  // Przechowuje aktualny tekst wpisywany przez użytkownika, 
  // historię czatu, stan klawisza Caps Lock oraz stan klawisza Shift
  const [text, setText] = React.useState('')
  const [chat, setChat] = React.useState([])
  const [capsLock, setCapsLock] = React.useState(false)
  const [shiftActive, setShiftActive] = React.useState(false)
  const [altActive, setAltActive] = React.useState(false)
  const [pressedKeys, setPressedKeys] = React.useState([]) // array of labels currently pressed (virtual)
  const idRef = React.useRef(1) 
  // idRef ---> dokładnie jeden ref do przechowywania ID wiadomości czatu

  // Znaki, które pojawiają się po naciśnięciu klawisza Shift wraz z danym klawiszem
  const shifted = React.useMemo(() => ({
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
  }), [])

  // Alt (AltGr) mapowanie dla polskich znaków diakrytycznych, gdy Alt jest aktywny + litera
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
  const rows = React.useMemo(() => ([
    ['`','1','2','3','4','5','6','7','8','9','0','-','=','Backspace'],
    ['Tab','Q','W','E','R','T','Y','U','I','O','P','[',']','\\'],
    ['Caps','A','S','D','F','G','H','J','K','L',';','\'','Enter'],
    ['Shift','Z','X','C','V','B','N','M',',','.','/','Shift'],
    ['Ctrl','Alt','___________________________','Alt','Ctrl']
  ]), [])

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

  // funkcje pomocnicze do zarządzania tablicą pressedKeys (używaj stabilnych ciągów etykiet)
  function addPressedKey(label) {
    setPressedKeys(prev => {
      if (prev.includes(label)) return prev
      return [...prev, label]
    })
  }
  function removePressedKey(label) {
    setPressedKeys(prev => prev.filter(x => x !== label))
  }

  // Tworzy odwrotne mapowanie dla shiftowanych znaków, aby znaleźć, który klawisz odpowiada fizycznemu znakowi
  const shiftedReverse = React.useMemo(() => {
    const rev = {}
    Object.keys(shifted).forEach(k => {
      rev[shifted[k]] = k
    })
    return rev
  }, [shifted])

  // Lista wszystkich renderowanych etykiet (z wierszy) do szybkiego sprawdzenia istnienia
  const allLabels = React.useMemo(() => rows.flat(), [rows])

  function labelFromPhysicalEvent(e) {
    // obsługa popularnych nazwanych klawiszy
    if (e.key === ' ') return '___________________________'
    if (e.key === 'Tab') return 'Tab'
    if (e.key === 'Enter') return 'Enter'
    if (e.key === 'Backspace') return 'Backspace'
    if (e.key === 'CapsLock' || e.key === 'Caps') return 'Caps'
    if (e.key === 'Shift') return 'Shift'
    if (e.key === 'Alt' || e.key === 'AltGraph' || e.key === 'AltLeft' || e.key === 'AltRight') return 'Alt'
    if (e.key === 'Control' || e.key === 'Meta') return 'Ctrl'

    // jeśli to pojedynczy znak
    if (typeof e.key === 'string' && e.key.length === 1) {
      const ch = e.key
      // litera
      if (/[a-zA-Z]/.test(ch)) return ch.toUpperCase()
      // cyfrą lub popularnym znakiem interpunkcyjnym, który bezpośrednio odpowiada etykiecie
      if (allLabels.includes(ch)) return ch
      // sprawdź odwrotne mapowanie shiftowane (np. '!' -> '1')
      if (shiftedReverse[ch]) return shiftedReverse[ch]
      // (np. jeśli etykieta jest wielka, a klawisz fizyczny ma małą literę) -> wtedty zwróć wielką literę
      if (allLabels.includes(ch.toUpperCase())) return ch.toUpperCase()
    }
    return null
  }

  // wysyła aktualny tekst jako wiadomość czatu (używane przez wirtualny Enter i fizyczny Enter)
  function sendChat() {
    const value = text.trim()
    const id = idRef.current++
    if (value.length > 0) {
      setChat(c => [...c, { id, value }])
    }
    setText('')
    if (shiftActive) setShiftActive(false)
  }

  function handleKeyDownPhysical(e) {
    // aktualizuje stan wizualny CAPS LOCK z stanu modyfikatora
    try {
      const caps = e.getModifierState && e.getModifierState('CapsLock')
      setCapsLock(Boolean(caps))
      const alt = e.getModifierState && e.getModifierState('Alt')
      setAltActive(Boolean(alt))
    } catch {
      /* Ignoruj */
    }

  // jeśli SHIFT jest przytrzymany =  to ciągle go używaj --->
  if (e.shiftKey) setShiftActive(true)

  // podświetl odpowiadający wirtualny klawisz
  const label = labelFromPhysicalEvent(e)
  if (label) addPressedKey(label)

    // Tab
    if (e.key === 'Tab') {
      e.preventDefault()
      setText(t => t + '\t')
      return
    }

    // Spacja
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault()
      setText(t => t + ' ')
      return
    }

    // Alt + litera (ą, ć, ę, ł, ń, ó, ś, ż, ź)
    if (e.altKey && !e.ctrlKey) {
      const k = typeof e.key === 'string' ? e.key.toLowerCase() : ''
      if (altMap[k]) {
        e.preventDefault()
        const ch = (e.shiftKey || capsLock) ? altMap[k].toUpperCase() : altMap[k]
        setText(t => t + ch)
        // nie trzymaj alt jako wciśnięty podczas używania fizycznego Alt
        // może to zakłócać dalsze wpisywanie (poprzez użycie komend WINDOW/EDIT itp.)
        return
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      sendChat()
    }
  }

  function handleKeyUpPhysical(e) {
    // jeśli klawisz SHIFT został zwolniony, ustaw shiftActive na false
    if (e.key === 'Shift') setShiftActive(false)
    // usuń podświetlenie odpowiadającego wirtualnego klawisza
    const label = labelFromPhysicalEvent(e)
    if (label) removePressedKey(label)
    // również zaktualizuj CapsLock na wypadek, gdyby został przełączony podczas zwalniania klawisza
    try {
      const caps = e.getModifierState && e.getModifierState('CapsLock')
      setCapsLock(Boolean(caps))
      const alt = e.getModifierState && e.getModifierState('Alt')
      setAltActive(Boolean(alt))
    } catch { /* Ignoruj */ }
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

        <ChatLog chat={chat} />
      </div>

      <Keyboard
        rows={rows}
        shifted={shifted}
        capsLock={capsLock}
        shiftActive={shiftActive}
        altActive={altActive}
        pressedKeys={pressedKeys}
        handleKey={handleKey}
        addPressedKey={addPressedKey}
        removePressedKey={removePressedKey}
      />
    </div>
  )
}

export default App

