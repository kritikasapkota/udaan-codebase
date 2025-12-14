import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FlightCard from '../components/FlightCard';
import { Search, Calendar, MapPin, Sparkles, SlidersHorizontal } from 'lucide-react';

export default function Home() {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [search, setSearch] = useState({
    source: '',
    destination: '',
    date: ''
  });
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    airlines: [],
    sortBy: 'price-asc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Get unique airlines from flights
  const availableAirlines = [...new Set(flights.map(f => f.airline))];

  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, flights]);

  const applyFiltersAndSort = () => {
    let result = [...flights];

    // Filter by price range
    result = result.filter(
      f => f.currentPrice >= filters.priceRange[0] && f.currentPrice <= filters.priceRange[1]
    );

    // Filter by airlines
    if (filters.airlines.length > 0) {
      result = result.filter(f => filters.airlines.includes(f.airline));
    }

    // Sort
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.currentPrice - b.currentPrice);
        break;
      case 'price-desc':
        result.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'duration-asc':
        result.sort((a, b) => {
          const aDuration = parseInt(a.duration);
          const bDuration = parseInt(b.duration);
          return aDuration - bDuration;
        });
        break;
      case 'departure-asc':
        result.sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
        break;
      default:
        break;
    }

    setFilteredFlights(result);
  };

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.source) params.append('source', search.source);
      if (search.destination) params.append('destination', search.destination);
      if (search.date) params.append('date', search.date);

      const res = await api.get(`/flights?${params.toString()}`);
      setFlights(res.data);
      
      // Reset price range based on fetched flights
      if (res.data.length > 0) {
        const prices = res.data.map(f => f.currentPrice);
        setFilters(prev => ({
          ...prev,
          priceRange: [Math.min(...prices), Math.max(...prices)]
        }));
      }
    } catch (error) {
      console.error('Error fetching flights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setHasSearched(true);
    fetchFlights();
  };

  const handleBook = (flight) => {
    navigate(`/book/${flight._id}`, { state: { flight } });
  };

  const toggleAirline = (airline) => {
    setFilters(prev => ({
      ...prev,
      airlines: prev.airlines.includes(airline)
        ? prev.airlines.filter(a => a !== airline)
        : [...prev.airlines, airline]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(120deg, rgba(15,23,42,0.75) 0%, rgba(37,99,235,0.65) 45%, rgba(109,40,217,0.6) 100%), url('https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-20 text-white">
          <div className="max-w-3xl space-y-3 md:space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-semibold">
              <Sparkles className="h-4 w-4" /> Fly smarter. Pay faster.
            </div>
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold leading-tight">
              Book the right flight, every time.
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-blue-100 max-w-2xl">
              Transparent fares, wallet checkout, live availability, and sleek tickets with airline logos.
            </p>
          </div>

          {/* Search Widget */}
          <div className="bg-white rounded-lg md:rounded-2xl shadow-2xl p-4 md:p-6 mt-8 md:mt-12 max-w-5xl">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="From (e.g. Delhi)"
                  className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 text-sm md:text-base"
                  value={search.source}
                  onChange={(e) => setSearch({ ...search, source: e.target.value })}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="To (e.g. Mumbai)"
                  className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 text-sm md:text-base"
                  value={search.destination}
                  onChange={(e) => setSearch({ ...search, destination: e.target.value })}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 md:py-3 rounded-lg md:rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 text-sm md:text-base"
                  value={search.date}
                  onChange={(e) => setSearch({ ...search, date: e.target.value })}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-2.5 md:py-3 rounded-lg md:rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Search className="h-4 md:h-5 w-4 md:w-5" />
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16">
        {hasSearched && (
          <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 md:gap-4">
              <div>
                <p className="text-xs md:text-sm uppercase tracking-wide text-blue-600 font-semibold">Available Flights</p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Handpicked options for you</h2>
              </div>
              <div className="flex items-center gap-2 md:gap-4 flex-wrap w-full sm:w-auto">
                {filteredFlights.length > 0 && (
                  <div className="text-xs md:text-sm text-gray-500">
                    Showing {filteredFlights.length} flights
                  </div>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters & Sort
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && flights.length > 0 && (
              <div className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Sort By */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">Sort By</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                      className="w-full px-3 md:px-4 py-2 md:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm md:text-base"
                    >
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="duration-asc">Duration: Shortest First</option>
                      <option value="departure-asc">Departure: Earliest First</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">
                      Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={filters.priceRange[1]}
                        onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], parseInt(e.target.value)] })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Airlines Filter */}
                  <div>
                    <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">Airlines</label>
                    <div className="space-y-2 max-h-40 md:max-h-48 overflow-y-auto">
                      {availableAirlines.map((airline) => (
                        <label key={airline} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filters.airlines.includes(airline)}
                            onChange={() => toggleAirline(airline)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-xs md:text-sm text-gray-700">{airline}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {loading ? (
          <div className="flex justify-center py-12 md:py-20">
            <div className="animate-spin rounded-full h-10 md:h-12 w-10 md:w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : !hasSearched ? (
          <div className="relative overflow-hidden rounded-lg md:rounded-2xl bg-white shadow-sm border border-slate-100">
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1400&q=80')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            <div className="relative p-6 md:p-10 lg:p-14 text-center space-y-3 md:space-y-4">
              <p className="text-xs md:text-sm uppercase tracking-wide text-blue-600 font-semibold">Join thousands of happy travelers</p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">Search to see available flights</h3>
              <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                Trusted by satisfied customers. Enter your origin, destination, and date to start your journey.
              </p>
            </div>
          </div>
        ) : filteredFlights.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredFlights.map((flight) => (
              <FlightCard key={flight._id} flight={flight} onBook={handleBook} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 md:py-20 bg-white rounded-lg md:rounded-2xl shadow-sm">
            <p className="text-gray-700 text-base md:text-lg font-semibold mb-2">No flights found</p>
            <p className="text-gray-500 text-sm md:text-base">Try adjusting your filters or search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}