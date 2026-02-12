import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import {
  Sprout, Bug, Landmark, TrendingUp, Store, UserCircle, Menu, ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/contexts/ProfileContext";
import CropRecommendation from "@/components/features/CropRecommendation";
import DiseasePrediction from "@/components/features/DiseasePrediction";
import GovernmentSchemes from "@/components/features/GovernmentSchemes";
import MandiPrice from "@/components/features/MandiPrice";
import MarketSelling from "@/components/features/MarketSelling";
import Profile from "@/components/features/Profile";

const navItems = [
  { key: "crop", label: "Crop Recommendation", icon: Sprout },
  { key: "disease", label: "Disease Prediction", icon: Bug },
  { key: "schemes", label: "Government Schemes", icon: Landmark },
  { key: "mandi", label: "Mandi Prices", icon: TrendingUp },
  { key: "market", label: "Market for Selling", icon: Store },
  { key: "profile", label: "Profile", icon: UserCircle },
];

// Category theme configurations with modern colors
const categoryThemes = {
  agriculture: {
    name: "Agriculture",
    primary: "bg-gradient-to-br from-emerald-600 to-teal-700",
    sidebarBg: "#1B4332", // Charcoal Green
    sidebarPrimary: "#34d399",
    sidebarHover: "#2D5A47",
    accent: "agri",
    icon: "🌾",
    description: "Crops, grains & field farming",
  },
  horticulture: {
    name: "Horticulture",
    primary: "bg-gradient-to-br from-amber-500 to-orange-600",
    sidebarBg: "#2D3436", // Slate Grey
    sidebarPrimary: "#fbbf24",
    sidebarHover: "#3d4446",
    accent: "horti",
    icon: "🍒",
    description: "Fruits, vegetables & orchards",
  },
  floriculture: {
    name: "Floriculture",
    primary: "bg-gradient-to-br from-rose-500 to-pink-600",
    sidebarBg: "#4a3f44", // Deep muted plum
    sidebarPrimary: "#f472b6",
    sidebarHover: "#5a4f54",
    accent: "florist",
    icon: "🌸",
    description: "Flowers & ornamental plants",
  },
};

const Dashboard = () => {
  const { category = "agriculture" } = useParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("crop");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { profile } = useProfile();

  const theme = categoryThemes[category as keyof typeof categoryThemes] || categoryThemes.agriculture;

  const renderContent = () => {
    switch (activeSection) {
      case "crop": return <CropRecommendation category={category} />;
      case "disease": return <DiseasePrediction />;
      case "schemes": return <GovernmentSchemes />;
      case "mandi": return <MandiPrice />;
      case "market": return <MarketSelling />;
      case "profile": return <Profile />;
      default: return <CropRecommendation category={category} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background font-sans">
      {/* Modernized Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? "w-64" : "w-20"}
          flex flex-col transition-all duration-300 shrink-0 fixed md:relative h-screen z-30
          rounded-r-2xl my-2 ml-2
        `}
        style={{
          backgroundColor: theme.sidebarBg,
        }}
      >
        {/* Sidebar Header */}
        <div
          className="flex items-center justify-between p-4 border-b border-white/10"
        >
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <span className="text-2xl">{theme.icon}</span>
              <span className="font-semibold text-lg text-white tracking-tight">{theme.name}</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/80 hover:bg-white/10 hover:text-white transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation Items with Pill Highlight */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`
                flex items-center gap-3 w-full px-4 py-3 rounded-full
                transition-all duration-300
                ${activeSection === item.key
                  ? "bg-white/15 text-white shadow-lg"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              `}
              style={{
                backgroundColor: activeSection === item.key ? undefined : undefined,
              }}
            >
              <item.icon
                className="w-5 h-5 shrink-0"
              />
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
              {/* Active Indicator Dot */}
              {activeSection === item.key && sidebarOpen && (
                <div className="ml-auto w-2 h-2 rounded-full bg-current" />
              )}
            </button>
          ))}
        </nav>

        {/* Category Info at Bottom */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/10">
            <p className="text-xs text-white/50 mb-1">Specialized for</p>
            <p className="text-sm font-medium text-white/80">{theme.description}</p>
          </div>
        )}
      </aside>

      {/* Main area */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? "md:ml-0 ml-16" : "ml-16"}`}>
        {/* Top Navigation Bar */}
        <header className="h-16 border-b bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h2 className="text-lg font-semibold text-foreground">
              {navItems.find((item) => item.key === activeSection)?.label}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <span>Welcome back,</span>
              <span className="font-medium text-foreground">{profile?.name || "Farmer"}</span>
            </div>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src={profile?.avatar} alt={profile?.name || "User"} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {profile?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl mx-auto"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
