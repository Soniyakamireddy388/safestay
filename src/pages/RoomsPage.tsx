import React, { useState, useEffect } from 'react';
import { roomService } from '../services/apiServices';
import { Room } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import {
  BedDouble,
  Search,
  Filter,
  Check,
  Building,
  Layers,
  Sparkles,
  Wifi,
  Wind,
  Bath,
  BookOpen,
  Calendar,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

export const RoomsPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Booking Modal
  const [bookingRoom, setBookingRoom] = useState<Room | null>(null);
  const [selectedBed, setSelectedBed] = useState<number>(1);
  const [startDate, setStartDate] = useState<string>('2026-09-01');
  const [endDate, setEndDate] = useState<string>('2027-05-31');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const loadRooms = async () => {
    try {
      const data = await roomService.getRooms();
      setRooms(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  useEffect(() => {
    let result = rooms;

    if (selectedBlock !== 'ALL') {
      result = result.filter((r) => r.block === selectedBlock);
    }
    if (selectedType !== 'ALL') {
      result = result.filter((r) => r.roomType === selectedType);
    }
    if (selectedStatus !== 'ALL') {
      result = result.filter((r) => r.status === selectedStatus);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.roomNumber.toLowerCase().includes(q) ||
          r.block.toLowerCase().includes(q) ||
          r.roomType.toLowerCase().includes(q)
      );
    }

    setFilteredRooms(result);
  }, [rooms, selectedBlock, selectedType, selectedStatus, searchQuery]);

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRoom) return;
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await roomService.bookRoom({
        roomId: bookingRoom.id,
        roomNumber: bookingRoom.roomNumber,
        studentId: user?.studentId || 'STU-2024-089',
        studentName: user?.name || 'Rahul Sharma',
        bedNumber: selectedBed,
        startDate,
        endDate,
      });

      showToast(
        'Room Booked Successfully',
        `You have been allocated Room ${bookingRoom.roomNumber} (Bed ${selectedBed}).`,
        'success'
      );
      setBookingRoom(null);
      loadRooms();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Booking could not be confirmed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            Hostel Rooms & Bed Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse available single, double, and triple sharing rooms across Block A & Block B with double-booking prevention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            Total Inventory: {rooms.length} Rooms
          </span>
        </div>
      </div>

      {/* Filter Bar (Section 14) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by room (e.g. A-101, B-201, AC)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs font-medium focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Block filter */}
          <select
            value={selectedBlock}
            onChange={(e) => setSelectedBlock(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Blocks</option>
            <option value="Block A">Block A</option>
            <option value="Block B">Block B</option>
          </select>

          {/* Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Room Types</option>
            <option value="Single (AC)">Single (AC)</option>
            <option value="Single (Non-AC)">Single (Non-AC)</option>
            <option value="Double Sharing (AC)">Double Sharing (AC)</option>
            <option value="Double Sharing (Non-AC)">Double Sharing (Non-AC)</option>
            <option value="Triple Sharing">Triple Sharing</option>
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Availability</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Rooms Grid (Section 14) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Room Image */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={room.image}
                  alt={room.roomNumber}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold font-mono">
                    {room.block} • {room.roomNumber}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge status={room.status} />
                </div>
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-slate-900 font-extrabold text-sm shadow-xs font-['Outfit',sans-serif]">
                  ₹{room.pricePerMonth.toLocaleString('en-IN')}{' '}
                  <span className="text-[10px] text-slate-500 font-normal">/mo</span>
                </div>
              </div>

              {/* Room Details */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                    {room.roomType}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Floor {room.floor}</span>
                </div>

                {/* Bed Inventory */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Bed Inventory:</span>
                  <span className="font-bold text-slate-900">
                    {room.availableBeds} of {room.totalBeds} Beds Available
                  </span>
                </div>

                {/* Amenities Pills (Section 14) */}
                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                  {room.amenities.map((amenity, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200/60 font-medium flex items-center gap-1"
                    >
                      <Check className="w-2.5 h-2.5 text-teal-600" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Booking Button */}
            <div className="p-5 pt-0">
              <button
                disabled={room.status !== 'AVAILABLE'}
                onClick={() => {
                  setBookingRoom(room);
                  setErrorMsg('');
                }}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  room.status === 'AVAILABLE'
                    ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
              >
                {room.status === 'AVAILABLE' ? 'Book Bed in this Room' : 'Room Fully Occupied'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Room Booking Modal with Double-Booking Validation (Section 14 & 41) */}
      {bookingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">
                  Hostel Allocation Service
                </span>
                <h3 className="text-xl font-bold font-['Outfit',sans-serif]">
                  Reserve Room {bookingRoom.roomNumber} ({bookingRoom.block})
                </h3>
              </div>
              <button
                onClick={() => setBookingRoom(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="p-6 space-y-4 text-xs">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Student Identity */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Applicant:</span>
                  <span className="font-bold text-slate-900">{user?.name || 'Rahul Sharma'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Student ID:</span>
                  <span className="font-mono text-slate-900">{user?.studentId || 'STU-2024-089'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Rent:</span>
                  <span className="font-bold text-slate-900">
                    ₹{bookingRoom.pricePerMonth.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Bed Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Bed Number:</label>
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: bookingRoom.totalBeds }).map((_, idx) => {
                    const bedNum = idx + 1;
                    return (
                      <button
                        key={bedNum}
                        type="button"
                        onClick={() => setSelectedBed(bedNum)}
                        className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                          selectedBed === bedNum
                            ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        Bed {bedNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Check-In Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Check-Out Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-[11px]">
                <strong>Double-Booking Prevention Guard:</strong> SafeStay guarantees this bed will be atomically
                locked in state, preventing concurrent duplicate allocation across multiple sessions.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBookingRoom(null)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-md transition-all flex items-center gap-2"
                >
                  {isSubmitting ? 'Confirming with Database...' : 'Confirm Room Allocation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
