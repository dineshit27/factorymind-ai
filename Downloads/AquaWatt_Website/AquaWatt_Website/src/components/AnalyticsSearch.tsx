
import { useState } from "react";
import { Search, X, ArrowRight, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const searchSuggestions = [
  { id: 1, query: "Peak water usage times", icon: BarChart2 },
  { id: 2, query: "Compare electricity Q1 vs Q2", icon: BarChart2 },
  { id: 3, query: "Kitchen water consumption trend", icon: BarChart2 },
  { id: 4, query: "Night electricity usage", icon: BarChart2 },
  { id: 5, query: "Weekend vs weekday comparison", icon: BarChart2 },
];

export function AnalyticsSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState(searchSuggestions);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearch = (query: string) => {
    // Don't add empty searches or duplicates
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
    
    toast({
      title: "Search initiated",
      description: `Analyzing data for "${query}"`,
    });
    
    setOpen(false);
    setSearchTerm("");
    // In a real app, this would perform the actual search and update the charts
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Filter suggestions based on input
    if (value) {
      const filtered = searchSuggestions.filter(item => 
        item.query.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions(searchSuggestions);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSuggestions(searchSuggestions);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="whitespace-nowrap">
          <Search className="h-4 w-4 mr-2" />
          Advanced Search
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Advanced Analytics Search</DialogTitle>
          <DialogDescription>
            Search for specific patterns, trends or comparisons in your usage data
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search analytics data..."
              className="pl-8 pr-10"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm) {
                  handleSearch(searchTerm);
                }
              }}
            />
            {searchTerm && (
              <button 
                onClick={clearSearch}
                className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {searchTerm ? (
            suggestions.length > 0 ? (
              <div className="mt-2 space-y-1">
                {suggestions.map(item => (
                  <button
                    key={item.id}
                    className="w-full flex items-center gap-2 p-2 text-sm rounded-md hover:bg-accent text-left transition-colors"
                    onClick={() => handleSearch(item.query)}
                  >
                    <item.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{item.query}</span>
                    <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-2 p-2 text-sm text-muted-foreground">
                No matching suggestions. Press Enter to search anyway.
              </div>
            )
          ) : (
            <>
              {recentSearches.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Recent Searches</h4>
                  <div className="space-y-1">
                    {recentSearches.map((query, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center gap-2 p-2 text-sm rounded-md hover:bg-accent text-left transition-colors"
                        onClick={() => handleSearch(query)}
                      >
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span>{query}</span>
                        <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Suggested Searches</h4>
                <div className="space-y-1">
                  {searchSuggestions.map(item => (
                    <button
                      key={item.id}
                      className="w-full flex items-center gap-2 p-2 text-sm rounded-md hover:bg-accent text-left transition-colors"
                      onClick={() => handleSearch(item.query)}
                    >
                      <item.icon className="h-4 w-4 text-muted-foreground" />
                      <span>{item.query}</span>
                      <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
