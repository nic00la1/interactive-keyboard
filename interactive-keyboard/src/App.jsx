export default App
import './App.css'

function App() {

  return (
    <>
      <div>
        <h1>Klawiatura interaktywna</h1>
        <textarea></textarea>
        <div className='keyboard'>
          {/* Rząd 1 - 14 Przycisków*/}
          <div className='row'>
            <button>`</button>
            <button>1</button>
            <button>2</button>
            <button>3</button>
            <button>4</button>
            <button>5</button>
            <button>6</button>
            <button>7</button>
            <button>8</button>
            <button>9</button>
            <button>0</button>
            <button>-</button>
            <button>=</button>
            <button>⬅️ Backspace</button>
          </div>
          {/* Rząd 2 - 14 Przycisków*/}
          <div className='row'>
            <button>TAB</button>
            <button>Q</button>
            <button>W</button>
            <button>E</button>
            <button>R</button>
            <button>T</button>
            <button>Y</button>
            <button>U</button>
            <button>I</button>
            <button>O</button>
            <button>P</button>
            <button>[</button>
            <button>]</button>
            <button>\</button>
        </div>
        {/* Rząd 3 - 13 Przycisków*/}
        <div className='row'>
          <button>CAPS</button>
          <button>A</button>
          <button>S</button>
          <button>D</button>
          <button>F</button>
          <button>G</button>
          <button>H</button>
          <button>J</button>
          <button>K</button>
          <button>L</button>
          <button>;</button>
          <button>'</button>
          <button>ENTER</button>
          </div>
        {/* Rząd 4 - 12 Przycisków*/}
        <div className='row'>
          <button>SHIFT</button>
          <button>Z</button>
          <button>X</button>
          <button>C</button>
          <button>V</button>
          <button>B</button>
          <button>N</button> {/* 7 przycisk w 4 rzędzie na klawiaturze  */}
          <button>M</button>
          <button>,</button>
          <button>.</button>
          <button>/</button>
          <button>SHIFT</button>
          </div>
        {/* Rząd 5 - 5 Przycisków*/}
          <div className='row'>
            <button>CTRL</button>
            <button>ALT</button>
            <button>_________________</button>
            <button>ALT</button>
            <button>CTRL</button>
          </div>
        </div>
      </div>
    </>
  )
}

  