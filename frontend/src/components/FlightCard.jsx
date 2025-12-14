import React from "react";
import { Plane, ArrowRight, Clock3, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FlightCard({ flight }) {
  const navigate = useNavigate();

  const sanitizeAirline = (name) =>
    (name || "").replace(/[^a-z0-9-_]/gi, "_").toLowerCase();

  const logoName = sanitizeAirline(flight.airline);
  const primaryLogo = `/logos/${logoName}.png`; // frontend/public/logos
  const fallbackLogo = `http://localhost:5000/logos/${logoName}.png`; // backend static

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group h-full flex flex-col">
      <div className="p-4 md:p-6 pb-3 md:pb-4 flex-1 flex flex-col gap-3 md:gap-4">
        <div className="flex justify-between items-start mb-2 md:mb-4 gap-2 md:gap-3">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform flex-shrink-0">
              {flight.airline ? (
                <img
                  alt={flight.airline}
                  src={primaryLogo}
                  className="h-6 md:h-8 w-6 md:w-8 object-contain"
                  data-fallback="false"
                  onError={(e) => {
                    if (e.currentTarget.dataset.fallback === "false") {
                      e.currentTarget.src = fallbackLogo;
                      e.currentTarget.dataset.fallback = "true";
                    } else {
                      e.currentTarget.style.display = "none";
                    }
                  }}
                />
              ) : (
                <Plane className="h-5 md:h-6 w-5 md:w-6 text-blue-600" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-base md:text-lg text-gray-900 truncate">
                {flight.airline}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 truncate">
                {flight.flightId || flight.flightNumber}
              </p>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <p className="text-xl md:text-2xl font-bold text-blue-600">
              ₹{flight.basePrice || flight.currentPrice}
            </p>
            <p className="text-xs text-gray-500">
              per person
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-gray-50 p-3 md:p-4 rounded-lg md:rounded-xl gap-2 md:gap-3">
          <div className="flex items-start md:items-center gap-2 md:gap-3 flex-1 min-w-0">
            <MapPin className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1 md:mt-0" />
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-500">From</p>
              <p className="text-sm md:text-base font-semibold text-gray-900 truncate">{flight.source}</p>
              <p className="text-xs text-gray-500">
                {new Date(flight.departureTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          <div className="hidden md:block text-center px-4">
            <p className="text-xs text-gray-400 mb-1">{flight.duration}</p>
            <div className="w-20 h-0.5 bg-gray-300 mx-auto relative">
              <Plane className="h-4 w-4 text-blue-500 absolute -top-2 left-1/2 -translate-x-1/2 rotate-90" />
            </div>
          </div>

          <div className="flex items-start md:items-center gap-2 md:gap-3 text-right flex-1 min-w-0">
            <div className="min-w-0">
              <p className="text-xs md:text-sm text-gray-500">To</p>
              <p className="text-sm md:text-base font-semibold text-gray-900 truncate">{flight.destination}</p>
              <p className="text-xs text-gray-500">
                {new Date(flight.arrivalTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
            <Clock3 className="h-4 w-4 text-blue-600 flex-shrink-0" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 md:pt-3">
          <div className="text-xs md:text-sm text-gray-600">
            <span
              className={`font-bold ${
                flight.seatsAvailable < 10
                  ? "text-red-500"
                  : "text-green-600"
              }`}
            >
              {flight.seatsAvailable}
            </span>{" "}
            seats left
          </div>

          <button
            onClick={() => navigate(`/book/${flight._id}`)}
            className="w-full sm:w-auto px-4 md:px-6 py-2 md:py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium text-sm md:text-base hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center md:justify-start gap-2"
          >
            Book Now <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
