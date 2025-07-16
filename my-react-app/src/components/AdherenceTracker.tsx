import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calendar,
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Volume2,
  Plus,
  Pill,
  AlertTriangle
} from 'lucide-react';

interface MedicationSchedule {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  takenAt?: string;
}

interface AdherenceRecord {
  date: string;
  medications: MedicationSchedule[];
  adherenceRate: number;
}

export const AdherenceTracker = () => {
  const [todaysMedications, setTodaysMedications] = useState<MedicationSchedule[]>([]);
  const [weeklyAdherence, setWeeklyAdherence] = useState<AdherenceRecord[]>([]);
  const [currentDate] = useState(new Date().toISOString().split('T')[0]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    loadTodaysMedications();
    loadWeeklyAdherence();
  }, []);

  const loadTodaysMedications = () => {
    const saved = localStorage.getItem(`medications_${currentDate}`);
    if (saved) {
      setTodaysMedications(JSON.parse(saved));
    } else {
      // Default medications for demo
      const defaultMeds: MedicationSchedule[] = [
        {
          id: '1',
          name: 'Metformin',
          dosage: '500mg',
          time: '08:00',
          taken: false
        },
        {
          id: '2',
          name: 'Insulin',
          dosage: '10 units',
          time: '12:00',
          taken: false
        },
        {
          id: '3',
          name: 'Metformin',
          dosage: '500mg',
          time: '20:00',
          taken: false
        }
      ];
      setTodaysMedications(defaultMeds);
      localStorage.setItem(`medications_${currentDate}`, JSON.stringify(defaultMeds));
    }
  };

  const loadWeeklyAdherence = () => {
    const weekly = localStorage.getItem('weeklyAdherence');
    if (weekly) {
      setWeeklyAdherence(JSON.parse(weekly));
    }
  };

  const markMedicationTaken = (medicationId: string, taken: boolean) => {
    const updatedMeds = todaysMedications.map(med => {
      if (med.id === medicationId) {
        return {
          ...med,
          taken,
          takenAt: taken ? new Date().toLocaleTimeString() : undefined
        };
      }
      return med;
    });

    setTodaysMedications(updatedMeds);
    localStorage.setItem(`medications_${currentDate}`, JSON.stringify(updatedMeds));

    // Update adherence tracking
    updateAdherenceRecord(updatedMeds);

    const medication = updatedMeds.find(med => med.id === medicationId);
    if (medication) {
      speak(taken 
        ? `${medication.name} marked as taken at ${medication.takenAt}`
        : `${medication.name} marked as not taken`
      );
    }
  };

  const updateAdherenceRecord = (medications: MedicationSchedule[]) => {
    const takenCount = medications.filter(med => med.taken).length;
    const adherenceRate = medications.length > 0 ? (takenCount / medications.length) * 100 : 0;

    const todayRecord: AdherenceRecord = {
      date: currentDate,
      medications,
      adherenceRate
    };

    const existingWeekly = [...weeklyAdherence];
    const existingIndex = existingWeekly.findIndex(record => record.date === currentDate);
    
    if (existingIndex >= 0) {
      existingWeekly[existingIndex] = todayRecord;
    } else {
      existingWeekly.push(todayRecord);
    }

    // Keep only last 7 days
    const sortedWeekly = existingWeekly
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 7);

    setWeeklyAdherence(sortedWeekly);
    localStorage.setItem('weeklyAdherence', JSON.stringify(sortedWeekly));
    
    // Update global adherence rate
    const avgAdherence = sortedWeekly.reduce((sum, record) => sum + record.adherenceRate, 0) / sortedWeekly.length;
    localStorage.setItem('adherenceRate', Math.round(avgAdherence).toString());
  };

  const addMedication = () => {
    const newMed: MedicationSchedule = {
      id: Date.now().toString(),
      name: 'New Medication',
      dosage: '1 tablet',
      time: '09:00',
      taken: false
    };

    const updatedMeds = [...todaysMedications, newMed];
    setTodaysMedications(updatedMeds);
    localStorage.setItem(`medications_${currentDate}`, JSON.stringify(updatedMeds));
    speak('New medication added to your schedule');
  };

  const takenCount = todaysMedications.filter(med => med.taken).length;
  const totalCount = todaysMedications.length;
  const todayAdherence = totalCount > 0 ? (takenCount / totalCount) * 100 : 0;
  const weeklyAverage = weeklyAdherence.length > 0 
    ? weeklyAdherence.reduce((sum, record) => sum + record.adherenceRate, 0) / weeklyAdherence.length
    : 0;

  const getTimeStatus = (time: string, taken: boolean) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const medicationTime = new Date();
    medicationTime.setHours(hours, minutes, 0, 0);

    if (taken) return 'taken';
    if (now > medicationTime) return 'overdue';
    if (now.getTime() > medicationTime.getTime() - 30 * 60 * 1000) return 'due';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-medical">
        <CardHeader className="bg-gradient-healing text-secondary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Adherence Tracker
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-secondary-foreground/90">
              Track your daily medication adherence
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => speak(`Today's adherence is ${Math.round(todayAdherence)} percent. You have taken ${takenCount} out of ${totalCount} medications.`)}
              className="text-secondary-foreground hover:bg-secondary-foreground/20"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Today's Progress */}
      <Card className="shadow-medical">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Today's Progress</h2>
              <Badge variant={todayAdherence >= 80 ? "secondary" : "destructive"}>
                {Math.round(todayAdherence)}% Complete
              </Badge>
            </div>
            
            <Progress value={todayAdherence} className="h-3" />
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-secondary">{takenCount}</div>
                <div className="text-sm text-muted-foreground">Taken</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{totalCount - takenCount}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{Math.round(weeklyAverage)}%</div>
                <div className="text-sm text-muted-foreground">7-Day Average</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Today's Medications */}
      <Card className="shadow-medical">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Pill className="h-5 w-5 text-accent" />
                Today's Medications
              </h2>
              <Button
                onClick={addMedication}
                size="sm"
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="space-y-3">
              {todaysMedications.map((medication) => {
                const timeStatus = getTimeStatus(medication.time, medication.taken);
                
                return (
                  <div key={medication.id} className="border rounded-lg p-4 bg-card">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-foreground">{medication.name}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {medication.dosage}
                          </Badge>
                          {timeStatus === 'overdue' && !medication.taken && (
                            <Badge variant="destructive" className="text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Overdue
                            </Badge>
                          )}
                          {timeStatus === 'due' && !medication.taken && (
                            <Badge variant="destructive" className="text-xs animate-pulse">
                              <Clock className="h-3 w-3 mr-1" />
                              Due Now
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Scheduled: {medication.time}</span>
                          {medication.takenAt && (
                            <span className="text-secondary">• Taken: {medication.takenAt}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant={medication.taken ? "secondary" : "outline"}
                          size="sm"
                          onClick={() => markMedicationTaken(medication.id, !medication.taken)}
                          className="flex items-center gap-2"
                        >
                          {medication.taken ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Taken
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              Mark Taken
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Trends */}
      <Card className="shadow-medical">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weekly Adherence Trend
            </h2>

            <div className="space-y-3">
              {weeklyAdherence.slice(0, 7).map((record, index) => (
                <div key={record.date} className="flex items-center gap-4">
                  <div className="w-20 text-sm text-muted-foreground">
                    {new Date(record.date).toLocaleDateString('en-IN', { 
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex-1">
                    <Progress value={record.adherenceRate} className="h-2" />
                  </div>
                  <div className="w-12 text-sm font-medium text-foreground">
                    {Math.round(record.adherenceRate)}%
                  </div>
                </div>
              ))}
            </div>

            {weeklyAverage < 80 && (
              <Alert className="border-accent/50 bg-accent/10">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your weekly adherence is below 80%. Consider setting more reminders or 
                  connecting with your adherence circle for support.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
