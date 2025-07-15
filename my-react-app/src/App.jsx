// src/App.jsx
import React, { useState, useEffect } from 'react';
import drugDatabase from '../data/drugs.json';

function App() {
  const [voiceCommand, setVoiceCommand] = useState('');
  const [points, setPoints] = useState(0);

  // Test JSON integration
  useEffect(() => {
    console.log('Drug Database Loaded:', drugDatabase);
  }, []);

  return (
    <div className="p-4 bg-black text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-4">MediMesh India</h1>
      <p className="text-center mb-4">Points: {points}</p>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">Voice Navigation</h2>
        <input
          type="text"
          placeholder="Say 'Find pharmacy', 'Set reminder', 'Tutorial', or 'Report'"
          value={voiceCommand}
          onChange={(e) => setVoiceCommand(e.target.value)}
          className="w-full p-2 border rounded mb-2 text-lg bg-white text-black"
        />
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 text-lg">
          Process Voice Command
        </button>
      </div>
    </div>
  );
}

export default App;