export default App
import './App.css'

function App() {

  return (
    <>
      <div>
        <h1>Klawiatura interaktywna</h1>
        <div className='container-grid'>
          {/* Rząd 1 - 14 Przycisków*/}
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
          {/* Rząd 2 - 14 Przycisków*/}
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
        {/* Rząd 3 - 13 Przycisków*/}
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
        {/* Rząd 4 - 12 Przycisków*/}
          <button className='grid-column-1'>SHIFT</button>
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
        {/* Rząd 5 - 5 Przycisków*/}
          <button>CTRL</button>
          <button>ALT</button>
          <button>_________________</button>
          <button>ALT</button>
          <button>CTRL</button>
        </div>
      </div>
    </>
  )
}

  