
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { PartCard } from "@/components/parts/PartCard";
import PartsFilters from "@/components/parts/PartsFilters";
import PartsSearch from "@/components/parts/PartsSearch";
import { useParts } from "@/hooks/useParts";

const PartsPage = () => {
  const { t } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 50000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [conditions, setConditions] = useState<Record<string, boolean>>({});
  const [carMakes, setCarMakes] = useState<Record<string, boolean>>({});
  const { isAuthenticated } = useAuth();
  const { parts, loading } = useParts();

  console.log("Parts in PartsPage:", parts);

  const handleConditionChange = (condition: string, checked: boolean) => {
    setConditions((prev) => ({
      ...prev,
      [condition]: checked,
    }));
  };

  const handleCarMakeChange = (make: string, checked: boolean) => {
    setCarMakes((prev) => ({
      ...prev,
      [make]: checked,
    }));
  };

  const applyFilters = () => {
    toast({
      title: "Filters applied",
      description: "Your filters have been applied"
    });
  };
  
  const resetFilters = () => {
    setPriceRange([0, 50000]);
    setConditions({});
    setCarMakes({});
    setSearchQuery("");
    setSortBy("newest");
  };

  const filteredParts = parts.filter((part) => {
    // Filter by search query
    if (searchQuery && !part.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by price range
    if (part.price < priceRange[0] || part.price > priceRange[1]) {
      return false;
    }
    
    // Filter by condition
    const activeConditions = Object.entries(conditions)
      .filter(([_, isChecked]) => isChecked)
      .map(([condition]) => condition);
      
    if (activeConditions.length > 0 && !activeConditions.includes(part.condition)) {
      return false;
    }

    // Filter by car make
    const activeCarMakes = Object.entries(carMakes)
      .filter(([_, isChecked]) => isChecked)
      .map(([make]) => make);
      
    if (activeCarMakes.length > 0) {
      const partCompatibleCars = part.compatible_cars || [];
      const hasMatchingMake = activeCarMakes.some(make => 
        partCompatibleCars.some(car => car.toLowerCase().includes(make))
      );
      if (!hasMatchingMake) {
        return false;
      }
    }
    
    return true;
  });

  // Sort the filtered parts
  const sortedParts = [...filteredParts].sort((a, b) => {
    switch (sortBy) {
      case "priceLowHigh":
        return a.price - b.price;
      case "priceHighLow":
        return b.price - a.price;
      case "newest":
      default:
        return 0;
    }
  });

  console.log("Filtered parts:", filteredParts);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-display font-bold">{t('parts.title')}</h1>
            
            <div className="flex gap-2">
              {isAuthenticated && (
                <Button asChild className="flex items-center gap-2">
                  <Link to="/parts/create">
                    <Plus size={16} />
                    {t('parts.listPart')}
                  </Link>
                </Button>
              )}
              
              <div className="md:hidden">
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal size={16} />
                  {t('parts.filters')}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <PartsFilters
              showFilters={showFilters}
              setShowFilters={setShowFilters}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              conditions={conditions}
              handleConditionChange={handleConditionChange}
              carMakes={carMakes}
              handleCarMakeChange={handleCarMakeChange}
              applyFilters={applyFilters}
              resetFilters={resetFilters}
            />
            
            {/* Main content */}
            <div className="flex-1">
              <PartsSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Loading parts...</p>
                </div>
              ) : sortedParts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedParts.map((part) => (
                    <PartCard key={part.id} part={part} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">{t('parts.noPartsFound')}</h3>
                  <p className="text-muted-foreground">{t('parts.adjustFilters')}</p>
                  {parts.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Found {parts.length} total parts, but they were filtered out.
                    </p>
                  )}
                </div>
              )}
              
              {/* Pagination */}
              {sortedParts.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center gap-1">
                    <Button variant="outline" size="icon" disabled>
                      &lt;
                    </Button>
                    <Button variant="outline" size="icon" className="bg-primary text-primary-foreground">
                      1
                    </Button>
                    <Button variant="outline" size="icon">
                      &gt;
                    </Button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PartsPage;
