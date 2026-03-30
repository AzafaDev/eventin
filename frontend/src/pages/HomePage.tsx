import { useEffect } from "react";
import EventDiscovery from "../components/home/EventDiscovery";
import HeroSection from "../components/home/HeroSection";
import { useEventStore } from "../stores/useEventStore";
import LoadingOverlay from "../components/LoadingOverlay";

const HomePage = () => {
  const {
    getAllEvents,
    category,
    location,
    searchQuery,
    currentEvents,
    currentPage,
    totalPages,
    totalEvents,
  } = useEventStore();
  useEffect(() => {
    getAllEvents({ category, location, searchQuery });
  }, []);
  if (!currentEvents) return <LoadingOverlay />;
  return (
    <div className="min-h-screen">
      <HeroSection />
      <EventDiscovery
        data={{ currentEvents, currentPage, totalPages, totalEvents }}
      />
    </div>
  );
};

export default HomePage;
