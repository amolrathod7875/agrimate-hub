import { TrendingUp, TrendingDown, Wheat, Leaf, Sprout } from "lucide-react";

interface CropPrice {
  name: string;
  price: number;
  change: number;
  icon: React.ReactNode;
}

const crops: CropPrice[] = [
  { name: "Wheat", price: 2250, change: 2.5, icon: <Wheat className="w-4 h-4" /> },
  { name: "Rice", price: 2050, change: -1.2, icon: <Leaf className="w-4 h-4" /> },
  { name: "Cotton", price: 5800, change: 3.8, icon: <Sprout className="w-4 h-4" /> },
  { name: "Soybean", price: 4000, change: 0.5, icon: <Leaf className="w-4 h-4" /> },
  { name: "Maize", price: 1950, change: -0.8, icon: <Wheat className="w-4 h-4" /> },
  { name: "Sugarcane", price: 350, change: 1.5, icon: <Sprout className="w-4 h-4" /> },
  { name: "Groundnut", price: 6200, change: 2.1, icon: <Leaf className="w-4 h-4" /> },
  { name: "Gram", price: 5500, change: -0.3, icon: <Wheat className="w-4 h-4" /> },
];

const TrendingCropsMarquee = () => {
  return (
    <div className="w-full bg-white/10 backdrop-blur-md border-t border-white/20">
      <div className="py-3 overflow-hidden max-w-[100vw]">
        <div className="marquee-container">
          <div className="marquee-content flex items-center gap-8">
            {/* Render twice for seamless loop */}
            {crops.map((crop, index) => (
              <div
                key={`${crop.name}-${index}`}
                className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group"
              >
                <span className="text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                  {crop.icon}
                </span>
                <span className="text-sm font-semibold text-gray-800">{crop.name}</span>
                <span className="text-sm text-gray-500">₹{crop.price}/q</span>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    crop.change >= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {crop.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{crop.change >= 0 ? "+" : ""}{crop.change}%</span>
                </div>
              </div>
            ))}
            {crops.map((crop, index) => (
              <div
                key={`${crop.name}-duplicate-${index}`}
                className="flex items-center gap-2 px-4 py-2 bg-white/90 rounded-full shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group"
              >
                <span className="text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                  {crop.icon}
                </span>
                <span className="text-sm font-semibold text-gray-800">{crop.name}</span>
                <span className="text-sm text-gray-500">₹{crop.price}/q</span>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    crop.change >= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {crop.change >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span>{crop.change >= 0 ? "+" : ""}{crop.change}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingCropsMarquee;
