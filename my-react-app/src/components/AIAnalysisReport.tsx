import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Brain,
  Volume2,
  Calendar,
  Pill,
  Target
} from 'lucide-react';

interface AdherenceInsight {
  type: 'positive' | 'warning' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
}

interface AdherenceMetrics {
  currentRate: number;
  weeklyAverage: number;
  trend: 'improving' | 'declining' | 'stable';
  missedDoses: number;
  consistencyScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

export const AIAnalysisReport = () => {
  const [metrics, setMetrics] = useState<AdherenceMetrics | null>(null);
  const [insights, setInsights] = useState<AdherenceInsight[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    generateAIAnalysis();
  }, []);

  const generateAIAnalysis = () => {
    setIsGenerating(true);
    
    // Simulate AI analysis delay
    setTimeout(() => {
      const analysisResults = analyzeAdherenceData();
      setMetrics(analysisResults.metrics);
      setInsights(analysisResults.insights);
      setIsGenerating(false);
      speak('AI analysis complete. Your adherence report is ready.');
    }, 2000);
  };

  const analyzeAdherenceData = () => {
    // Get adherence data from localStorage
    const weeklyAdherence = JSON.parse(localStorage.getItem('weeklyAdherence') || '[]');
    const currentRate = parseInt(localStorage.getItem('adherenceRate') || '85');
    
    // Calculate metrics
    const weeklyRates = weeklyAdherence.map((record: any) => record.adherenceRate);
    const weeklyAverage = weeklyRates.length > 0 
      ? weeklyRates.reduce((sum: number, rate: number) => sum + rate, 0) / weeklyRates.length
      : currentRate;

    // Calculate trend
    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (weeklyRates.length >= 2) {
      const recentAvg = weeklyRates.slice(0, 3).reduce((sum: number, rate: number) => sum + rate, 0) / Math.min(3, weeklyRates.length);
      const olderAvg = weeklyRates.slice(3).reduce((sum: number, rate: number) => sum + rate, 0) / Math.max(1, weeklyRates.length - 3);
      
      if (recentAvg > olderAvg + 5) trend = 'improving';
      else if (recentAvg < olderAvg - 5) trend = 'declining';
    }

    // Calculate missed doses
    const missedDoses = weeklyAdherence.reduce((total: number, record: any) => {
      const dailyMissed = record.medications.filter((med: any) => !med.taken).length;
      return total + dailyMissed;
    }, 0);

    // Calculate consistency score (how regular the timing is)
    const consistencyScore = Math.max(0, 100 - (missedDoses * 5));

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (currentRate < 70) riskLevel = 'high';
    else if (currentRate < 85) riskLevel = 'medium';

    const metrics: AdherenceMetrics = {
      currentRate,
      weeklyAverage,
      trend,
      missedDoses,
      consistencyScore,
      riskLevel
    };

    // Generate AI insights
    const insights: AdherenceInsight[] = [];

    // Risk-based insights
    if (riskLevel === 'high') {
      insights.push({
        type: 'critical',
        title: 'Critical Adherence Risk',
        description: `Your adherence rate of ${currentRate}% is below the recommended 80% threshold.`,
        recommendation: 'Consider setting more frequent reminders, using a pill organizer, or consulting your healthcare provider.',
        impact: 'high'
      });
    } else if (riskLevel === 'medium') {
      insights.push({
        type: 'warning',
        title: 'Moderate Adherence Risk',
        description: `Your adherence rate of ${currentRate}% could be improved for better health outcomes.`,
        recommendation: 'Try linking medication times to daily routines like meals or bedtime.',
        impact: 'medium'
      });
    } else {
      insights.push({
        type: 'positive',
        title: 'Excellent Adherence',
        description: `Your adherence rate of ${currentRate}% is above the recommended threshold. Great job!`,
        recommendation: 'Continue your current routine and consider sharing your success with your adherence circle.',
        impact: 'low'
      });
    }

    // Trend-based insights
    if (trend === 'declining') {
      insights.push({
        type: 'warning',
        title: 'Declining Adherence Trend',
        description: 'Your adherence has been decreasing over the past week.',
        recommendation: 'Review what might be causing missed doses. Consider adjusting reminder times or seeking support.',
        impact: 'high'
      });
    } else if (trend === 'improving') {
      insights.push({
        type: 'positive',
        title: 'Improving Adherence Trend',
        description: 'Your adherence has been getting better over time.',
        recommendation: 'Keep up the good work! Your current strategy is working well.',
        impact: 'medium'
      });
    }

    // Missed doses insights
    if (missedDoses > 5) {
      insights.push({
        type: 'warning',
        title: 'Frequent Missed Doses',
        description: `You've missed ${missedDoses} doses in the past week.`,
        recommendation: 'Consider using a smart pill dispenser or asking family members to help remind you.',
        impact: 'high'
      });
    }

    // Consistency insights
    if (consistencyScore < 70) {
      insights.push({
        type: 'warning',
        title: 'Inconsistent Timing',
        description: 'Your medication timing varies significantly from day to day.',
        recommendation: 'Try to take medications at the same times daily for better effectiveness.',
        impact: 'medium'
      });
    }

    // Personalized recommendations based on patterns
    const currentHour = new Date().getHours();
    if (currentHour < 12 && missedDoses > 2) {
      insights.push({
        type: 'warning',
        title: 'Morning Medication Pattern',
        description: 'You tend to miss morning medications more often.',
        recommendation: 'Set your alarm 15 minutes earlier and prepare medications the night before.',
        impact: 'medium'
      });
    }

    return { metrics, insights };
  };

