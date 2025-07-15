import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PharmacyFinder from './components/PharmacyFinder';
import AdherenceTracker from './components/AdherenceTracker';
import drugDatabase from '../data/drugs.json';

function App() {
  const [search, setSearch] = useState('');
  const [reminders, setReminders] = useState([]);
  const [medName, setMedName] = useState('');
  const [medTime, setMedTime] = useState('');
  const [points, setPoints] = useState(0);

  // Mock pharmacy data
  const pharmacies = [
    { id: 1, name: "Jan Aushadhi Kendra - Delhi", location: "New Delhi", meds: ["Metformin 500mg - ₹10"] },
    { id: 2, name: "Jan Aushadhi Kendra - Mumbai", location: "Mumbai", meds: ["Amlodipine 5mg - ₹8"] }
  ];

  // Text-to-speech
  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  // Add reminder
  const addReminder = () => {
    if (medName && medTime) {
      const newReminder = { id: Date.now(), name: medName, time: medTime, taken: false };
      setReminders([...reminders, newReminder]);
      setPoints(points + 10);
      setMedName('');
      setMedTime('');
    }
  };

  // Mark reminder as taken
  const markTaken = (id) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, taken: true } : r));
    setPoints(points + 20);
  };

  // Test JSON integration
  useEffect(() => {
    console.log('Drug Database Loaded:', drugDatabase);
  }, []);

  return (
    <motion.div
      className="p-6 min-h-screen high-contrast"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.h1
        className="text-4xl font-extrabold text-center mb-6 text-neon-blue"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        MediMesh India
      </motion.h1>
      <motion.p
        className="text-center mb-8 text-2xl text-neon-green"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Points: {points}
      </motion.p>
      <PharmacyFinder search={search} setSearch={setSearch} pharmacies={pharmacies} speak={speak} />
      <AdherenceTracker
        medName={medName}
        setMedName={setMedName}
        medTime={medTime}
        setMedTime={setMedTime}
        reminders={reminders}
        addReminder={addReminder}
        markTaken={markTaken}
        speak={speak}
      />
    </motion.div>
  );
}

export default App;