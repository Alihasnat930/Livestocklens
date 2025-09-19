import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Camera, 
  Upload, 
  Image as ImageIcon, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Zap
} from 'lucide-react';

// TODO: remove mock functionality - replace with real AI detection
const mockDetectionResults = [
  {
    id: 1,
    cattleId: 'C-1247',
    date: '2024-01-18',
    image: '/placeholder-cattle.jpg',
    status: 'completed',
    disease: 'Foot and Mouth Disease',
    confidence: 87,
    severity: 'High',
    recommendations: [
      'Isolate the animal immediately',
      'Contact veterinarian for treatment',
      'Disinfect the area thoroughly',
      'Monitor other animals for symptoms'
    ]
  },
  {
    id: 2,
    cattleId: 'C-1189',
    date: '2024-01-17',
    image: '/placeholder-cattle-2.jpg',
    status: 'completed',
    disease: 'Healthy',
    confidence: 95,
    severity: 'None',
    recommendations: [
      'Continue regular monitoring',
      'Maintain feeding schedule',
      'Next check-up in 2 weeks'
    ]
  }
];

export default function DiseaseDetection() {
  const { t } = useLanguage();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setDetectionResult(null);
        console.log('Image uploaded:', file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = () => {
    if (!uploadedImage) return;
    
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setDetectionResult(null);

    // TODO: remove mock functionality - implement real AI analysis
    console.log('Starting AI disease detection analysis...');
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          // Mock result
          setDetectionResult({
            disease: 'Healthy',
            confidence: 92,
            severity: 'None',
            recommendations: [
              'Animal appears healthy',
              'Continue regular monitoring',
              'Next check-up in 2 weeks'
            ]
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-blue-600';
      default:
        return 'text-green-600';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6" data-testid="page-disease-detection">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Disease Detection</h2>
        <p className="text-muted-foreground">
          Upload cattle images for AI-powered disease detection and analysis
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Image Upload Section */}
        <Card data-testid="card-image-upload">
          <CardHeader>
            <CardTitle>Upload Cattle Image</CardTitle>
            <CardDescription>
              Take or upload a clear photo of the cattle for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {uploadedImage ? (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Uploaded cattle"
                    className="w-full h-64 object-cover rounded-lg border"
                    data-testid="img-uploaded-cattle"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setUploadedImage(null);
                      setDetectionResult(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    data-testid="button-remove-image"
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                  data-testid="dropzone-image-upload"
                >
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG or JPEG (max 10MB)
                  </p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                data-testid="input-file-upload"
              />
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1"
                  data-testid="button-upload-file"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
                <Button
                  variant="outline"
                  onClick={() => console.log('Camera functionality would be implemented')}
                  className="flex-1"
                  data-testid="button-take-photo"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </div>

              {uploadedImage && (
                <Button
                  onClick={handleAnalyzeImage}
                  disabled={isAnalyzing}
                  className="w-full"
                  data-testid="button-analyze-image"
                >
                  {isAnalyzing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              )}

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Analysis Progress</span>
                    <span>{analysisProgress}%</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        <Card data-testid="card-analysis-results">
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              AI-powered disease detection results and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {detectionResult ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-lg">{detectionResult.disease}</h4>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {detectionResult.confidence}%
                    </p>
                  </div>
                  <Badge variant={getSeverityBadge(detectionResult.severity)}>
                    {detectionResult.severity === 'None' ? 'Healthy' : detectionResult.severity + ' Risk'}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium">Recommendations:</h5>
                  <ul className="space-y-1">
                    {detectionResult.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Button className="w-full" data-testid="button-save-results">
                  Save Results to Cattle Profile
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Upload an image to start disease detection analysis
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Detection History */}
      <Card data-testid="card-detection-history">
        <CardHeader>
          <CardTitle>Recent Detection History</CardTitle>
          <CardDescription>
            Previous disease detection analyses and results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDetectionResults.map((result) => (
              <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <p className="font-medium">Cattle {result.cattleId}</p>
                    <p className="text-muted-foreground">{result.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{result.disease}</p>
                    <p className="text-sm text-muted-foreground">
                      {result.confidence}% confidence
                    </p>
                  </div>
                  <Badge variant={getSeverityBadge(result.severity)}>
                    {result.severity === 'None' ? 'Healthy' : result.severity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}