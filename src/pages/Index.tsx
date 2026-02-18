import { useState } from "react";
import { CloudSun, History, Anchor, Cloud } from "lucide-react";
import weatherBg from "@/assets/weather-bg.jpg";
import LocationSearch from "@/components/LocationSearch";
import CurrentWeatherCard from "@/components/CurrentWeatherCard";
import HistoricalWeather from "@/components/HistoricalWeather";
import MarineWeather from "@/components/MarineWeather";
import { fetchCurrentWeather, type CurrentWeatherResponse } from "@/lib/weatherApi";

type Tab = "current" | "historical" | "marine";

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "current", label: "Current", icon: <CloudSun className="w-4 h-4" /> },
  { id: "historical", label: "Historical", icon: <History className="w-4 h-4" /> },
  { id: "marine", label: "Marine", icon: <Anchor className="w-4 h-4" /> },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("current");
  const [currentData, setCurrentData] = useState<CurrentWeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCurrentSearch = async (location: string) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchCurrentWeather(location);
      setCurrentData(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch weather");
      setCurrentData(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <img
        src={weatherBg}
        alt=""
        className="fixed inset-0 w-full h-full object-cover"
      />
      <div className="fixed inset-0 bg-background/60" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="glass-subtle border-b border-border/20 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="w-7 h-7 text-primary" />
              <h1 className="font-display text-xl font-bold text-foreground text-glow">
                WeatherGlass
              </h1>
            </div>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Powered by Weatherstack
            </p>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "glass-strong text-primary border-primary/30"
                    : "glass-subtle text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "current" && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <LocationSearch onSearch={handleCurrentSearch} isLoading={isLoading} />
              </div>
              {error && (
                <div className="glass rounded-xl p-4 border-destructive/30 max-w-md mx-auto">
                  <p className="text-destructive text-sm text-center">{error}</p>
                </div>
              )}
              {currentData && <CurrentWeatherCard data={currentData} />}
              {!currentData && !error && (
                <div className="text-center mt-16 animate-fade-up">
                  <CloudSun className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-float" />
                  <p className="text-muted-foreground font-display text-lg">
                    Search a location to see the weather
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "historical" && <HistoricalWeather />}
          {activeTab === "marine" && <MarineWeather />}
        </main>
      </div>
    </div>
  );
};

export default Index;
