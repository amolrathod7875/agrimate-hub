import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Droplets, Sun, CloudRain, Building2, Building, Waves, CloudFog } from "lucide-react";

// Agriculture - Irrigation Source Slider
interface IrrigationSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const IrrigationSlider = ({ value, onChange }: IrrigationSliderProps) => {
  const irrigationSources = [
    { value: 0, label: "Rainfed", icon: <CloudRain className="w-4 h-4" /> },
    { value: 25, label: "Well", icon: <Waves className="w-4 h-4" /> },
    { value: 50, label: "Canal", icon: <Droplets className="w-4 h-4" /> },
    { value: 75, label: "Tube Well", icon: <Waves className="w-4 h-4" /> },
    { value: 100, label: "Drip/Sprinkler", icon: <Droplets className="w-4 h-4" /> },
  ];

  const getCurrentSource = () => {
    if (value < 12) return irrigationSources[0];
    if (value < 37) return irrigationSources[1];
    if (value < 62) return irrigationSources[2];
    if (value < 87) return irrigationSources[3];
    return irrigationSources[4];
  };

  const currentSource = getCurrentSource();

  return (
    <Card className="agri-neumorphic bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-amber-800 dark:text-amber-200">
          <Droplets className="w-5 h-5" />
          Irrigation Source
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-white/50 rounded-lg shadow-sm">
            <span className="text-amber-600">{currentSource.icon}</span>
            <span className="font-semibold text-foreground">{currentSource.label}</span>
          </div>
          <Slider
            value={[value]}
            onValueChange={([val]) => onChange(val)}
            min={0}
            max={100}
            step={1}
            className="py-4"
          />
          <div className="grid grid-cols-5 gap-1 text-xs text-muted-foreground">
            {irrigationSources.map((source) => (
              <div key={source.value} className="text-center">
                {source.icon}
                <div className="mt-1">{source.label.split("/")[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Horticulture - Sunlight & Humidity Inputs
interface SunlightHumidityInputsProps {
  sunlight: number;
  humidity: number;
  onSunlightChange: (value: number) => void;
  onHumidityChange: (value: number) => void;
}

export const SunlightHumidityInputs = ({
  sunlight,
  humidity,
  onSunlightChange,
  onHumidityChange,
}: SunlightHumidityInputsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Sunlight Input */}
      <Card className="horti-neumorphic bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-orange-800 dark:text-orange-200">
            <Sun className="w-5 h-5" />
            Hours of Sunlight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-orange-600">{sunlight}</span>
              <span className="text-sm text-muted-foreground">hours/day</span>
            </div>
            <Slider
              value={[sunlight]}
              onValueChange={([val]) => onSunlightChange(val)}
              min={0}
              max={14}
              step={0.5}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0h (Shade)</span>
              <span>14h (Full Sun)</span>
            </div>
            {/* Sun indicator */}
            <div className="flex items-center justify-center">
              <div
                className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg flex items-center justify-center animate-pulse-glow"
                style={{ opacity: 0.3 + (sunlight / 14) * 0.7 }}
              >
                <Sun className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Humidity Input */}
      <Card className="horti-neumorphic bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2 text-cyan-800 dark:text-cyan-200">
            <CloudFog className="w-5 h-5" />
            Humidity Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold text-cyan-600">{humidity}</span>
              <span className="text-sm text-muted-foreground">% RH</span>
            </div>
            <Slider
              value={[humidity]}
              onValueChange={([val]) => onHumidityChange(val)}
              min={0}
              max={100}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0% (Dry)</span>
              <span>100% (Saturated)</span>
            </div>
            {/* Humidity indicator */}
            <div className="w-full h-3 bg-gradient-to-r from-yellow-200 via-green-300 to-blue-400 rounded-full shadow-inner" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Floriculture - Greenhouse Toggle
interface GreenhouseToggleProps {
  isGreenhouse: boolean;
  onChange: (value: boolean) => void;
}

export const GreenhouseToggle = ({ isGreenhouse, onChange }: GreenhouseToggleProps) => {
  return (
    <Card className="florist-neumorphic bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold flex items-center gap-2 text-pink-800 dark:text-pink-200">
          {isGreenhouse ? <Building2 className="w-5 h-5" /> : <Building className="w-5 h-5" />}
          Cultivation Type
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-full transition-colors duration-300 ${
                !isGreenhouse ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
              }`}
            >
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-foreground">Open Field</div>
              <div className="text-xs text-muted-foreground">Natural sunlight & weather</div>
            </div>
          </div>

          <Switch
            checked={isGreenhouse}
            onCheckedChange={onChange}
            className="data-[state=checked]:bg-pink-500"
          />

          <div className="flex items-center gap-4">
            <div>
              <div className="font-semibold text-foreground">Greenhouse</div>
              <div className="text-xs text-muted-foreground">Controlled environment</div>
            </div>
            <div
              className={`p-3 rounded-full transition-colors duration-300 ${
                isGreenhouse ? "bg-pink-100 text-pink-600" : "bg-muted text-muted-foreground"
              }`}
            >
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Additional controls based on toggle */}
        <div
          className={`mt-4 p-4 rounded-xl transition-all duration-300 ${
            isGreenhouse
              ? "bg-pink-100/50 opacity-100"
              : "bg-muted/30 opacity-50 pointer-events-none"
          }`}
        >
          <Label className="text-sm font-medium mb-2 block">Greenhouse Temperature</Label>
          <Input
            type="number"
            placeholder="22-28°C"
            className="neumorphic-input"
          />
        </div>
      </CardContent>
    </Card>
  );
};
