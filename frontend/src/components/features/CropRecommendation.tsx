import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cropResults } from "@/data/mockData";
import { Sprout, Sun, CloudRain, Building2, Thermometer, Droplets, Beaker, Cloud, ArrowLeft } from "lucide-react";

// Nutrient Icons
const NitrogenIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

const PhosphorusIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L8 8H4l4 6 4-6h-4z"/>
    <circle cx="12" cy="16" r="2"/>
  </svg>
);

const PotassiumIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2C8 8 4 12 4 16c0 4.4 3.6 8 8 8s8-3.6 8-8c0-4-4-8-8-14z"/>
    <path d="M12 8v4M9 12h6"/>
  </svg>
);

// Progress Ring Component
interface ProgressRingProps {
  value: number;
  max?: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

const ProgressRing = ({ value, max = 200, color = "#10b981", size = 60, strokeWidth = 6 }: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(value / max, 1);
  const offset = circumference - percentage * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-gray-200 dark:text-gray-700"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-300"
      />
    </svg>
  );
};

interface CropRecommendationProps {
  category?: string;
}

const CropRecommendation = ({ category = "agriculture" }: CropRecommendationProps) => {
  const [npkValues, setNpkValues] = useState({
    nitrogen: 80,
    phosphorus: 40,
    potassium: 60,
  });
  
  // Environmental Factors state
  const [envValues, setEnvValues] = useState({
    temperature: 25,
    humidity: 65,
    soilPh: 7,
    rainfall: 150,
  });
  
  const [sunlight, setSunlight] = useState(8);
  const [humidity, setHumidity] = useState(65);
  const [isGreenhouse, setIsGreenhouse] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get category-specific crops
  const getCategoryCrops = () => {
    const cropMapping: Record<string, typeof cropResults> = {
      agriculture: cropResults,
      horticulture: [
        { name: "Tomato" },
        { name: "Potato" },
        { name: "Onion" },
        { name: "Cabbage" },
        { name: "Cauliflower" },
      ],
      floriculture: [
        { name: "Rose" },
        { name: "Marigold" },
        { name: "Jasmine" },
        { name: "Lily" },
        { name: "Orchid" },
      ],
    };
    return cropMapping[category] || cropResults;
  };

  const handlePredict = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    const requestData = {
      nitrogen: npkValues.nitrogen,
      phosphorus: npkValues.phosphorus,
      potassium: npkValues.potassium,
      temperature: envValues.temperature,
      humidity: envValues.humidity,
      ph: envValues.soilPh,
      rainfall: envValues.rainfall,
    };

    console.log('Sending request:', requestData);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/crops/recommendations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        const errorMessage = errorData 
          ? `${response.status}: ${JSON.stringify(errorData)}`
          : `${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Set the top recommendation
      if (data.recommended_crops && data.recommended_crops.length > 0) {
        setResult({
          name: data.recommended_crops[0].crop_name,
          confidence: data.recommended_crops[0].confidence,
        });
      } else {
        throw new Error('No recommendations received');
      }
    } catch (err) {
      console.error('Error fetching crop recommendation:', err);
      setError(err instanceof Error ? err.message : 'Failed to get recommendation');
    } finally {
      setIsLoading(false);
    }
  };

  const getThemeColor = () => {
    switch (category) {
      case "agriculture":
        return { primary: "emerald", bg: "from-emerald-50 to-teal-100", ring: "#10b981" };
      case "horticulture":
        return { primary: "amber", bg: "from-amber-50 to-orange-100", ring: "#f59e0b" };
      case "floriculture":
        return { primary: "rose", bg: "from-rose-50 to-pink-100", ring: "#f43f5e" };
      default:
        return { primary: "emerald", bg: "from-emerald-50 to-teal-100", ring: "#10b981" };
    }
  };

  const theme = getThemeColor();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Back to Specializations */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Specializations
      </button>

      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
            <Sprout className={`w-6 h-6 text-${theme.primary}-500`} />
          </div>
          Smart Crop Advisor
        </h2>
        <p className="text-muted-foreground mt-2 text-base">
          Adjust parameters specific to your {category} setup for accurate recommendations.
        </p>
      </div>

      {/* Soil Nutrients Card - Grouped NPK Inputs */}
      <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-2 h-6 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
            Soil Nutrients
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Nitrogen Input with Icon */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-10 h-10 rounded-full bg-${theme.primary}-100 dark:bg-${theme.primary}-900/30 flex items-center justify-center`}>
              <NitrogenIcon />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Nitrogen (N)
                </label>
                <span className={`text-lg font-bold text-${theme.primary}-600`}>{npkValues.nitrogen.toFixed(2)} kg/ha</span>
              </div>
              <Slider
                value={[npkValues.nitrogen]}
                onValueChange={([val]) => setNpkValues((prev) => ({ ...prev, nitrogen: val }))}
                min={0}
                max={200}
                step={1}
                className="py-2"
              />
            </div>
            <ProgressRing value={npkValues.nitrogen} color={theme.ring} size={50} strokeWidth={4} />
          </div>

          {/* Phosphorus Input with Icon */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center`}>
              <PhosphorusIcon />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Phosphorus (P)
                </label>
                <span className="text-lg font-bold text-purple-600">{npkValues.phosphorus.toFixed(2)} kg/ha</span>
              </div>
              <Slider
                value={[npkValues.phosphorus]}
                onValueChange={([val]) => setNpkValues((prev) => ({ ...prev, phosphorus: val }))}
                min={0}
                max={200}
                step={1}
                className="py-2"
              />
            </div>
            <ProgressRing value={npkValues.phosphorus} color="#8b5cf6" size={50} strokeWidth={4} />
          </div>

          {/* Potassium Input with Icon */}
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center`}>
              <PotassiumIcon />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Potassium (K)
                </label>
                <span className="text-lg font-bold text-orange-600">{npkValues.potassium.toFixed(2)} kg/ha</span>
              </div>
              <Slider
                value={[npkValues.potassium]}
                onValueChange={([val]) => setNpkValues((prev) => ({ ...prev, potassium: val }))}
                min={0}
                max={200}
                step={1}
                className="py-2"
              />
            </div>
            <ProgressRing value={npkValues.potassium} color="#f97316" size={50} strokeWidth={4} />
          </div>
        </CardContent>
      </Card>

      {/* Environmental Factors Section */}
      <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-2 h-6 rounded-full bg-gradient-to-b from-sky-400 to-sky-600" />
            Environmental Factors
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Temperature Input */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center`}>
              <Thermometer className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Temperature
                </label>
                <span className="text-lg font-bold text-red-600">{envValues.temperature.toFixed(2)}°C</span>
              </div>
              <Slider
                value={[envValues.temperature]}
                onValueChange={([val]) => setEnvValues((prev) => ({ ...prev, temperature: val }))}
                min={0}
                max={50}
                step={0.1}
                className="py-2"
              />
            </div>
            <ProgressRing value={envValues.temperature} max={50} color="#ef4444" size={50} strokeWidth={4} />
          </div>

          {/* Humidity Input */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center`}>
              <CloudRain className="w-5 h-5 text-sky-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Humidity
                </label>
                <span className="text-lg font-bold text-sky-600">{envValues.humidity.toFixed(2)}%</span>
              </div>
              <Slider
                value={[envValues.humidity]}
                onValueChange={([val]) => setEnvValues((prev) => ({ ...prev, humidity: val }))}
                min={0}
                max={100}
                step={0.1}
                className="py-2"
              />
            </div>
            <ProgressRing value={envValues.humidity} color="#0ea5e9" size={50} strokeWidth={4} />
          </div>

          {/* Soil pH Input */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center`}>
              <Beaker className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Soil pH
                </label>
                <span className="text-lg font-bold text-emerald-600">
                  {envValues.soilPh.toFixed(2)}
                  <span className="text-xs text-muted-foreground ml-1">
                    {envValues.soilPh < 7 ? 'Acidic' : envValues.soilPh > 7 ? 'Alkaline' : 'Neutral'}
                  </span>
                </span>
              </div>
              <Slider
                value={[envValues.soilPh]}
                onValueChange={([val]) => setEnvValues((prev) => ({ ...prev, soilPh: val }))}
                min={0}
                max={14}
                step={0.1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0 (Acidic)</span>
                <span className="font-medium">7 (Neutral)</span>
                <span>14 (Alkaline)</span>
              </div>
            </div>
            <ProgressRing value={envValues.soilPh} max={14} color="#10b981" size={50} strokeWidth={4} />
          </div>

          {/* Rainfall Input */}
          <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center`}>
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  Rainfall
                </label>
                <span className="text-lg font-bold text-blue-600">{envValues.rainfall.toFixed(2)} mm</span>
              </div>
              <Slider
                value={[envValues.rainfall]}
                onValueChange={([val]) => setEnvValues((prev) => ({ ...prev, rainfall: val }))}
                min={0}
                max={300}
                step={0.1}
                className="py-2"
              />
            </div>
            <ProgressRing value={envValues.rainfall} max={300} color="#3b82f6" size={50} strokeWidth={4} />
          </div>
        </CardContent>
      </Card>

      {/* Category-specific inputs */}

      {category === "horticulture" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Sunlight Input with Icon */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="w-2 h-6 rounded-full bg-gradient-to-b from-yellow-400 to-orange-500" />
                Sunlight
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Daily Exposure
                    </label>
                    <span className="text-lg font-bold text-yellow-600">{sunlight.toFixed(2)}h</span>
                  </div>
                  <Slider
                    value={[sunlight]}
                    onValueChange={([val]) => setSunlight(val)}
                    min={0}
                    max={14}
                    step={0.1}
                    className="py-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Humidity Input with Icon */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <div className="w-2 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-blue-500" />
                Humidity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                  <CloudRain className="w-5 h-5 text-cyan-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Relative Humidity
                    </label>
                    <span className="text-lg font-bold text-cyan-600">{humidity.toFixed(2)}%</span>
                  </div>
                  <Slider
                    value={[humidity]}
                    onValueChange={([val]) => setHumidity(val)}
                    min={0}
                    max={100}
                    step={0.1}
                    className="py-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {category === "floriculture" && (
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="w-2 h-6 rounded-full bg-gradient-to-b from-rose-400 to-pink-500" />
              Greenhouse
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Controlled Environment</h4>
                  <p className="text-sm text-muted-foreground">Enable for greenhouse cultivation</p>
                </div>
              </div>
              <Button
                onClick={() => setIsGreenhouse(!isGreenhouse)}
                className={`
                  rounded-full px-6 transition-all duration-300
                  ${isGreenhouse
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                    : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500"
                  }
                `}
              >
                {isGreenhouse ? "Enabled" : "Disabled"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Primary Action CTA Button */}
      <Button
        onClick={handlePredict}
        size="lg"
        disabled={isLoading}
        className="
          w-full py-4 text-lg font-semibold rounded-full
          bg-gradient-to-r from-emerald-600 to-teal-600
          hover:from-emerald-700 hover:to-teal-700
          text-white shadow-lg shadow-emerald-500/25
          hover:shadow-xl hover:shadow-emerald-500/30
          hover:scale-[1.02]
          active:scale-[0.98]
          transition-all duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        <Sprout className="w-5 h-5 mr-2" />
        {isLoading ? 'Analyzing...' : 'Predict Best Crop'}
      </Button>

      {error && (
        <Card className="border-0 shadow-lg bg-red-50 dark:bg-red-900/20 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <p className="text-red-600 dark:text-red-400 font-medium">
              ⚠️ {error}
            </p>
            <p className="text-sm text-red-500 dark:text-red-300 mt-2">
              Make sure the backend server is running on http://127.0.0.1:8000
            </p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className={`border-0 shadow-lg bg-gradient-to-r ${theme.bg} rounded-2xl overflow-hidden`}>
          <CardHeader className="border-b border-black/5 pb-4">
            <CardTitle className={`text-lg font-semibold text-${theme.primary}-600`}>
              Recommended Crop
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-${theme.primary}-100 dark:bg-${theme.primary}-900/30 flex items-center justify-center`}>
                <Sprout className={`w-8 h-8 text-${theme.primary}-500`} />
              </div>
              <div className="flex-1">
                <p className="text-3xl font-bold text-foreground capitalize">{result.name}</p>
                {result.confidence && (
                  <p className="text-lg font-semibold text-emerald-600 mt-1">
                    {result.confidence.toFixed(2)}% Confidence
                  </p>
                )}
                <p className="text-muted-foreground text-sm mt-1">
                  Best suited for your {category === "horticulture" ? "garden" : "farm"} conditions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CropRecommendation;
