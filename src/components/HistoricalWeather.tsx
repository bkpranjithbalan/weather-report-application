import { useState } from "react";
import { Calendar, Sunrise, Sunset, Moon, Sun } from "lucide-react";
import type { HistoricalWeatherResponse } from "@/lib/weatherApi";
import { fetchHistoricalWeather } from "@/lib/weatherApi";

const HistoricalWeather = () => {
  const [data, setData] = useState<HistoricalWeatherResponse | null>(null);
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!location || !date) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await fetchHistoricalWeather(location, date);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to fetch historical weather");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const historicalData = data?.historical ? Object.values(data.historical)[0] : null;

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-center">
        <div className="glass-input rounded-2xl flex items-center px-5 py-3.5 gap-3 w-full sm:w-auto">
          <Calendar className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location..."
            className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground font-body text-sm"
          />
        </div>
        <div className="glass-input rounded-2xl flex items-center px-5 py-3.5 gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-transparent border-none outline-none text-foreground font-body text-sm [color-scheme:dark]"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading || !location || !date}
          className="glass-button-primary text-foreground px-6 py-3.5 rounded-2xl text-sm font-medium disabled:opacity-40"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
              Loading...
            </span>
          ) : "Search"}
        </button>
      </div>

      {error && (
        <div className="glass rounded-2xl p-4 border-destructive/30">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {historicalData && data?.location && (
        <div className="space-y-4">
          <div className="glass-strong rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer pointer-events-none" />
            <div className="relative">
              <p className="text-muted-foreground text-sm mb-1">
                {data.location.name}, {data.location.country}
              </p>
              <p className="text-xs text-muted-foreground mb-4">{historicalData.date}</p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Min</p>
                  <p className="text-2xl font-display font-bold text-temp-cold">{historicalData.mintemp}°</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Avg</p>
                  <p className="text-2xl font-display font-bold text-foreground">{historicalData.avgtemp}°</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Max</p>
                  <p className="text-2xl font-display font-bold text-temp-warm">{historicalData.maxtemp}°</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MiniStat icon={<Sunrise className="w-4 h-4" />} label="Sunrise" value={historicalData.astro.sunrise} />
                <MiniStat icon={<Sunset className="w-4 h-4" />} label="Sunset" value={historicalData.astro.sunset} />
                <MiniStat icon={<Sun className="w-4 h-4" />} label="Sun Hours" value={`${historicalData.sunhour}h`} />
                <MiniStat icon={<Moon className="w-4 h-4" />} label="Moon Phase" value={historicalData.astro.moon_phase} />
              </div>
            </div>
          </div>

          {/* Hourly breakdown */}
          {historicalData.hourly && historicalData.hourly.length > 0 && (
            <div className="glass rounded-3xl p-6">
              <h3 className="text-sm font-display font-semibold text-foreground mb-4 uppercase tracking-wide">
                Hourly Breakdown
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {historicalData.hourly.map((h, i) => (
                  <div key={i} className="glass-button rounded-2xl p-3 min-w-[100px] flex flex-col items-center gap-1 shrink-0 cursor-default">
                    <span className="text-xs text-muted-foreground">{String(parseInt(h.time) / 100).padStart(2, '0')}:00</span>
                    {h.weather_icons?.[0] && <img src={h.weather_icons[0]} alt="" className="w-8 h-8" />}
                    <span className="font-display font-semibold text-foreground">{h.temperature}°</span>
                    <span className="text-xs text-muted-foreground">{h.humidity}%💧</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MiniStat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="glass-button rounded-2xl p-3 flex items-center gap-2 cursor-default">
    <span className="text-primary">{icon}</span>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-display font-medium text-foreground">{value}</p>
    </div>
  </div>
);

export default HistoricalWeather;
