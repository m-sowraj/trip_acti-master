import { ChevronLeft, ChevronRight, Search, Calendar } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast } from "react-toastify";

const BookingsManager = ({ bookings, setBookings }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token_partner_acti");
        const response = await fetch('https://fourtrip-server.onrender.com/api/managebooking', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setBookings(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle status update
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("token_partner_acti");
      const response = await fetch(`https://fourtrip-server.onrender.com/api/managebooking/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus === "new booking" ? true : newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        setBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === bookingId ? { ...booking, status: newStatus === "new booking" ? true : newStatus } : booking
          )
        );
        toast.success('Booking status updated successfully');
      } else {
        toast.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Error updating booking status');
    }
  };

  // Filter bookings based on search and date
  const filteredBookings = bookings.filter(booking => {
    if (booking.is_deleted) return false;
    
    const searchTerm = searchQuery.toLowerCase();
    const matchesSearch = (
      booking.createdBy?.business_name?.toLowerCase().includes(searchTerm) ||
      booking.createdBy?.phone_number?.includes(searchTerm) ||
      booking.createdBy?.email?.toLowerCase().includes(searchTerm) ||
      booking.activityId?.title?.toLowerCase().includes(searchTerm)
    );

    // Date filter
    if (selectedDate) {
      const bookingDate = new Date(booking.bookedTime).toISOString().split('T')[0];
      return matchesSearch && bookingDate === selectedDate;
    }

    return matchesSearch;
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status display class
  const getStatusClass = (status) => {
    if (status === true) return "text-blue-600 border-blue-200 bg-blue-50";
    if (status === "completed") return "text-green-600 border-green-200 bg-green-50";
    if (status === "cancelled") return "text-red-600 border-red-200 bg-red-50";
    return "text-gray-600 border-gray-200 bg-gray-50";
  };

    return (
    <div className="bg-white mt-2 rounded-lg shadow w-full px-6">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
          <div className="flex items-center w-full max-w-md">
            <div className="relative w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          </div>
        </div>
  
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white sticky top-0">
            <tr className="border-b">
              <th className="p-4 text-left">Booking ID</th>
              <th className="p-4 text-left">Customer Details</th>
              <th className="p-4 text-left">Activity</th>
              <th className="p-4 text-left">Total Members</th>
              <th className="p-4 text-left">Booked Time</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center py-4">Loading bookings...</td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">No bookings found</td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{booking._id.slice(-6)}</td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{booking.createdBy?.business_name}</div>
                      <div className="text-sm text-gray-500">{booking.createdBy?.email}</div>
                      <div className="text-sm text-gray-500">{booking.createdBy?.phone_number}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{booking.activityId?.title}</div>
                      <div className="text-sm text-gray-500">{booking.type}</div>
                    </div>
                  </td>
                  <td className="p-4">{booking.totalMembers}</td>
                  <td className="p-4">{formatDate(booking.bookedTime)}</td>
                <td className="p-4">
                    <select
                      value={booking.status === true ? "new booking" : booking.status}
                      onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                      className={`border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-blue-500 transition-colors ${getStatusClass(booking.status)}`}
                    >
                      <option value="new booking">New Booking</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && filteredBookings.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {selectedDate 
            ? `No bookings found for ${new Date(selectedDate).toLocaleDateString()}`
            : "No bookings found matching your search."}
        </div>
      )}
      </div>
    );
  };

export default BookingsManager;
