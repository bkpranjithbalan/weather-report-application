import { Search, MapPin } from "lucide-react";
import { useState, type FormEvent } from "react";

interface LocationSearchProps {
  onSearch: (location: string) => void;
  placeholder?: string;
  isLoading?: boolean;
}

const LocationSearch = ({ onSearch, placeholder = "Search city, zip code, or IP...", isLoading }: LocationSearchProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  const handleUseMyLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onSearch(`${latitude},${longitude}`);
        },
        () => {
          onSearch("fetch:ip");
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
      <div className="glass-input rounded-2xl flex items-center px-5 py-3.5 gap-3">
        <Search className="w-5 h-5 text-muted-foreground shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none w-full text-foreground placeholder:text-muted-foreground font-body text-sm"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={isLoading}
          className="glass-button rounded-xl p-2 text-muted-foreground hover:text-primary shrink-0 disabled:opacity-40"
          title="Use my location"
        >
          <MapPin className="w-4 h-4" />
        </button>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="glass-button-primary text-foreground px-5 py-2 rounded-xl text-sm font-medium disabled:opacity-40 shrink-0"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
              ...
            </span>
          ) : "Go"}
        </button>
      </div>
    </form>
  );
};

export default LocationSearch;
