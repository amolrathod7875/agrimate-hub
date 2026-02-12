import { useState, useEffect } from "react";
import { Cloud, Sun, CloudRain, Wind, Droplets, MapPin, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  location: string;
}

const getWeatherIcon = (condition: string) => {
  switch (condition.toLowerCase()) {
    case "sunny":
    case "clear":
      return <Sun className="w-8 h-8 text-amber-400" />;
    case "cloudy":
    case "clouds":
      return <Cloud className="w-8 h-8 text-gray-400" />;
    case "rainy":
    case "rain":
      return <CloudRain className="w-8 h-8 text-blue-400" />;
    default:
      return <Sun className="w-8 h-8 text-amber-400" />;
  }
};

const WeatherWidget = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          () => {
            // Fallback to default location (Delhi) if permission denied
            setWeather({
              temperature: 28,
              humidity: 65,
              condition: "Sunny",
              windSpeed: 12,
              location: "Delhi, India",
            });
            setLoading(false);
          }
        );
      } else {
        setWeather({
          temperature: 28,
          humidity: 65,
          condition: "Sunny",
          windSpeed: 12,
          location: "Delhi, India",
        });
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (location) {
      // Simulate API call - Replace with actual weather API
      const fetchWeather = async () => {
        try {
          // Simulated weather data based on location
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setWeather({
            temperature: Math.round(24 + Math.random() * 10),
            humidity: Math.round(50 + Math.random() * 30),
            condition: ["Sunny", "Cloudy", "Partly Cloudy", "Clear"][Math.floor(Math.random() * 4)],
            windSpeed: Math.round(8 + Math.random() * 15),
            location: "Your Location",
          });
        } catch {
          setError("Failed to fetch weather");
        } finally {
          setLoading(false);
        }
      };

      fetchWeather();
    }
  }, [location]);

  if (loading) {
    return (
      <Card className="min-w-[200px] bg-white/90 backdrop-blur-sm shadow-lg">
        <CardContent className="py-4 px-6 flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading weather...</span>
        </CardContent>
      </Card>
    );
  }

  if (error || !weather) {
    return (
      <Card className="min-w-[200px] bg-white/90 backdrop-blur-sm shadow-lg">
        <CardContent className="py-4 px-6 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Weather unavailable</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-w-[220px] bg-white/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="py-3 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-xs text-muted-foreground font-medium">{weather.location}</span>
          </div>
          <div className="flex items-center gap-1">
            {getWeatherIcon(weather.condition)}
            <span className="text-2xl font-bold text-foreground">{weather.temperature}°C</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Droplets className="w-3 h-3" />
            <span>{weather.humidity}%</span>
          </div>
          <div className="flex items-center gap-1">
            <Wind className="w-3 h-3" />
            <span>{weather.windSpeed} km/h</span>
          </div>
          <span className="font-medium text-primary">{weather.condition}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
