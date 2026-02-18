import { useState } from "react";
import { Anchor, Waves, Wind, Thermometer, Eye, Navigation } from "lucide-react";
import { fetchMarineWeather, type MarineWeatherResponse } from "@/lib/weatherApi";

const MarineWeather = () => {
  const [data, setData] = useState<MarineWeatherResponse | null>(null);
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!lat || !lon) return;
    setIsLoading(true);
    setError("");
    try {
      const result = await fetchMarineWeather(lat, lon);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to fetch marine weather");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const area = data?.nearest_area?.[0];
  const weather = data?.weather?.[0];

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="glass rounded-full flex items-center px-5 py-3 gap-3">
          <Navigation className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude (e.g. 40.71)"
            className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground font-body text-sm"
          />
        </div>
        <div className="glass rounded-full flex items-center px-5 py-3 gap-3">
          <Anchor className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
            placeholder="Longitude (e.g. -74.01)"
            className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground font-body text-sm"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading || !lat || !lon}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {isLoading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && (
        <div className="glass rounded-xl p-4 border-destructive/30">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {weather && (
        <div className="space-y-4">
          {area && (
            <p className="text-muted-foreground text-sm">
              Nearest area: {area.region?.[0]?.value}, {area.country?.[0]?.value} ({area.latitude}°, {area.longitude}°)
            </p>
          )}

          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Waves className="w-5 h-5 text-primary" />
              <h3 className="text-sm font-display font-semibold text-foreground uppercase tracking-wide">
                Marine Conditions — {weather.date}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Min Temp</p>
                <p className="text-2xl font-display font-bold text-temp-cold">{weather.mintempC}°C</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Max Temp</p>
                <p className="text-2xl font-display font-bold text-temp-warm">{weather.maxtempC}°C</p>
              </div>
            </div>
          </div>

          {/* Hourly marine data */}
          {weather.hourly && weather.hourly.length > 0 && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-display font-semibold text-foreground mb-4 uppercase tracking-wide">
                Hourly Marine Data
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {weather.hourly.map((h, i) => (
                  <div key={i} className="glass-subtle rounded-xl p-4 min-w-[140px] flex flex-col gap-2 shrink-0">
                    <span className="text-xs text-muted-foreground font-medium">
                      {String(parseInt(h.time) / 100).padStart(2, '0')}:00
                    </span>
                    <p className="text-xs text-muted-foreground">{h.weatherDesc?.[0]?.value}</p>
                    <div className="space-y-1">
                      <Row icon={<Thermometer className="w-3 h-3" />} label="Air" value={`${h.tempC}°C`} />
                      <Row icon={<Waves className="w-3 h-3" />} label="Water" value={`${h.waterTemp_C}°C`} />
                      <Row icon={<Wind className="w-3 h-3" />} label="Wind" value={`${h.windspeedKmph} km/h ${h.winddir16Point}`} />
                      <Row icon={<Waves className="w-3 h-3" />} label="Swell" value={`${h.swellHeight_m}m`} />
                      <Row icon={<Eye className="w-3 h-3" />} label="Vis" value={`${h.visibility} km`} />
                    </div>
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

const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-1.5 text-xs">
    <span className="text-primary">{icon}</span>
    <span className="text-muted-foreground">{label}:</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
);

export default MarineWeather;
