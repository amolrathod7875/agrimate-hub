import { useNavigate } from "react-router-dom";
import { Wheat, Cherry, Flower2, Sprout, ShieldCheck, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import WeatherWidget from "@/components/ui/WeatherWidget";
import { motion } from "framer-motion";

// SVG Icons for categories
const TractorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <path d="M4 15h8v-3a2 2 0 0 1 2-2h2v4h-4"/>
    <path d="M14 15V9a2 2 0 0 0-2-2h-2v4h4"/>
    <path d="M7 15v-4a2 2 0 0 1 2-2h1"/>
    <circle cx="7" cy="15" r="3"/>
    <circle cx="16" cy="15" r="3"/>
    <path d="M20 15v-2a2 2 0 0 0 2-2v0"/>
  </svg>
);

const PottedPlantIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <path d="M12 22V8"/>
    <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
    <path d="M12 12a4 4 0 0 1 4 4c0 2-2 4-4 4s-4-2-4-4a4 4 0 0 1 4-4Z"/>
  </svg>
);

const FlowerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10">
    <path d="M12 22c-5.5 0-10-4.5-10-10 0-5.5 4.5-10 10-10 5.5 0 10 4.5 10 10"/>
    <path d="M12 12c-2 0-3.5-1.5-3.5-3.5S9.5 5 12 5s3.5 1.5 3.5 3.5S14 12 12 12Z"/>
    <circle cx="12" cy="12" r="2"/>
    <path d="M12 2v3"/>
    <path d="M12 19v3"/>
    <path d="M2 12h3"/>
    <path d="M19 12h3"/>
  </svg>
);

const categories = [
  {
    name: "Agriculture",
    icon: TractorIcon,
    description: "Crops, grains & field farming",
    path: "/dashboard/agriculture",
    color: "from-emerald-600 to-teal-700",
    glowColor: "from-emerald-400/20 to-teal-500/20",
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
    whyChoose: [
      { icon: ShieldCheck, text: "Soil Health Analysis" },
      { icon: TrendingUp, text: "Market Price Trends" },
      { icon: Sprout, text: "Crop Rotation Guide" },
    ],
  },
  {
    name: "Horticulture",
    icon: PottedPlantIcon,
    description: "Fruits, vegetables & orchards",
    path: "/dashboard/horticulture",
    color: "from-amber-500 to-orange-600",
    glowColor: "from-amber-400/20 to-orange-500/20",
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    whyChoose: [
      { icon: ShieldCheck, text: "Orchard Management" },
      { icon: TrendingUp, text: "Fresh Produce Prices" },
      { icon: Sprout, text: "Organic Cultivation" },
    ],
  },
  {
    name: "Floriculture",
    icon: FlowerIcon,
    description: "Flowers & ornamental plants",
    path: "/dashboard/floriculture",
    color: "from-rose-500 to-pink-600",
    glowColor: "from-rose-400/20 to-pink-500/20",
    iconBg: "bg-rose-500/20",
    iconColor: "text-rose-400",
    whyChoose: [
      { icon: ShieldCheck, text: "Greenhouse Control" },
      { icon: TrendingUp, text: "Florist Market Rates" },
      { icon: Sprout, text: "Exotic Varieties" },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-sans overflow-hidden">
      {/* Header with Weather Widget */}
      <header className="absolute top-0 left-0 right-0 z-20 p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-end">
          <WeatherWidget />
        </div>
      </header>

      {/* Hero Section with Gradient Overlay */}
      <section className="relative h-screen flex flex-col justify-center bg-hero-gradient bg-hero-pattern overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.6)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1920&q=80')`,
          }}
        />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 text-white/20"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Sprout className="w-16 h-16" />
          </motion.div>
          <motion.div
            className="absolute bottom-20 right-10 text-white/20"
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Wheat className="w-20 h-20" />
          </motion.div>
        </div>

        {/* Hero Content */}
        <motion.div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Welcome, Kisan
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Your smart farming companion — Choose your specialization and grow smarter
          </motion.p>

          {/* Glassmorphism Category Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {categories.map((cat, index) => (
              <motion.div key={cat.name} variants={itemVariants}>
                <Card
                  onClick={() => navigate(cat.path)}
                  className={`
                    cursor-pointer group relative overflow-hidden
                    bg-white/10 backdrop-blur-md
                    border border-white/20
                    hover:border-white/40
                    hover:bg-white/20
                    transform hover:-translate-y-2
                    transition-all duration-300
                    text-white
                  `}
                >
                  {/* Gradient Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  <CardContent className="flex flex-col items-center justify-center py-8 px-6 text-center h-full relative z-10">
                    {/* Icon Circle with Glass Effect */}
                    <div className={`w-20 h-20 rounded-full ${cat.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                      {cat.icon()}
                    </div>

                    <h3 className="text-xl font-bold mb-2">{cat.name}</h3>
                    <p className="text-white/70 text-sm mb-4">{cat.description}</p>

                    {/* Why Choose Items */}
                    <div className="space-y-2 w-full">
                      {cat.whyChoose.map((item, i) => (
                        <div key={i} className="flex items-center justify-center gap-2 text-xs text-white/60">
                          <item.icon className="w-3 h-3" />
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>

                    {/* Arrow Indicator */}
                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="w-5 h-5 mx-auto" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;
