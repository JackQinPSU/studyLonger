import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>StudyLonger</h1>
        <p>React IS FUNNING </p>
        <button onClick= {() => setCount(count + 1)}>{count}</button>
      </div>
    </>
  )
}

export default App