  const speakReport = () => {
    if (!metrics) return;
    
    const reportText = `
      Your AI adherence analysis: 
      Current adherence rate is ${metrics.currentRate} percent.
      Weekly average is ${Math.round(metrics.weeklyAverage)} percent.
      Your trend is ${metrics.trend}.
      Risk level is ${metrics.riskLevel}.
      You have ${metrics.missedDoses} missed doses this week.
      Your consistency score is ${metrics.consistencyScore} percent.
    `;
    
    speak(reportText);
  };

  if (isGenerating || !metrics) {
    return (
      <div className="space-y-6">
        <Card className="shadow-medical">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <h2 className="text-lg font-semibold text-foreground">Generating AI Analysis...</h2>
              <p className="text-muted-foreground">
                Analyzing your adherence patterns and generating personalized insights
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-medical">
        <CardHeader className="bg-gradient-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Adherence Analysis Report
          </CardTitle>
          <div className="flex items-center justify-between">
            <p className="text-primary-foreground/90">
              Personalized insights based on your medication patterns
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={speakReport}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <Card className="shadow-medical">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Key Metrics
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{metrics.currentRate}%</div>
                <div className="text-sm text-muted-foreground">Current Rate</div>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-secondary">{Math.round(metrics.weeklyAverage)}%</div>
                <div className="text-sm text-muted-foreground">Weekly Average</div>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-accent">{metrics.missedDoses}</div>
                <div className="text-sm text-muted-foreground">Missed Doses</div>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-foreground">{metrics.consistencyScore}%</div>
                <div className="text-sm text-muted-foreground">Consistency</div>
              </div>
            </div>

            {/* Trend Indicator */}
            <div className="flex items-center justify-center gap-2 p-3 bg-muted/30 rounded-lg">
              {metrics.trend === 'improving' && (
                <>
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  <span className="text-secondary font-medium">Improving Trend</span>
                </>
              )}
              {metrics.trend === 'declining' && (
                <>
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  <span className="text-destructive font-medium">Declining Trend</span>
                </>
              )}
              {metrics.trend === 'stable' && (
                <>
                  <Target className="h-5 w-5 text-primary" />
                  <span className="text-primary font-medium">Stable Trend</span>
                </>
              )}
            </div>

            {/* Risk Level */}
            <div className="text-center">
              <Badge 
                variant={metrics.riskLevel === 'high' ? 'destructive' : metrics.riskLevel === 'medium' ? 'secondary' : 'default'}
                className="text-sm px-3 py-1"
              >
                {metrics.riskLevel.toUpperCase()} RISK LEVEL
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="shadow-medical">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Brain className="h-5 w-5 text-accent" />
              AI-Generated Insights
            </h2>

            <div className="space-y-4">
              {insights.map((insight, index) => (
                <Alert 
                  key={index}
                  className={`border-2 ${
                    insight.type === 'critical' ? 'border-destructive/50 bg-destructive/10' :
                    insight.type === 'warning' ? 'border-accent/50 bg-accent/10' :
                    'border-secondary/50 bg-secondary/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {insight.type === 'critical' && <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />}
                    {insight.type === 'warning' && <AlertTriangle className="h-5 w-5 text-accent mt-0.5" />}
                    {insight.type === 'positive' && <CheckCircle className="h-5 w-5 text-secondary mt-0.5" />}
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground">{insight.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {insight.impact.toUpperCase()} IMPACT
                        </Badge>
                      </div>
                      
                      <AlertDescription className="text-foreground">
                        {insight.description}
                      </AlertDescription>
                      
                      <div className="bg-background/50 rounded-lg p-3 mt-2">
                        <p className="text-sm font-medium text-foreground">💡 Recommendation:</p>
                        <p className="text-sm text-muted-foreground mt-1">{insight.recommendation}</p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speak(`${insight.title}. ${insight.description}. Recommendation: ${insight.recommendation}`)}
                        className="text-xs opacity-70 hover:opacity-100"
                      >
                        <Volume2 className="h-3 w-3 mr-1" />
                        Read Aloud
                      </Button>
                    </div>
                  </div>
                </Alert>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card className="shadow-medical">
        <CardContent className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-secondary" />
              Recommended Actions
            </h2>

            <div className="space-y-3">
              {metrics.riskLevel !== 'low' && (
                <div className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-sm font-bold">1</div>
                  <span className="text-foreground">Set up additional medication reminders</span>
                </div>
              )}
              
              {metrics.consistencyScore < 80 && (
                <div className="flex items-center gap-3 p-3 bg-secondary/10 rounded-lg">
                  <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-sm font-bold">2</div>
                  <span className="text-foreground">Create a daily medication routine</span>
                </div>
              )}
              
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">3</div>
                <span className="text-foreground">Share progress with your adherence circle</span>
              </div>
            </div>

            <Button 
              onClick={generateAIAnalysis}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Brain className="h-4 w-4 mr-2" />
              Regenerate Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};