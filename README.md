# MediMesh India 🚀

![MediMesh Banner](https://via.placeholder.com/1200x400?text=MediMesh+India)

**MediMesh India** is an innovative healthcare platform designed to empower affordable healthcare access in India. Built for the **Hack4Health 2025** hackathon, MediMesh provides tools for finding affordable PMBJP (Pradhan Mantri Bhartiya Janaushadhi Pariyojana) pharmacies and tracking medication adherence with a world-class, accessible, and futuristic UI. 🌍💊

Our mission is to bridge the gap in healthcare accessibility with a seamless, user-friendly experience that prioritizes affordability, adherence, and inclusivity. This project was crafted with ❤️ by our team in just 24 hours!

## ✨ Features

- **Pharmacy Finder**: Search for PMBJP pharmacies by location, displaying affordable medication options in a glassmorphic, neon-accented UI.
- **Adherence Tracker**: Set medication reminders, track progress with animated progress bars, and earn gamified points for adherence.
- **World-Class UI**: Futuristic design with neon blue (#3b82f6) and green (#34d399) accents, glassmorphic cards, dark gradient backgrounds, and smooth Framer Motion animations.
- **Accessibility**: High-contrast (>4.5:1), large text/buttons (1.5rem+, 48x48px+), Text-to-Speech (TTS) via Web Speech API, aria labels, and `prefers-reduced-motion` support for WCAG compliance.
- **Gamification**: Earn points for searching pharmacies (+5) and marking medications as taken (+20), enhancing user engagement.
- **Responsive Design**: Optimized for desktop and mobile devices with Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, glassmorphism, neon accents
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Accessibility**: Web Speech API for TTS, aria labels
- **Data**: JSON-based drug database (`drugs.json`)

## 📸 Demo

🎥 **Screen Recordings**: Ready for Hack4Health submission! Watch our demo videos showcasing the Pharmacy Finder and Adherence Tracker in action. [Link to recordings to be added post-submission]
   **1. ENTER PRESCRIPTION**
   <img width="1696" height="863" alt="Screenshot 2025-07-16 at 8 37 42 AM" src="https://github.com/user-attachments/assets/bcaed529-cd6f-4242-8816-cc1fe3700719" />
   <video src='https://drive.google.com/file/d/1-cITrF-34DqgHMsWivN46PCF6lFx-n3N/view?usp=sharing' width=180/>

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Inbaselvan-ayyanar/hack4health.git


Navigate to the project directory:cd hack4health/my-react-app


Install dependencies:npm install


Run the development server:npm run dev


Open http://localhost:5173 in your browser to explore MediMesh!

Build for Production
npm run build
npm run preview

📂 Project Structure
hack4health/
└── my-react-app/
    ├── src/
    │   ├── assets/
    │   │   └── adherence-hero.jpg
    │   ├── components/
    │   │   ├── HomePage.tsx
    │   │   ├── PharmacyFinder.tsx
    │   │   ├── AdherenceTracker.tsx
    │   │   ├── AdherenceCircles.tsx
    │   │   ├── DrugTutorial.tsx
    │   │   ├── Notification.tsx
    │   │   ├── AdherenceReport.tsx
    │   │   └── ui/
    │   │       └── badge.tsx
    │   ├── pages/
    │   │   └── Index.tsx
    │   └── index.css
    ├── data/
    │   ├── drugs.json
    │   └── demo.json
    ├── public/
    │   └── favicon.ico
    ├── index.html
    ├── vite.config.ts
    ├── package.json
    ├── README.md
    ├── UI_SKETCH.md
    ├── .gitignore

🎨 Design Highlights

Theme: Dark gradient background (linear-gradient(135deg, #1a1a1a, #2a2a2a)) with neon blue (#3b82f6) and green (#34d399) accents.
Glassmorphism: Semi-transparent cards with backdrop-filter: blur(12px) for a modern, sleek look.
Animations: Parallax entries, staggered list reveals, glowing buttons, and progress bar transitions via Framer Motion.
Typography: Inter font (400, 600, 800 weights) for readability and elegance.
Accessibility: High-contrast colors, large interactive elements, TTS feedback, and reduced-motion support.

For more details, see UI_SKETCH.md.
🏆 Hack4Health 2025
Built for the Hack4Health 2025 hackathon (July 15–16, 2025), MediMesh addresses affordable healthcare access in India by integrating PMBJP pharmacy data and medication adherence tracking. With ~3 hours remaining (as of 09:33 AM IST, July 16, 2025), our team has delivered a fully functional prototype with screen recordings ready for submission.
🤝 Contributing
We welcome contributions to enhance MediMesh! To contribute:

Fork the repository.
Create a feature branch (git checkout -b feature/YourFeature).
Commit your changes (git commit -m "Add YourFeature").
Push to the branch (git push origin feature/YourFeature).
Open a Pull Request.

Please follow our Code of Conduct (to be added).
📜 License
This project is licensed under the MIT License. See the LICENSE file for details.
🙌 Team

Inbaselvan 🧑‍💻: Lead Developer, architecture and core functionality
Yuvadarshan 🎨: UI/UX Developer, world-class design and animations
Danvanthram 🛠️: Backend Developer, data integration and logic

Built with passion for the Hack4Health 2025 hackathon. Let's make healthcare accessible for all! 🌟

Crafted with ❤️ by the MediMesh India team, July 16, 2025.```
