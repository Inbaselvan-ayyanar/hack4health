# MediMesh UI Sketch
Designed by Yuvadarshan 🎨 for accessibility, built with React and Tailwind CSS in my-react-app.

## Layout
- **Header**: Centered title ("MediMesh India"), points display ("Points: 50") in white on black background.
- **Sections**: Scrollable, card-based (white cards, rounded, shadowed) for:
  1. **Voice Navigation**: Large text input (simulating STT), blue "Process" button (hover: darker blue).
  2. **Pharmacy Finder**: Search bar, list of PMBJP pharmacies (name, location, meds) in white cards.
  3. **Adherence Tracker**: Inputs for med name/time, blue "Add Reminder" button, reminder list with green "Mark Taken" links.
  4. **Adherence Circles**: White cards with community tips (e.g., "Take meds with water").
  5. **Drug Tutorial System**: Large input for prescription, blue "Submit" button. Tutorial displays usage, side effects, precautions, and 100x100px AI-generated images (e.g., syringe steps) with captions.
  6. **Notification System**: Yellow pop-up with large green "Yes" and red "No" buttons, flashes every 1s for hearing-impaired.
  7. **Adherence Report**: Blue "Generate Report" button, white card with metrics (adherence %, missed doses, suggestions).
- **Footer**: None (maximizes screen space for mobile).

## Accessibility (WCAG-Compliant)
- **High-Contrast**: Black background, white text (contrast ratio >4.5:1).
- **Large Text**: Minimum 1.5rem font size for readability.
- **Buttons**: Large (min 48x48px), tactile, with hover effects for motor-impaired users.
- **Visual Cues**: Flashing yellow notifications for hearing-impaired users.
- **Text-to-Speech**: Web Speech API reads prompts, tutorials, and reports for illiterate/visually impaired users.
- **Alt Text**: Provided for AI-generated images in tutorials.

## Mockup (Text Description)
- **Home Screen**: Black bg, white text, centered title, points below. Scrollable white cards (rounded, shadowed) for sections.
- **Voice Navigation**: Large input (white bg, black text), blue button (hover: darker blue).
- **Tutorial Section**: Large prescription input, blue "Submit" button. Tutorial shows text (usage, side effects, precautions), 100x100px images in a row, captions below.
- **Notification**: Yellow pop-up, large green "Yes"/red "No" buttons, flashes every 1s.
- **Report**: Blue "Generate Report" button, white card with metrics (e.g., "Adherence: 80%, Missed: 2, Try earlier reminders").

## Tech
- React.js (CDN or create-react-app) for components.
- Tailwind CSS (CDN) for high-contrast, responsive styling.
- Web Speech API for TTS, Web Audio API for alerts.
