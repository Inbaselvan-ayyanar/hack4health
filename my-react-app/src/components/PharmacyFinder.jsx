import React from 'react';
import { motion } from 'framer-motion';

const PharmacyFinder = ({ search, setSearch, pharmacies, speak }) => {
  const filteredPharmacies = pharmacies.filter(p =>
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-3xl font-bold mb-4 text-neon-blue">Find Affordable Pharmacies</h2>
      <motion.input
        type="text"
        placeholder="Search by location (e.g., Delhi)"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          speak(`Searching for pharmacies in ${e.target.value || 'any location'}`);
        }}
        className="w-full p-3 border-2 border-neon-blue rounded-lg mb-4 text-lg bg-transparent text-white focus:ring-2 focus:ring-neon-blue"
        aria-label="Search pharmacies by location"
        whileFocus={{ scale: 1.02, borderColor: '#60a5fa' }}
      />
      <motion.ul
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {filteredPharmacies.map((pharmacy, index) => (
          <motion.li
            key={pharmacy.id}
            className="p-4 glass-card text-white rounded-lg"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ scale: 1.03 }}
          >
            <strong>{pharmacy.name}</strong> - {pharmacy.location}<br />
            <span className="text-sm">Meds: {pharmacy.meds.join(", ")}</span>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
};

export default PharmacyFinder;