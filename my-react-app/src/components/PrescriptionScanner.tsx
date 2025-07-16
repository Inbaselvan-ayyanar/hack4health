import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Camera, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Pill,
  Volume2,
  BookOpen,
  Upload,
  Image as ImageIcon,
  Loader2,
  X
} from 'lucide-react';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

interface DetectedMedication {
  name: string;
  dosage: string;
  method: string;
  isNew: boolean;
}

interface PrescriptionScannerProps {
  onTutorialRequest: (medication: DetectedMedication) => void;
}

export const PrescriptionScanner = ({ onTutorialRequest }: PrescriptionScannerProps) => {
  const [prescriptionText, setPrescriptionText] = useState('');
  const [detectedMedications, setDetectedMedications] = useState<DetectedMedication[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // OCR pipeline
  const [ocrPipeline, setOcrPipeline] = useState<any>(null);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Simulated medication database for detecting new medicines
  const knownMedications = JSON.parse(localStorage.getItem('knownMedications') || '[]');

  // Initialize OCR pipeline
  const initializeOCR = async () => {
    try {
      if (!ocrPipeline) {
        speak('Loading AI model for text extraction');
        const pipeline_instance = await pipeline('image-to-text', 'Xenova/trocr-base-printed', {
          device: 'webgpu'
        });
        setOcrPipeline(pipeline_instance);
      }
    } catch (error) {
      console.error('Error initializing OCR:', error);
      speak('Error loading AI model. Please try manual text entry.');
    }
  };

  // Handle image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      speak('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      setUploadedImage(imageUrl);
      await processImageWithOCR(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  // Process image with OCR
  const processImageWithOCR = async (imageUrl: string) => {
    setIsProcessingImage(true);
    speak('Processing prescription image');

    try {
      await initializeOCR();
      
      if (ocrPipeline) {
        const result = await ocrPipeline(imageUrl);
        const extractedText = result[0]?.generated_text || '';
        
        if (extractedText.trim()) {
          setPrescriptionText(extractedText);
          speak('Text extracted successfully. You can review and edit if needed.');
          setActiveTab('text');
        } else {
          speak('No text found in image. Please try a clearer image or enter text manually.');
        }
      } else {
        // Fallback simulation for demo
        setTimeout(() => {
          const demoText = "Metformin 500mg - take one tablet twice daily with meals\nInsulin 10 units - inject subcutaneously before meals";
          setPrescriptionText(demoText);
          speak('Demo text extracted. You can review and edit if needed.');
          setActiveTab('text');
        }, 2000);
      }
    } catch (error) {
      console.error('OCR Error:', error);
      speak('Error processing image. Please try manual text entry.');
      setActiveTab('text');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const analyzePrescription = () => {
    if (!prescriptionText.trim()) {
      speak('Please enter prescription text or upload an image');
      return;
    }

    setIsAnalyzing(true);
    speak('Analyzing prescription');

    // Simulate analysis delay
    setTimeout(() => {
      const medications = parsePrescription(prescriptionText);
      setDetectedMedications(medications);
      setIsAnalyzing(false);
      
      const newMeds = medications.filter(med => med.isNew);
      if (newMeds.length > 0) {
        speak(`Found ${newMeds.length} new medication${newMeds.length > 1 ? 's' : ''}. Would you like tutorials?`);
      } else {
        speak(`Found ${medications.length} medication${medications.length > 1 ? 's' : ''}. All are familiar.`);
      }
    }, 2000);
  };

  const parsePrescription = (text: string): DetectedMedication[] => {
    const medications: DetectedMedication[] = [];
    
    // Enhanced parsing patterns for Indian medical context
    const patterns = [
      // Pattern: Medicine name + dosage + method
      /(?:tab\.?\s+)?(\w+(?:\s+\w+)*)\s*[-:]?\s*(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|units?))\s*[,\.\s]*(?:take\s+)?([^\n,\.]+)/gi,
      // Pattern: Injection patterns
      /(insulin|humulin|novolog)\s*[-:]?\s*(\d+\s*units?)\s*[,\.\s]*(?:via\s+)?(syringe|injection|subcutaneous)/gi,
      // Pattern: Syrup patterns
      /(?:syrup\s+)?(\w+(?:\s+\w+)*)\s*[-:]?\s*(\d+\s*ml)\s*[,\.\s]*(syrup|liquid|oral)/gi,
      // Pattern: Split tablets
      /(metformin|aspirin|atorvastatin)\s*[-:]?\s*(\d+\s*mg)\s*[,\.\s]*(half|split|break)/gi
    ];

    patterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        const [, name, dosage, method] = match;
        if (name && dosage) {
          const normalizedName = name.toLowerCase().trim();
          const isNew = !knownMedications.includes(normalizedName);
          
          medications.push({
            name: name.trim(),
            dosage: dosage.trim(),
            method: method ? method.trim() : 'oral',
            isNew
          });
        }
      });
    });

    // Fallback: Simple word extraction for demo
    if (medications.length === 0) {
      const commonMeds = ['metformin', 'insulin', 'paracetamol', 'aspirin', 'atorvastatin'];
      const words = text.toLowerCase().split(/\s+/);
      
      commonMeds.forEach(med => {
        if (words.some(word => word.includes(med))) {
          const isNew = !knownMedications.includes(med);
          medications.push({
            name: med.charAt(0).toUpperCase() + med.slice(1),
            dosage: '500mg',
            method: med === 'insulin' ? 'syringe' : 'tablet',
            isNew
          });
        }
      });
    }

    return medications;
  };

  const requestTutorial = (medication: DetectedMedication) => {
    // Add to known medications
    const updatedKnown = [...knownMedications, medication.name.toLowerCase()];
    localStorage.setItem('knownMedications', JSON.stringify(updatedKnown));
    
    // Update local state
    setDetectedMedications(prev => 
      prev.map(med => 
        med.name === medication.name ? { ...med, isNew: false } : med
      )
    );
    
    speak(`Starting tutorial for ${medication.name}`);
    onTutorialRequest(medication);
  };

  const samplePrescriptions = [
    "Metformin 500mg - take half tablet twice daily",
    "Insulin 10 units via syringe before meals",
    "Paracetamol syrup 10ml three times daily"
  ];

  return (
    <div className="space-y-6">
      <Card className="shadow-medical">
        <CardHeader className="bg-gradient-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            AI Prescription Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'upload' ? 'default' : 'outline'}
              onClick={() => setActiveTab('upload')}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
            <Button
              variant={activeTab === 'text' ? 'default' : 'outline'}
              onClick={() => setActiveTab('text')}
              className="flex-1"
            >
              <FileText className="h-4 w-4 mr-2" />
              Manual Text
            </Button>
          </div>

          <div className="space-y-4">
            {/* Image Upload Tab */}
            {activeTab === 'upload' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Upload Prescription Image
                  </label>
                  
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {uploadedImage ? (
                      <div className="space-y-4">
                        <div className="relative inline-block">
                          <img 
                            src={uploadedImage} 
                            alt="Uploaded prescription" 
                            className="max-w-full max-h-64 rounded-lg shadow-md"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setUploadedImage(null);
                              setPrescriptionText('');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        {isProcessingImage && (
                          <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Processing image with AI...</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                        <div>
                          <h3 className="text-lg font-medium">Upload Prescription Image</h3>
                          <p className="text-muted-foreground">
                            Click here or drag and drop your prescription image
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Supports JPG, PNG, and other image formats
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speak('Click to upload a prescription image for automatic text extraction')}
                    className="mt-2 text-muted-foreground"
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Read Instructions
                  </Button>
                </div>
              </div>
            )}

            {/* Text Input Tab */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="prescription-text" className="text-sm font-medium text-foreground block mb-2">
                    {uploadedImage ? 'Review and Edit Extracted Text' : 'Enter Prescription Text'}
                  </label>
                  <Textarea
                    ref={textareaRef}
                    id="prescription-text"
                    placeholder="Type your prescription here... e.g., 'Metformin 500mg half tablet twice daily' or 'Insulin 10 units syringe before meals'"
                    value={prescriptionText}
                    onChange={(e) => setPrescriptionText(e.target.value)}
                    className="min-h-[120px] text-base border-2 focus:ring-2 focus:ring-primary/50"
                    aria-describedby="prescription-help"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speak('Enter your prescription text in the text area')}
                    className="mt-2 text-muted-foreground"
                    aria-label="Read instructions"
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    Read Instructions
                  </Button>
                </div>

                <div className="grid gap-2">
                  <p className="text-sm text-muted-foreground">Try these sample prescriptions:</p>
                  {samplePrescriptions.map((sample, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setPrescriptionText(sample)}
                      className="justify-start text-left h-auto p-2 text-xs"
                    >
                      {sample}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={analyzePrescription}
              disabled={isAnalyzing || isProcessingImage || !prescriptionText.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-medical"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Prescription...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Analyze Prescription
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detected Medications */}
      {detectedMedications.length > 0 && (
        <Card className="shadow-medical">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Pill className="h-5 w-5" />
              Detected Medications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {detectedMedications.map((medication, index) => (
                <div key={index} className="border rounded-lg p-4 bg-card">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{medication.name}</h3>
                        {medication.isNew && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            New Medicine
                          </Badge>
                        )}
                        {!medication.isNew && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Known
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Dosage:</strong> {medication.dosage}</p>
                        <p><strong>Method:</strong> {medication.method}</p>
                      </div>
                    </div>
                    
                    {medication.isNew && (
                      <Button
                        onClick={() => requestTutorial(medication)}
                        size="sm"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                      >
                        <BookOpen className="h-4 w-4 mr-1" />
                        Tutorial
                      </Button>
                    )}
                  </div>
                  
                  {medication.isNew && (
                    <Alert className="mt-3 border-accent/50 bg-accent/10">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        This appears to be a new medication. Would you like a step-by-step tutorial 
                        with visual instructions on how to take it properly?
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};