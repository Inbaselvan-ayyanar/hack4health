import { useState } from 'react';
import { MediLayout } from '@/components/MediLayout';
import { HomePage } from '@/components/HomePage';
import { PrescriptionScanner } from '@/components/PrescriptionScanner';
import { TutorialSystem } from '@/components/TutorialSystem';
import { AdherenceTracker } from '@/components/AdherenceTracker';
import { AIAnalysisReport } from '@/components/AIAnalysisReport';
import { AdherenceCircles } from '@/components/AdherenceCircles';
import { PharmacyFinder } from '@/components/PharmacyFinder';

interface DetectedMedication {
  name: string;
  dosage: string;
  method: string;
  isNew: boolean;
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<DetectedMedication | null>(null);

  const handleTutorialRequest = (medication: DetectedMedication) => {
    setSelectedMedication(medication);
    setShowTutorial(true);
  };

  const handleTutorialComplete = () => {
    setShowTutorial(false);
    setSelectedMedication(null);
    // Add completion tracking
    const completedTutorials = JSON.parse(localStorage.getItem('completedTutorials') || '[]');
    if (selectedMedication) {
      completedTutorials.push({
        medicationName: selectedMedication.name,
        completedAt: new Date().toISOString(),
        method: selectedMedication.method
      });
      localStorage.setItem('completedTutorials', JSON.stringify(completedTutorials));
    }
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
    setSelectedMedication(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'prescription':
        return <PrescriptionScanner onTutorialRequest={handleTutorialRequest} />;
      case 'adherence':
        return <AdherenceTracker />;
      case 'reports':
        return <AIAnalysisReport />;
      case 'circles':
        return <AdherenceCircles />;
      case 'pharmacy':
        return <PharmacyFinder />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <>
      <MediLayout currentPage={currentPage} onPageChange={setCurrentPage}>
        {renderPage()}
      </MediLayout>

      {/* Tutorial Modal */}
      {showTutorial && selectedMedication && (
        <TutorialSystem
          medication={selectedMedication}
          onComplete={handleTutorialComplete}
          onClose={handleTutorialClose}
        />
      )}
    </>
  );
};

export default Index;
