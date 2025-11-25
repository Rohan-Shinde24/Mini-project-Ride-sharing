import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Calendar, MapPin, Clock, User, Car, X, Phone, IndianRupee, Filter, SlidersHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';

const SearchRides = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    date: '',
    minSeats: '',
    sortBy: 'default'
  });
  
  // Modal state
  const [selectedRide, setSelectedRide] = useState(null);
  const [requestForm, setRequestForm] = useState({
    seats: 1,
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch user profile and auto-fill phone number
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/profile');
        if (res.data.phone) {
          setRequestForm(prev => ({ ...prev, phone: res.data.phone }));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const fetchRides = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      // Build query string
      const params = new URLSearchParams();
      if (filters.from) params.append('from', filters.from);
      if (filters.to) params.append('to', filters.to);
      if (filters.date) params.append('date', filters.date);

      const res = await axios.get(`/api/rides?${params.toString()}`);
      setRides(res.data);
      applyFilters(res.data);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rides', error);
      setLoading(false);
    }
  };

  // Apply client-side filters and sorting
  const applyFilters = (ridesToFilter) => {
    let filtered = [...ridesToFilter];

    // Filter by minimum seats
    if (filters.minSeats) {
      filtered = filtered.filter(ride => ride.seatsAvailable >= parseInt(filters.minSeats));
    }

    // Sort by price
    if (filters.sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilteredRides(filtered);
  };

  // Re-apply filters when filter options change
  React.useEffect(() => {
    if (rides.length > 0) {
      applyFilters(rides);
    }
  }, [filters.minSeats, filters.sortBy]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const openRequestModal = (ride) => {
    setSelectedRide(ride);
    // Preserve auto-filled phone number
    setRequestForm(prev => ({ ...prev, seats: 1 }));
  };

  const closeRequestModal = () => {
    setSelectedRide(null);
  };

  const clearFilters = () => {
    setFilters(prev => ({
      ...prev,
      minSeats: '',
      sortBy: 'default'
    }));
  };

  const handleRequestFormChange = (e) => {
    const { name, value } = e.target;
    setRequestForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!requestForm.phone || requestForm.phone.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }
    
    if (requestForm.seats < 1 || requestForm.seats > selectedRide.seatsAvailable) {
      alert(`Please select between 1 and ${selectedRide.seatsAvailable} seats`);
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('/api/requests', { 
        rideId: selectedRide._id,
        seats: requestForm.seats,
        phone: requestForm.phone
      });
      alert('Seat requested successfully! Check your dashboard for updates.');
      closeRequestModal();
      // Refresh rides to update available seats
      fetchRides();
    } catch (error) {
      alert(error.response?.data || 'Failed to request seat. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const totalCost = selectedRide ? selectedRide.price * requestForm.seats : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Search Bar */}
      <Card className="sticky top-20 z-10 shadow-lg border-emerald-100/50 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                name="from"
                placeholder="From (e.g. Mumbai)" 
                className="pl-9"
                value={filters.from}
                onChange={handleInputChange}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                name="to"
                placeholder="To (e.g. Pune)" 
                className="pl-9"
                value={filters.to}
                onChange={handleInputChange}
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                name="date"
                type="date" 
                className="pl-9"
                value={filters.date}
                onChange={handleInputChange}
              />
            </div>
            <Button onClick={fetchRides} className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {/* Filter Controls */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-emerald-600 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              {(filters.minSeats || filters.sortBy !== 'default') && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Minimum Seats</label>
                  <select
                    name="minSeats"
                    value={filters.minSeats}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Any</option>
                    <option value="1">1+ seats</option>
                    <option value="2">2+ seats</option>
                    <option value="3">3+ seats</option>
                    <option value="4">4+ seats</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Sort by Price</label>
                  <select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      {hasSearched && !loading && filteredRides.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-600">
          <p>Found {filteredRides.length} ride{filteredRides.length !== 1 ? 's' : ''}</p>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
            <p className="mt-2 text-slate-500">Finding best rides...</p>
          </div>
        ) : filteredRides.length > 0 ? (
          filteredRides.map(ride => (
            <Card key={ride._id} className="hover:shadow-md transition-shadow border-slate-200 cursor-pointer" onClick={() => openRequestModal(ride)}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-3 text-lg font-semibold text-slate-900">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">{ride.from}</span>
                      <span className="text-slate-400">→</span>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm">{ride.to}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center bg-slate-50 px-2 py-1 rounded">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" />
                        {new Date(ride.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center bg-slate-50 px-2 py-1 rounded">
                        <Clock className="h-4 w-4 mr-2 text-slate-400" />
                        {ride.time}
                      </div>
                      <div className="flex items-center bg-slate-50 px-2 py-1 rounded">
                        <User className="h-4 w-4 mr-2 text-slate-400" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (ride.host?._id) {
                              navigate(`/profile/${ride.host._id}`);
                            }
                          }}
                          className="hover:text-emerald-600 hover:underline transition-colors"
                        >
                          {ride.host?.name || ride.driver?.name || 'Driver'}
                        </button>
                      </div>
                      <div className="flex items-center bg-emerald-50 px-2 py-1 rounded">
                        <Car className="h-4 w-4 mr-2 text-emerald-600" />
                        <span className="font-medium text-emerald-700">{ride.seatsAvailable} seats available</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col items-center md:items-end gap-4 w-full md:w-auto justify-between border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                    <div className="text-2xl font-bold text-emerald-600">
                      ₹{ride.price}<span className="text-sm text-slate-500">/seat</span>
                    </div>
                    <Button onClick={(e) => { e.stopPropagation(); openRequestModal(ride); }} size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            {hasSearched ? (
              <>
                <Search className="h-16 w-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No rides found</h3>
                <p className="text-slate-500 mt-1">Try changing your search criteria or dates!</p>
              </>
            ) : (
              <>
                <Car className="h-16 w-16 text-emerald-200 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">Find your perfect ride</h3>
                <p className="text-slate-500 mt-1">Enter your route and date to see available carpools.</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {selectedRide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeRequestModal}>
          <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Request Seat</h2>
              <button onClick={closeRequestModal} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Ride Details */}
            <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Route</span>
                <span className="font-medium text-slate-900">{selectedRide.from} → {selectedRide.to}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Date & Time</span>
                <span className="font-medium text-slate-900">
                  {new Date(selectedRide.date).toLocaleDateString()} at {selectedRide.time}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Driver</span>
                <span className="font-medium text-slate-900">{selectedRide.host?.name || 'Driver'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Available Seats</span>
                <span className="font-medium text-emerald-600">{selectedRide.seatsAvailable} seats</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Price per Seat</span>
                <span className="font-medium text-slate-900">₹{selectedRide.price}</span>
              </div>
            </div>

            {/* Request Form */}
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Number of Seats
                </label>
                <Input
                  type="number"
                  name="seats"
                  min="1"
                  max={selectedRide.seatsAvailable}
                  value={requestForm.seats}
                  onChange={handleRequestFormChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="tel"
                    name="phone"
                    placeholder="10-digit mobile number"
                    className="pl-9"
                    value={requestForm.phone}
                    onChange={handleRequestFormChange}
                    pattern="[0-9]{10}"
                    maxLength="10"
                    required
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">Driver will contact you on this number</p>
              </div>

              {/* Total Cost */}
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-900">Total Cost</span>
                  <div className="flex items-center text-2xl font-bold text-emerald-600">
                    <IndianRupee className="h-5 w-5" />
                    {totalCost}
                  </div>
                </div>
                <p className="text-xs text-emerald-700 mt-1">
                  {requestForm.seats} seat(s) × ₹{selectedRide.price}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={closeRequestModal}
                  className="flex-1 bg-slate-200 text-slate-700 hover:bg-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  isLoading={submitting}
                >
                  Request Seat
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchRides;
