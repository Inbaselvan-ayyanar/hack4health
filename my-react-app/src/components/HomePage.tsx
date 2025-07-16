import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Users,
  MapPin,
  Bell,
  Heart,
  Shield,
  Volume2,
  PillIcon
} from 'lucide-react';
import AdherenceHero from '@/assets/adherence-hero.jpg';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage = ({ onNavigate }: HomePageProps) => {
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Get user stats from localStorage (simulated)
  const userName = localStorage.getItem('userName') || 'User';
  const todaysMeds = JSON.parse(localStorage.getItem('todaysMedications') || '[]');
  const adherenceRate = localStorage.getItem('adherenceRate') || '85';
  const activeCircles = JSON.parse(localStorage.getItem('adherenceCircles') || '["Family", "Diabetes Support"]');

  const quickActions = [
    {
      title: "Scan Prescription",
      description: "Add new medications with AI tutorials",
      icon: PillIcon,
      action: () => onNavigate('prescription'),
      color: "bg-primary",
      speak: "Scan new prescription and get AI-powered tutorials"
    },
    {
      title: "Track Adherence",
      description: "Log today's medications",
      icon: Calendar,
      action: () => onNavigate('adherence'),
      color: "bg-secondary",
      speak: "Track your medication adherence"
    },
    {
      title: "Find Pharmacy",
      description: "Locate PMBJP pharmacies nearby",
      icon: MapPin,
      action: () => onNavigate('pharmacy'),
      color: "bg-accent",
      speak: "Find nearby pharmacies with PMBJP support"
    },
    {
      title: "Adherence Circles",
      description: "Connect with your support network",
      icon: Users,
      action: () => onNavigate('circles'),
      color: "bg-secondary",
      speak: "Connect with your adherence support circles"
    }
  ];

  const todaysReminders = [
    { name: "Metformin", time: "8:00 AM", taken: true },
    { name: "Insulin", time: "12:00 PM", taken: false },
    { name: "Metformin", time: "8:00 PM", taken: false }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="overflow-hidden shadow-medical">
        <CardContent className="p-0">
          <div className="relative bg-gradient-primary text-primary-foreground">
            <div className="absolute inset-0 opacity-20">
              <img
                src={AdherenceHero}
                alt="Medical adherence illustration"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Welcome back, {userName}!</h1>
                  <p className="text-primary-foreground/90">
                    Stay healthy with AI-powered medication management
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => speak(`Welcome back ${userName}. Your adherence rate is ${adherenceRate} percent. You have ${todaysReminders.filter(r => !r.taken).length} medications pending today.`)}
                  className="text-primary-foreground hover:bg-primary-foreground/20"
                  aria-label="Read welcome message"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{adherenceRate}%</div>
                  <div className="text-sm text-primary-foreground/80">Adherence Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{todaysReminders.filter(r => r.taken).length}</div>
                  <div className="text-sm text-primary-foreground/80">Taken Today</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{activeCircles.length}</div>
                  <div className="text-sm text-primary-foreground/80">Support Circles</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Heart className="h-5 w-5 text-accent" />
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-care transition-shadow shadow-medical"
                onClick={action.action}
              >
                <CardContent className="p-4 text-center space-y-3">
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{action.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      speak(action.speak);
                    }}
                    className="opacity-60 hover:opacity-100"
                    aria-label={`Read about ${action.title}`}
                  >
                    <Volume2 className="h-3 w-3" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Today's Reminders */}
      <Card className="shadow-medical">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Bell className="h-5 w-5 text-accent" />
                Today's Medications
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speak(`You have ${todaysReminders.length} medications scheduled today. ${todaysReminders.filter(r => !r.taken).length} are still pending.`)}
                aria-label="Read today's medications"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              {todaysReminders.map((reminder, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${reminder.taken ? 'bg-secondary' : 'bg-accent'}`} />
                    <div>
                      <p className="font-medium text-foreground">{reminder.name}</p>
                      <p className="text-sm text-muted-foreground">{reminder.time}</p>
                    </div>
                  </div>
                  <Badge variant={reminder.taken ? "secondary" : "destructive"}>
                    {reminder.taken ? "Taken" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
            
            <Button 
              onClick={() => onNavigate('adherence')}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Update Adherence
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Health Tips */}
      <Card className="shadow-medical">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5 text-secondary" />
              Health Tip of the Day
            </h2>
            
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
              <p className="text-foreground">
                <strong>Consistency is Key:</strong> Taking medications at the same time each day 
                helps maintain steady levels in your body and improves effectiveness.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => speak("Consistency is key. Taking medications at the same time each day helps maintain steady levels in your body and improves effectiveness.")}
                className="mt-2 text-secondary"
                aria-label="Read health tip"
              >
                <Volume2 className="h-4 w-4 mr-1" />
                Read Aloud
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Notice */}
      <Card className="shadow-medical border-accent/50">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Accessibility Features:</strong> Voice assistance available throughout the app
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span>• High Contrast Mode</span>
              <span>• Voice Navigation</span>
              <span>• Audio Instructions</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};