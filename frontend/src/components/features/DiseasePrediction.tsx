import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bug, Upload, CheckCircle, ScanLine, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DiseasePrediction = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ disease: string; confidence: number; cure: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setImageFile(file);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError('Please upload an image first');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('plant_image', imageFile);

      const response = await fetch('http://127.0.0.1:8000/api/diseases/predictions/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData ? JSON.stringify(errorData) : `${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Disease API Response:', data);

      // Extract result from response
      if (data.additional_info && data.additional_info.all_predictions) {
        const topPrediction = data.additional_info.all_predictions[0];
        
        setResult({
          disease: topPrediction.disease,
          confidence: topPrediction.confidence,
          cure: data.predicted_disease?.treatment || 
                "Consult with an agricultural expert for proper treatment recommendations.",
        });
      } else if (data.notes) {
        setResult({
          disease: data.notes,
          confidence: data.confidence || 0,
          cure: "No specific treatment needed for healthy plants. Continue regular care.",
        });
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error analyzing disease:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze disease');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Bug className="w-8 h-8 text-primary" /> Dr. Crop — Disease Detection
        </h2>
        <p className="text-muted-foreground mt-1">Upload a leaf image to detect plant diseases.</p>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="pt-6">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
            className="relative border-2 border-dashed border-primary/40 rounded-xl p-10 text-center cursor-pointer hover:border-primary/70 hover:bg-primary/5 transition-all duration-300 group"
          >
            {/* Upload Prompt */}
            {!image && (
              <div className="space-y-3 group-hover:scale-105 transition-transform duration-300">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground font-medium">
                  Drag & drop a leaf image here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG formats
                </p>
              </div>
            )}

            {/* Image Preview with Scan Animation */}
            {image && (
              <div className="relative scan-container rounded-lg overflow-hidden">
                {/* Uploaded Image */}
                <img
                  src={image}
                  alt="Uploaded leaf"
                  className={`max-h-80 mx-auto rounded-lg transition-all duration-500 ${
                    isAnalyzing ? "opacity-50 blur-sm" : "opacity-100"
                  }`}
                />

                {/* Scanning Overlay */}
                {isAnalyzing && (
                  <>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0 scan-line animate-scan-line" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-black/70 text-white px-6 py-3 rounded-full flex items-center gap-2"
                      >
                        <ScanLine className="w-5 h-5 animate-pulse" />
                        <span className="font-medium">Scanning...</span>
                      </motion.div>
                    </div>
                    {/* Scanning Grid */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="w-full h-full" style={{
                        backgroundImage: `
                          linear-gradient(0deg, transparent 24%, white 25%, white 26%, transparent 27%, transparent 74%, white 75%, white 76%, transparent 77%),
                          linear-gradient(90deg, transparent 24%, white 25%, white 26%, transparent 27%, transparent 74%, white 75%, white 76%, transparent 77%)
                        `,
                        backgroundSize: '50px 50px',
                      }} />
                    </div>
                  </>
                )}

                {/* Analyzing Progress */}
                {isAnalyzing && (
                  <motion.div
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-2 bg-white/90 dark:bg-gray-900/90 px-4 py-2 rounded-full shadow-lg">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm font-medium">Analyzing image...</span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Change Image Button */}
            {image && !isAnalyzing && (
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setImage(null);
                  setResult(null);
                }}
              >
                Change Image
              </Button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />

          <Button
            onClick={handleAnalyze}
            size="lg"
            className="w-full mt-6 text-lg font-bold"
            disabled={!image || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Disease...
              </>
            ) : (
              <>
                <ScanLine className="w-5 h-5 mr-2" />
                🔬 Analyze Disease
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-500/30 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-400 font-medium">
              ⚠️ {error}
            </p>
            <p className="text-sm text-red-500 dark:text-red-300 mt-2">
              Make sure the backend server is running and the disease model is loaded.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Analysis Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <Bug className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Disease Detected</p>
                    <p className="text-xl font-bold text-foreground">{result.disease}</p>
                  </div>
                </div>

                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-muted-foreground">Confidence Score</p>
                    <p className="text-2xl font-bold text-primary">{result.confidence}%</p>
                  </div>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.confidence}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                </div>

                <div className="p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Cure / Remedy</p>
                  <p className="text-foreground leading-relaxed">{result.cure}</p>
                </div>

                <Button variant="outline" className="w-full">
                  Consult Agricultural Expert
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiseasePrediction;
