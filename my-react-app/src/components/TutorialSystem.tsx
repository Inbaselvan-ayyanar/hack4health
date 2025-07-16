import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  CheckCircle,
  AlertTriangle,
  Pill
} from 'lucide-react';

// Import generated images
import insulin from '@/assets/insulin-syringe-tutorial.jpg';
import syrup from '@/assets/syrup-measurement-tutorial.jpg';
import tablet from '@/assets/tablet-splitting-tutorial.jpg';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  image: string;
  audioText: string;
  safetyTip?: string;
}

interface Medication {
  name: string;
  dosage: string;
  method: string;
  isNew: boolean;
}

interface TutorialSystemProps {
  medication: Medication;
  onComplete: () => void;
  onClose: () => void;
}

export const TutorialSystem = ({ medication, onComplete, onClose }: TutorialSystemProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Generate tutorial steps based on medication method
  const getTutorialSteps = (med: Medication): TutorialStep[] => {
    const method = med.method.toLowerCase();
    
    if (method.includes('syringe') || method.includes('injection') || med.name.toLowerCase().includes('insulin')) {
      return [
        {
          id: 1,
          title: "Prepare the Syringe",
          description: "Wash your hands thoroughly with soap and water. Remove the syringe cap and check that the syringe is clean and undamaged.",
          image: insulin,
          audioText: "First, wash your hands thoroughly with soap and water. This is very important to prevent infection. Remove the syringe cap and check that the syringe is clean.",
          safetyTip: "Always use a new, sterile syringe for each injection"
        },
        {
          id: 2,
          title: "Draw the Medication",
          description: `Insert the needle into the medication vial. Pull back the plunger to draw ${med.dosage} into the syringe. Check for air bubbles and tap to remove them.`,
          image: insulin,
          audioText: `Insert the needle into the medication vial. Pull back the plunger slowly to draw ${med.dosage} into the syringe. Check for air bubbles and gently tap the syringe to remove them.`,
          safetyTip: "Remove all air bubbles to ensure accurate dosing"
        },
        {
          id: 3,
          title: "Administer the Injection",
          description: "Choose an injection site, clean with alcohol swab, and inject at a 90-degree angle. Press the plunger slowly and steadily.",
          image: insulin,
          audioText: "Choose an injection site on your thigh or abdomen. Clean the area with an alcohol swab. Insert the needle at a 90-degree angle and press the plunger slowly.",
          safetyTip: "Rotate injection sites to prevent tissue damage"
        }
      ];
    } else if (method.includes('syrup') || method.includes('liquid')) {
      return [
        {
          id: 1,
          title: "Prepare the Measuring Spoon",
          description: "Use the measuring spoon or cup that comes with the medicine. Wash it thoroughly before use.",
          image: syrup,
          audioText: "Use the measuring spoon or cup that comes with the medicine. Wash it thoroughly with clean water before use.",
          safetyTip: "Never use kitchen spoons as they are not accurate for medicine"
        },
        {
          id: 2,
          title: "Measure the Dose",
          description: `Pour the syrup slowly until it reaches the ${med.dosage} mark on the measuring spoon. Check at eye level for accuracy.`,
          image: syrup,
          audioText: `Pour the syrup slowly until it reaches the ${med.dosage} mark. Hold the measuring spoon at eye level to check the measurement is accurate.`,
          safetyTip: "Always measure at eye level for accuracy"
        },
        {
          id: 3,
          title: "Take the Medicine",
          description: "Swallow the medicine directly from the spoon. You can drink water afterward if needed.",
          image: syrup,
          audioText: "Swallow the medicine directly from the measuring spoon. You can drink some water afterward if you need to.",
          safetyTip: "Store syrup in a cool, dry place away from children"
        }
      ];
    } else if (method.includes('half') || method.includes('split') || method.includes('break')) {
      return [
        {
          id: 1,
          title: "Prepare the Tablet",
          description: "Wash your hands and place the tablet on a clean, flat surface. Look for the score line in the middle.",
          image: tablet,
          audioText: "Wash your hands thoroughly. Place the tablet on a clean, flat surface. Look for the score line that runs down the middle of the tablet.",
          safetyTip: "Only split tablets that have a score line"
        },
        {
          id: 2,
          title: "Split the Tablet",
          description: "Use a pill cutter or carefully break along the score line with your fingers. Apply gentle, even pressure.",
          image: tablet,
          audioText: "Use a pill cutter for best results, or carefully break the tablet along the score line with your fingers. Apply gentle, even pressure.",
          safetyTip: "Split tablets just before taking them to maintain effectiveness"
        },
        {
          id: 3,
          title: "Take the Correct Portion",
          description: `Take one half of the split tablet (${med.dosage}). Store the other half in a clean container for the next dose.`,
          image: tablet,
          audioText: `Take one half of the split tablet as prescribed. Store the other half in a clean, dry container for your next dose.`,
          safetyTip: "Label split tablets with the date and time"
        }
      ];
    } else {
      // Default tablet tutorial
      return [
        {
          id: 1,
          title: "Prepare to Take Medicine",
          description: "Wash your hands and have a glass of water ready.",
          image: tablet,
          audioText: "Wash your hands thoroughly and have a full glass of water ready.",
          safetyTip: "Always take tablets with plenty of water"
        },
        {
          id: 2,
          title: "Take the Tablet",
          description: `Place the ${med.name} tablet on your tongue and swallow with water.`,
          image: tablet,
          audioText: `Place the ${med.name} tablet on your tongue and swallow it with a full glass of water.`,
          safetyTip: "Don't crush tablets unless instructed by your doctor"
        }
      ];
    }
  };

  const tutorialSteps = getTutorialSteps(medication);

  const speak = (text: string) => {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.7; // Slower for medical instructions
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const toggleAudio = () => {
    if (isPlaying) {
      stopSpeaking();
    }
    setAudioEnabled(!audioEnabled);
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      if (audioEnabled) {
        setTimeout(() => speak(tutorialSteps[newStep].audioText), 500);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      if (audioEnabled) {
        setTimeout(() => speak(tutorialSteps[newStep].audioText), 500);
      }
    }
  };

  const markStepComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep === tutorialSteps.length - 1) {
      // Tutorial completed
      speak("Tutorial completed! You now know how to take this medication safely.");
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      nextStep();
    }
  };

  useEffect(() => {
    // Start first step audio
    if (audioEnabled) {
      setTimeout(() => speak(`Starting tutorial for ${medication.name}. ${tutorialSteps[0].audioText}`), 1000);
    }
  }, []);

  const currentStepData = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="w-full max-w-2xl shadow-medical">
          <CardHeader className="bg-gradient-healing text-secondary-foreground">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                {medication.name} Tutorial
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-secondary-foreground hover:bg-secondary-foreground/20"
              >
                ×
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-secondary-foreground/20 text-secondary-foreground">
                  {medication.dosage}
                </Badge>
                <Badge variant="secondary" className="bg-secondary-foreground/20 text-secondary-foreground">
                  {medication.method}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Step {currentStep + 1} of {tutorialSteps.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Step Content */}
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold text-foreground">
                  {currentStepData.title}
                </h2>
                
                {/* AI-Generated Illustration */}
                <div className="relative mx-auto max-w-md">
                  <img
                    src={currentStepData.image}
                    alt={`Visual guide for ${currentStepData.title}`}
                    className="w-full h-64 object-cover rounded-lg shadow-care border-2 border-border"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary text-primary-foreground">
                      AI Generated
                    </Badge>
                  </div>
                </div>
                
                <p className="text-base text-foreground leading-relaxed">
                  {currentStepData.description}
                </p>
                
                {currentStepData.safetyTip && (
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-accent">Safety Tip</p>
                        <p className="text-sm text-foreground mt-1">
                          {currentStepData.safetyTip}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Audio Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => audioEnabled ? (isPlaying ? stopSpeaking() : speak(currentStepData.audioText)) : speak(currentStepData.audioText)}
                  className="flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Stop Audio' : 'Play Audio'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleAudio}
                  className="flex items-center gap-2"
                >
                  {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  {audioEnabled ? 'Audio On' : 'Audio Off'}
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <Button
                  onClick={markStepComplete}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground flex items-center gap-2"
                >
                  {currentStep === tutorialSteps.length - 1 ? (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Complete Tutorial
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4" />
                      Next Step
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={nextStep}
                  disabled={currentStep === tutorialSteps.length - 1}
                  className="flex items-center gap-2"
                >
                  Skip
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};