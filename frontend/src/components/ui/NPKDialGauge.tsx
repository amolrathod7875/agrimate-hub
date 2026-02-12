import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface NPKDialGaugeProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  color?: "nitrogen" | "phosphorus" | "potassium";
  onChange?: (value: number) => void;
}

const colorMap = {
  nitrogen: {
    bg: "from-blue-400 to-blue-600",
    light: "bg-blue-100 text-blue-600",
    ring: "ring-blue-400",
  },
  phosphorus: {
    bg: "from-purple-400 to-purple-600",
    light: "bg-purple-100 text-purple-600",
    ring: "ring-purple-400",
  },
  potassium: {
    bg: "from-orange-400 to-orange-600",
    light: "bg-orange-100 text-orange-600",
    ring: "ring-orange-400",
  },
};

const NPKDialGauge = ({
  label,
  value,
  min = 0,
  max = 200,
  unit = "kg/ha",
  color = "nitrogen",
  onChange,
}: NPKDialGaugeProps) => {
  const colors = colorMap[color];
  const percentage = ((value - min) / (max - min)) * 100;

  // Calculate needle position
  const rotation = (percentage / 100) * 180 - 90;

  return (
    <Card className="neumorphic-card dark:neumorphic-card-dark hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
          {label}
          <span className={`px-2 py-1 rounded-full text-xs ${colors.light}`}>
            {unit}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          {/* Dial Gauge */}
          <div className="relative w-40 h-24 mb-4">
            {/* Gauge Background */}
            <div className="absolute w-full h-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-t-full shadow-inner overflow-hidden">
              {/* Gradient fill */}
              <div
                className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 rounded-t-full opacity-20"
              />
            </div>

            {/* Needle */}
            <div
              className="absolute bottom-0 left-1/2 w-1 h-16 bg-foreground origin-bottom transform transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(-50%) rotate(${rotation}deg)`,
                transformOrigin: "bottom center",
              }}
            >
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-primary rounded-full shadow" />
            </div>

            {/* Center dot */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg" />
          </div>

          {/* Value Display */}
          <div className="text-center mb-4">
            <span className={`text-4xl font-bold bg-gradient-to-r ${colors.bg} bg-clip-text text-transparent`}>
              {value}
            </span>
          </div>

          {/* Slider Control */}
          {onChange && (
            <div className="w-full px-2">
              <Slider
                value={[value]}
                onValueChange={([val]) => onChange(val)}
                min={min}
                max={max}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{min}</span>
                <span>{max}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NPKDialGauge;
