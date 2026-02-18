const API_KEY = "efkjajnf24234qrasmfcq3t5w4t5";
const BASE_URL = "https://api.weatherstack.com";

export interface WeatherLocation {
  name: string;
  country: string;
  region: string;
  lat: string;
  lon: string;
  localtime: string;
}

export interface CurrentWeather {
  temperature: number;
  weather_descriptions: string[];
  weather_icons: string[];
  wind_speed: number;
  wind_dir: string;
  pressure: number;
  precip: number;
  humidity: number;
  cloudcover: number;
  feelslike: number;
  uv_index: number;
  visibility: number;
  observation_time: string;
}

export interface CurrentWeatherResponse {
  request: { type: string; query: string; language: string; unit: string };
  location: WeatherLocation;
  current: CurrentWeather;
  error?: { code: number; type: string; info: string };
}

export interface HistoricalWeatherResponse {
  request: { type: string; query: string; language: string; unit: string };
  location: WeatherLocation;
  historical: Record<string, {
    date: string;
    date_epoch: number;
    astro: {
      sunrise: string;
      sunset: string;
      moonrise: string;
      moonset: string;
      moon_phase: string;
      moon_illumination: number;
    };
    mintemp: number;
    maxtemp: number;
    avgtemp: number;
    totalsnow: number;
    sunhour: number;
    uv_index: number;
    hourly: Array<{
      time: string;
      temperature: number;
      wind_speed: number;
      weather_descriptions: string[];
      weather_icons: string[];
      humidity: number;
      precip: number;
    }>;
  }>;
  error?: { code: number; type: string; info: string };
}

export interface MarineWeatherResponse {
  request: { type: string; query: string };
  nearest_area: Array<{
    latitude: string;
    longitude: string;
    region: Array<{ value: string }>;
    country: Array<{ value: string }>;
  }>;
  weather: Array<{
    date: string;
    maxtempC: string;
    mintempC: string;
    hourly: Array<{
      time: string;
      tempC: string;
      waterTemp_C: string;
      windspeedKmph: string;
      winddir16Point: string;
      weatherDesc: Array<{ value: string }>;
      swellHeight_m: string;
      swellDir: string;
      swellDir16Point: string;
      swellPeriod_secs: string;
      sigHeight_m: string;
      visibility: string;
    }>;
  }>;
  error?: { code: number; type: string; info: string };
}

export async function fetchCurrentWeather(location: string): Promise<CurrentWeatherResponse> {
  const res = await fetch(`${BASE_URL}/current?access_key=${API_KEY}&query=${encodeURIComponent(location)}&units=m`);
  if (!res.ok) throw new Error("Failed to fetch current weather");
  const data = await res.json();
  if (data.error) throw new Error(data.error.info);
  return data;
}

export async function fetchHistoricalWeather(location: string, date: string): Promise<HistoricalWeatherResponse> {
  const res = await fetch(`${BASE_URL}/historical?access_key=${API_KEY}&query=${encodeURIComponent(location)}&historical_date=${date}&hourly=1&units=m`);
  if (!res.ok) throw new Error("Failed to fetch historical weather");
  const data = await res.json();
  if (data.error) throw new Error(data.error.info);
  return data;
}

export async function fetchMarineWeather(lat: string, lon: string): Promise<MarineWeatherResponse> {
  const res = await fetch(`${BASE_URL}/marine?access_key=${API_KEY}&query=${lat},${lon}&units=m`);
  if (!res.ok) throw new Error("Failed to fetch marine weather");
  const data = await res.json();
  if (data.error) throw new Error(data.error.info);
  return data;
}
