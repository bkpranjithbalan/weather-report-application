import { Droplets, Wind, Eye, Thermometer, CloudRain, Sun, Gauge } from "lucide-react";
import type { CurrentWeatherResponse } from "@/lib/weatherApi";

interface CurrentWeatherCardProps {
  data: CurrentWeatherResponse;
}

const CurrentWeatherCard = ({ data }: CurrentWeatherCardProps) => {
  const { location, current } = data;

  return (
    <div className="animate-fade-up">
      {/* Main temperature card */}
      <div className="glass-strong rounded-2xl p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex flex-col items-center md:items-start">
            <p className="text-muted-foreground text-sm font-body">
              {location.name}, {location.region}
            </p>
            <p className="text-muted-foreground text-xs mb-2">{location.country}</p>
            <div className="flex items-start gap-1">
              <span className="text-7xl md:text-8xl font-display font-bold text-foreground text-glow">
                {current.temperature}
              </span>
              <span className="text-2xl font-display text-primary mt-2">°C</span>
            </div>
            <p className="text-lg text-muted-foreground mt-1">
              Feels like <span className="text-foreground font-medium">{current.feelslike}°C</span>
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end md:ml-auto gap-2">
            {current.weather_icons?.[0] && (
              <img src={current.weather_icons[0]} alt="" className="w-16 h-16 animate-float" />
            )}
            <p className="text-lg font-display font-medium text-foreground">
              {current.weather_descriptions?.[0]}
            </p>
            <p className="text-xs text-muted-foreground">
              Observed at {current.observation_time} • {location.localtime}
            </p>
          </div>
        </div>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <DetailCard icon={<Wind className="w-4 h-4" />} label="Wind" value={`${current.wind_speed} km/h ${current.wind_dir}`} />
        <DetailCard icon={<Droplets className="w-4 h-4" />} label="Humidity" value={`${current.humidity}%`} />
        <DetailCard icon={<Gauge className="w-4 h-4" />} label="Pressure" value={`${current.pressure} mb`} />
        <DetailCard icon={<CloudRain className="w-4 h-4" />} label="Precipitation" value={`${current.precip} mm`} />
        <DetailCard icon={<Eye className="w-4 h-4" />} label="Visibility" value={`${current.visibility} km`} />
        <DetailCard icon={<Sun className="w-4 h-4" />} label="UV Index" value={`${current.uv_index}`} />
        <DetailCard icon={<Thermometer className="w-4 h-4" />} label="Cloud Cover" value={`${current.cloudcover}%`} />
      </div>
    </div>
  );
};

const DetailCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="glass rounded-xl p-4 flex flex-col gap-2">
    <div className="flex items-center gap-2 text-primary">
      {icon}
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
    </div>
    <span className="text-base font-display font-semibold text-foreground">{value}</span>
  </div>
);

export default CurrentWeatherCard;
