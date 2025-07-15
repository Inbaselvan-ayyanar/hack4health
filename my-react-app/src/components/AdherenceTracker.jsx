import React from 'react';
import { motion } from 'framer-motion';

const AdherenceTracker = ({ medName, setMedName, medTime, setMedTime, reminders, addReminder, markTaken, speak }) => {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-bold mb-4 text-neon-green">Set Medication Reminder</h2>
      <motion.input
        type="text"
        placeholder="Medication Name"
        value={medName}
        onChange={(e) => {
          setMedName(e.target.value);
          speak(`Entering medication name: ${e.target.value || 'none'}`);
        }}
        className="w-full p-3 border-2 border-neon-green rounded-lg mb-4 text-lg bg-transparent text-white focus:ring-2 focus:ring-neon-green"
        aria-label="Enter medication name"
        whileFocus={{ scale: 1.02, borderColor: '#34d399' }}
      />
      <motion.input
        type="time"
        value={medTime}
        onChange={(e) => {
          setMedTime(e.target.value);
          speak(`Setting time to ${e.target.value || 'none'}`);
        }}
        className="w-full p-3 border-2 border-neon-green rounded-lg mb-4 text-lg bg-transparent text-white focus:ring-2 focus:ring-neon-green"
        aria-label="Set reminder time"
        whileFocus={{ scale: 1.02, borderColor: '#34d399' }}
      />
      <motion.button
        onClick={() => {
          addReminder();
          speak('Reminder added');
        }}
        className="bg-neon-green text-black p-3 rounded-lg text-lg glow-button pulse"
        whileHover={{ scale: 1.1, boxShadow: '0 0 25px rgba(52, 211, 153, 0.9)' }}
        whileTap={{ scale: 0.95 }}
        aria-label="Add medication reminder"
      >
        Add Reminder
      </motion.button>
      <motion.ul
        className="mt-4 space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {reminders.map((reminder, index) => (
          <motion.li
            key={reminder.id}
            className="p-4 glass-card text-white rounded-lg flex justify-between items-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <span>
              {reminder.name} at {reminder.time} - {reminder.taken ? (
                <span className="text-neon-green">Taken ✓</span>
              ) : (
                <button
                  onClick={() => {
                    markTaken(reminder.id);
                    speak(`Marked ${reminder.name} as taken`);
                  }}
                  className="text-neon-blue underline"
                  aria-label={`Mark ${reminder.name} as taken`}
                >
                  Mark Taken
                </button>
              )}
            </span>
            <motion.div
              className="h-2 bg-gray-700 rounded"
              initial={{ width: 0 }}
              animate={{ width: reminder.taken ? '100%' : '0%' }}
              transition={{ duration: 0.5 }}
            />
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default AdherenceTracker;