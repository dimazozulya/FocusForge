import { useState } from 'react'
import './App.css'
import FocusForge from './components/FocusForge';

function App() {
return (
    <div className="min-h-screen grid place-items-center bg-black">
      <h1 className="text-6xl text-green-400 font-bold">FocusForge 💚</h1>
      <FocusForge/>
    </div>
  );
}

export default App
