import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CarFilters } from "@/components/cars/CarFilters";
import { CarGrid } from "@/components/cars/CarGrid";
import { useCars } from "@/hooks/useCars";
import { useLanguage } from "@/contexts/LanguageContext";

const CarsPage = () => {
  const { t } = useLanguage();
  const {
    cars,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedBodyStyle,
    setSelectedBodyStyle,
    selectedDrivetrain,
    setSelectedDrivetrain,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy
  } = useCars();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container py-8 px-4 mx-auto flex-grow pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t('cars.title')}</h1>
          <p className="text-muted-foreground">
            {t('cars.subtitle')}
          </p>
        </div>

        <CarFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedBodyStyle={selectedBodyStyle}
          setSelectedBodyStyle={setSelectedBodyStyle}
          selectedDrivetrain={selectedDrivetrain}
          setSelectedDrivetrain={setSelectedDrivetrain}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <CarGrid cars={cars} loading={loading} error={error} />
      </div>
      <Footer />
    </div>
  );
};

export default CarsPage;
