import { Search } from "lucide-react";
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

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <div className="glass rounded-full flex items-center px-5 py-3 gap-3 transition-all focus-within:border-primary/40">
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
          type="submit"
          disabled={isLoading || !query.trim()}
          className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
        >
          {isLoading ? "..." : "Go"}
        </button>
      </div>
    </form>
  );
};

export default LocationSearch;
