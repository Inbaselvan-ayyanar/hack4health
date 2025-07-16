import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Home, 
  Pill, 
  Calendar, 
  Users, 
  MapPin, 
  BarChart3,
  Volume2,
  VolumeX,
  Contrast
} from 'lucide-react';

interface MediLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const MediLayout = ({ children, currentPage, onPageChange }: MediLayoutProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.8;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle('high-contrast', !highContrast);
  };

  const navigationItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'prescription', label: 'Prescription', icon: Pill },
    { id: 'adherence', label: 'Adherence', icon: Calendar },
    { id: 'circles', label: 'Circles', icon: Users },
    { id: 'pharmacy', label: 'Pharmacy', icon: MapPin },
    { id: 'reports', label: 'Reports', icon: BarChart3 }
  ];

  return (
    <div className={`min-h-screen bg-background ${highContrast ? 'high-contrast' : ''}`}>
      {/* Header with accessibility controls */}
      <header className="bg-gradient-primary shadow-medical border-b-2 border-primary/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Pill className="h-5 w-5 text-accent-foreground" />
              </div>
              <h1 className="text-xl font-bold text-primary-foreground">MediMesh</h1>
            </div>
            
            {/* Accessibility Controls */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={isSpeaking ? stopSpeaking : () => speak(`Welcome to MediMesh. Current page: ${currentPage}`)}
                className="text-primary-foreground hover:bg-primary-glow/20"
                aria-label={isSpeaking ? "Stop speaking" : "Start voice assistance"}
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleContrast}
                className="text-primary-foreground hover:bg-primary-glow/20"
                aria-label="Toggle high contrast mode"
              >
                <Contrast className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-border shadow-medical">
        <div className="container mx-auto px-2">
          <div className="grid grid-cols-6 gap-1 py-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    onPageChange(item.id);
                    speak(`Navigated to ${item.label}`);
                  }}
                  className={`flex flex-col items-center gap-1 h-auto py-2 px-1 ${
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-focus' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  aria-label={`Navigate to ${item.label}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs font-medium truncate">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};