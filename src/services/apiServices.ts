import { StorageEngine } from './storageEngine';
import {
  User,
  Room,
  Booking,
  Payment,
  Complaint,
  MaintenanceRequest,
  AttendanceRecord,
  DailyFoodMenu,
  LaundryRecord,
  Announcement,
  EmergencyAlert,
  AiDetectionLog,
  CctvCamera,
  AuditLog,
  NotificationItem,
  SystemStatus,
  UserRole,
  ComplaintStatus,
  ComplaintCategory,
  AlertStatus,
  BookingStatus,
  StudentProfile,
  FoodMenuItem,
} from '../types';

// Helper for simulated network delay to make UI feel realistic
const delay = (ms: number = 80) => new Promise((resolve) => setTimeout(resolve, ms));

/* -------------------------------------------------------------------------- */
/*                               AUTH SERVICE                                 */
/* -------------------------------------------------------------------------- */
export const authService = {
  async login(email: string, role?: UserRole): Promise<{ user: User; token: string }> {
    await delay();
    const users = StorageEngine.getUsers();
    const cleanEmail = email.trim().toLowerCase();

    let user = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user && role) {
      user = users.find((u) => u.role === role);
    }
    if (!user) {
      // Default demo fallback to Soniya Kamireddy
      user = users[0];
    }

    if (user.approvalStatus === 'PENDING') {
      throw new Error('Your registration is pending approval by Super Administrator Soniya Kamireddy.');
    }
    if (user.approvalStatus === 'REJECTED') {
      throw new Error('Your registration was declined. Please contact the hostel administration.');
    }

    const token = `safestay_jwt_${user.id}_${Date.now()}`;
    StorageEngine.setCurrentUser(user);
    StorageEngine.addAuditLog('USER_LOGIN', 'Authentication', `User ${user.name} (${user.role}) logged in successfully.`, user);

    return { user, token };
  },

  async register(data: Partial<User>): Promise<User> {
    await delay();
    const users = StorageEngine.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === (data.email || '').toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: data.name || 'New User',
      email: data.email || `user${Date.now()}@safestay.in`,
      phone: data.phone || '+91 99999 00000',
      role: data.role || 'STUDENT',
      approvalStatus: 'PENDING', // All registrations initially require Admin approval
      createdAt: new Date().toISOString(),
      studentId: data.studentId,
      wardId: data.wardId,
      hostelBlock: data.hostelBlock || 'Block A',
      roomNumber: data.roomNumber || 'A-101',
    };

    StorageEngine.setUsers([newUser, ...users]);
    StorageEngine.addAuditLog('USER_REGISTRATION', 'Registration', `New ${newUser.role} registration submitted by ${newUser.name}. Marked PENDING.`);

    // Add notification for Admin
    notificationService.sendNotification({
      userId: 'user-admin-1',
      title: 'New Registration Pending Approval',
      message: `${newUser.name} (${newUser.role}) has registered and is waiting for your review.`,
      category: 'Booking',
      severity: 'info',
      actionUrl: '/users',
    });

    return newUser;
  },

  getCurrentUser(): User {
    return StorageEngine.getCurrentUser();
  },

  setCurrentUser(user: User): void {
    StorageEngine.setCurrentUser(user);
  },

  logout(): void {
    const user = StorageEngine.getCurrentUser();
    if (user) {
      StorageEngine.addAuditLog('USER_LOGOUT', 'Authentication', `User ${user.name} logged out.`, user);
    }
    localStorage.removeItem('safestay_token');
  },

  // Instant switch for live B.Tech presentation demo flow
  async switchDemoRole(role: UserRole): Promise<User> {
    await delay(30);
    const users = StorageEngine.getUsers();
    let target = users.find((u) => u.role === role && u.approvalStatus === 'APPROVED');
    if (!target) {
      target = users[0];
    }
    StorageEngine.setCurrentUser(target);
    StorageEngine.addAuditLog('DEMO_ROLE_SWITCH', 'Demo Mode', `Switched active preview role to ${target.name} (${target.role})`, target);
    return target;
  },
};

/* -------------------------------------------------------------------------- */
/*                               ROOM SERVICE                                 */
/* -------------------------------------------------------------------------- */
export const roomService = {
  async getRooms(filters?: {
    search?: string;
    roomType?: string;
    floor?: number;
    status?: string;
    hostelBlock?: string;
    maxPrice?: number;
  }): Promise<Room[]> {
    await delay();
    let rooms = StorageEngine.getRooms();

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        rooms = rooms.filter(
          (r) =>
            r.roomNumber.toLowerCase().includes(q) ||
            r.hostelBlock.toLowerCase().includes(q) ||
            r.facilities.some((f) => f.toLowerCase().includes(q))
        );
      }
      if (filters.roomType && filters.roomType !== 'ALL') {
        rooms = rooms.filter((r) => r.roomType === filters.roomType);
      }
      if (filters.floor && filters.floor !== 0) {
        rooms = rooms.filter((r) => r.floor === filters.floor);
      }
      if (filters.status && filters.status !== 'ALL') {
        rooms = rooms.filter((r) => r.status === filters.status);
      }
      if (filters.hostelBlock && filters.hostelBlock !== 'ALL') {
        rooms = rooms.filter((r) => r.hostelBlock === filters.hostelBlock);
      }
      if (filters.maxPrice) {
        rooms = rooms.filter((r) => r.pricePerMonth <= filters.maxPrice!);
      }
    }
    return rooms;
  },

  async getRoomById(id: string): Promise<Room | undefined> {
    await delay();
    return StorageEngine.getRooms().find((r) => r.id === id);
  },

  async createRoom(roomData: Omit<Room, 'id'>): Promise<Room> {
    await delay();
    const rooms = StorageEngine.getRooms();
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`,
    };
    StorageEngine.setRooms([newRoom, ...rooms]);
    StorageEngine.addAuditLog('ROOM_CREATED', 'Room Management', `Created Room ${newRoom.roomNumber} in ${newRoom.hostelBlock}`);
    return newRoom;
  },

  async updateRoom(id: string, updates: Partial<Room>): Promise<Room> {
    await delay();
    const rooms = StorageEngine.getRooms();
    const index = rooms.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Room not found');

    const updated = { ...rooms[index], ...updates };
    rooms[index] = updated;
    StorageEngine.setRooms(rooms);
    StorageEngine.addAuditLog('ROOM_UPDATED', 'Room Management', `Updated Room ${updated.roomNumber}`);
    return updated;
  },

  async deleteRoom(id: string): Promise<void> {
    await delay();
    const rooms = StorageEngine.getRooms();
    const target = rooms.find((r) => r.id === id);
    const filtered = rooms.filter((r) => r.id !== id);
    StorageEngine.setRooms(filtered);
    if (target) {
      StorageEngine.addAuditLog('ROOM_DELETED', 'Room Management', `Deleted Room ${target.roomNumber}`);
    }
  },

  async bookRoom(data: {
    roomId: string;
    roomNumber: string;
    studentId: string;
    studentName: string;
    bedNumber?: number;
    startDate: string;
    endDate: string;
  }): Promise<Booking> {
    return bookingService.createBooking({
      studentId: data.studentId,
      studentName: data.studentName,
      studentEmail: `${data.studentId.toLowerCase()}@university.edu`,
      roomId: data.roomId,
      startDate: data.startDate,
      endDate: data.endDate,
      notes: `Allocated Bed ${data.bedNumber || 1}`,
    });
  },
};

/* -------------------------------------------------------------------------- */
/*                              BOOKING SERVICE                               */
/* -------------------------------------------------------------------------- */
export const bookingService = {
  async getBookings(studentId?: string): Promise<Booking[]> {
    await delay();
    const bookings = StorageEngine.getBookings();
    if (studentId) {
      return bookings.filter((b) => b.studentId === studentId);
    }
    return bookings;
  },

  async createBooking(data: {
    studentId: string;
    studentName: string;
    studentEmail: string;
    roomId: string;
    startDate: string;
    endDate: string;
    notes?: string;
  }): Promise<Booking> {
    await delay();
    const rooms = StorageEngine.getRooms();
    const room = rooms.find((r) => r.id === data.roomId);
    if (!room) throw new Error('Selected room was not found.');

    // DOUBLE-BOOKING PREVENTATIVE VALIDATION
    if (room.occupiedBeds >= room.capacity || room.status === 'OCCUPIED') {
      throw new Error(
        `Double-booking prevented: Room ${room.roomNumber} has reached its maximum capacity (${room.capacity}/${room.capacity} beds occupied). Please select an available room.`
      );
    }

    const bookings = StorageEngine.getBookings();
    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      studentId: data.studentId,
      studentName: data.studentName,
      studentEmail: data.studentEmail,
      roomId: room.id,
      roomNumber: room.roomNumber,
      hostelBlock: room.hostelBlock,
      roomType: room.roomType.replace('_', ' '),
      bookingDate: new Date().toISOString().split('T')[0],
      startDate: data.startDate,
      endDate: data.endDate,
      amount: room.pricePerMonth,
      status: 'PENDING',
      notes: data.notes,
    };

    // Update room bed occupancy
    room.occupiedBeds += 1;
    if (room.occupiedBeds >= room.capacity) {
      room.status = 'OCCUPIED';
    }
    if (!room.currentOccupants) room.currentOccupants = [];
    room.currentOccupants.push(data.studentName);

    StorageEngine.setRooms(rooms);
    StorageEngine.setBookings([newBooking, ...bookings]);
    StorageEngine.addAuditLog(
      'ROOM_BOOKING_CREATED',
      'Room Booking',
      `Booking request submitted by ${data.studentName} for Room ${room.roomNumber}. Double-booking validation passed.`
    );

    notificationService.sendNotification({
      userId: 'user-admin-1',
      title: 'New Room Booking Request',
      message: `${data.studentName} booked bed in Room ${room.roomNumber} (${room.hostelBlock}).`,
      category: 'Booking',
      severity: 'info',
      actionUrl: '/bookings',
    });

    return newBooking;
  },

  async updateBookingStatus(id: string, status: BookingStatus): Promise<Booking> {
    await delay();
    const bookings = StorageEngine.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Booking not found');

    bookings[index].status = status;
    StorageEngine.setBookings(bookings);
    StorageEngine.addAuditLog('BOOKING_STATUS_CHANGED', 'Room Booking', `Booking ${id} status updated to ${status}`);
    return bookings[index];
  },
};

/* -------------------------------------------------------------------------- */
/*                              PAYMENT SERVICE                               */
/* -------------------------------------------------------------------------- */
export const paymentService = {
  async getPayments(studentId?: string): Promise<Payment[]> {
    await delay();
    const payments = StorageEngine.getPayments();
    if (studentId) {
      return payments.filter((p) => p.studentId === studentId);
    }
    return payments;
  },

  async processPayment(data: {
    studentId: string;
    studentName: string;
    roomNumber: string;
    amount: number;
    feeMonth: string;
    paymentMethod: 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'DEBIT_CARD';
  }): Promise<Payment> {
    await delay(300); // Simulate secure gateway handshake
    const payments = StorageEngine.getPayments();
    const txnId = `TXN-SAFE-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      transactionId: txnId,
      studentId: data.studentId,
      studentName: data.studentName,
      roomNumber: data.roomNumber,
      amount: data.amount,
      feeMonth: data.feeMonth,
      paymentDate: new Date().toISOString().split('T')[0],
      dueDate: '2026-03-05',
      paymentMethod: data.paymentMethod,
      status: 'PAID',
      receiptUrl: `/receipts/${txnId}.pdf`,
    };

    StorageEngine.setPayments([newPayment, ...payments]);
    StorageEngine.addAuditLog(
      'PAYMENT_PROCESSED',
      'Finance',
      `Payment of ₹${data.amount.toLocaleString('en-IN')} received for ${data.feeMonth} from ${data.studentName} via ${data.paymentMethod}. Txn ID: ${txnId}`
    );

    notificationService.sendNotification({
      userId: data.studentId,
      title: 'Fee Payment Successful',
      message: `Your payment of ₹${data.amount.toLocaleString('en-IN')} for ${data.feeMonth} was verified. Transaction ID: ${txnId}.`,
      category: 'Payment',
      severity: 'success',
      actionUrl: '/payments',
    });

    return newPayment;
  },

  getRevenueSummary(): {
    totalRevenue: number;
    monthlyRevenue: number;
    pendingRevenue: number;
    paidCount: number;
    pendingCount: number;
  } {
    const payments = StorageEngine.getPayments();
    const paid = payments.filter((p) => p.status === 'PAID');
    const pending = payments.filter((p) => p.status === 'PENDING');

    const totalRevenue = paid.reduce((sum, p) => sum + p.amount, 0);
    const monthlyRevenue = paid.filter((p) => p.feeMonth.includes('February') || p.feeMonth.includes('March')).reduce((sum, p) => sum + p.amount, 0);
    const pendingRevenue = pending.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalRevenue,
      monthlyRevenue,
      pendingRevenue,
      paidCount: paid.length,
      pendingCount: pending.length,
    };
  },

  async getStudentPayments(studentId: string): Promise<Payment[]> {
    return paymentService.getPayments(studentId);
  },

  async createPayment(data: {
    studentId: string;
    studentName: string;
    roomNumber: string;
    amount: number;
    feeMonth: string;
    paymentMethod: 'UPI' | 'Credit Card' | 'NetBanking';
    dueDate?: string;
  }): Promise<Payment> {
    const methodMap: Record<string, 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'DEBIT_CARD'> = {
      UPI: 'UPI',
      'Credit Card': 'CREDIT_CARD',
      NetBanking: 'NET_BANKING',
    };
    return paymentService.processPayment({
      studentId: data.studentId,
      studentName: data.studentName,
      roomNumber: data.roomNumber,
      amount: data.amount,
      feeMonth: data.feeMonth,
      paymentMethod: methodMap[data.paymentMethod] || 'UPI',
    });
  },
};

/* -------------------------------------------------------------------------- */
/*                             COMPLAINT SERVICE                              */
/* -------------------------------------------------------------------------- */
export const complaintService = {
  async getComplaints(studentId?: string): Promise<Complaint[]> {
    await delay();
    const complaints = StorageEngine.getComplaints();
    if (studentId) {
      return complaints.filter((c) => c.studentId === studentId);
    }
    return complaints;
  },

  async submitComplaint(data: Omit<Complaint, 'id' | 'status' | 'date'>): Promise<Complaint> {
    await delay();
    const complaints = StorageEngine.getComplaints();
    const newComplaint: Complaint = {
      ...data,
      id: `cmp-${Date.now().toString().slice(-4)}`,
      status: 'Submitted',
      date: new Date().toISOString(),
    };

    StorageEngine.setComplaints([newComplaint, ...complaints]);
    StorageEngine.addAuditLog('COMPLAINT_SUBMITTED', 'Grievance', `Grievance "${newComplaint.title}" lodged by ${newComplaint.studentName} for Room ${newComplaint.roomNumber}`);

    // Notify Warden & Admin
    notificationService.sendNotification({
      userId: 'user-warden-1',
      title: `New Grievance: ${newComplaint.category}`,
      message: `${newComplaint.studentName} (Room ${newComplaint.roomNumber}): "${newComplaint.title}"`,
      category: 'Complaint',
      severity: 'warning',
      actionUrl: '/complaints',
    });

    return newComplaint;
  },

  async updateComplaintStatus(
    id: string,
    status: ComplaintStatus,
    resolutionNotes?: string,
    assignedTo?: string
  ): Promise<Complaint> {
    await delay();
    const complaints = StorageEngine.getComplaints();
    const index = complaints.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Complaint not found');

    const updated = {
      ...complaints[index],
      status,
      resolutionNotes: resolutionNotes || complaints[index].resolutionNotes,
      assignedTo: assignedTo || complaints[index].assignedTo,
      resolvedDate: status === 'Resolved' || status === 'Closed' ? new Date().toISOString() : complaints[index].resolvedDate,
    };

    complaints[index] = updated;
    StorageEngine.setComplaints(complaints);
    StorageEngine.addAuditLog('COMPLAINT_STATUS_UPDATED', 'Grievance', `Complaint #${id} updated to status "${status}"`);

    // Notify student
    notificationService.sendNotification({
      userId: updated.studentId,
      title: `Grievance #${id} Updated: ${status}`,
      message: `Your complaint regarding "${updated.title}" is now marked as ${status}. Notes: ${resolutionNotes || 'In progress by warden'}`,
      category: 'Complaint',
      severity: status === 'Resolved' ? 'success' : 'info',
      actionUrl: '/complaints',
    });

    return updated;
  },

  async getStudentComplaints(studentId: string): Promise<Complaint[]> {
    return complaintService.getComplaints(studentId);
  },

  async createComplaint(data: {
    studentId: string;
    studentName: string;
    roomNumber: string;
    category: ComplaintCategory;
    urgency?: 'Low' | 'Medium' | 'High' | 'Urgent';
    title: string;
    description: string;
  }): Promise<Complaint> {
    const priorityMap: Record<string, 'Low' | 'Medium' | 'High' | 'Critical'> = {
      Low: 'Low',
      Medium: 'Medium',
      High: 'High',
      Urgent: 'Critical',
    };
    return complaintService.submitComplaint({
      studentId: data.studentId,
      studentName: data.studentName,
      roomNumber: data.roomNumber,
      category: data.category,
      priority: priorityMap[data.urgency || 'Medium'] || 'Medium',
      title: data.title,
      description: data.description,
    });
  },
};

/* -------------------------------------------------------------------------- */
/*                            EMERGENCY & AI SERVICE                          */
/* -------------------------------------------------------------------------- */
export const emergencyService = {
  async getAlerts(): Promise<EmergencyAlert[]> {
    await delay();
    return StorageEngine.getEmergencyAlerts();
  },

  async triggerManualPanic(data: {
    studentName: string;
    studentId: string;
    studentPhone: string;
    room: string;
    location: string;
    hostelBlock: string;
  }): Promise<EmergencyAlert> {
    await delay(100);
    const alerts = StorageEngine.getEmergencyAlerts();
    const newAlert: EmergencyAlert = {
      id: `EMG-${new Date().getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`,
      timestamp: new Date().toISOString(),
      location: data.location || `${data.hostelBlock} – Room ${data.room}`,
      room: data.room,
      hostelBlock: data.hostelBlock,
      studentName: data.studentName,
      studentId: data.studentId,
      studentPhone: data.studentPhone,
      source: 'MANUAL_PANIC',
      distressProbability: 100,
      confidence: 100,
      status: 'New',
      notes: 'MANUAL PANIC BUTTON DEPLOYED BY STUDENT. Immediate physical response required.',
    };

    StorageEngine.setEmergencyAlerts([newAlert, ...alerts]);
    StorageEngine.addAuditLog(
      'MANUAL_PANIC_TRIGGERED',
      'Emergency Center',
      `CRITICAL: Student ${data.studentName} (${data.studentId}) activated manual emergency panic in Room ${data.room}. Dispatching warden and SMS alerts.`
    );

    // Simulated Twilio SMS Dispatch
    console.info(`[Twilio Mock Dispatch] SMS dispatched to Warden (+91 98450 12345) & Admin (+91 98765 43210): "EMERGENCY ALERT: Student ${data.studentName} in Room ${data.room} pressed PANIC BUTTON."`);

    // Broadcast High-Priority Notification
    notificationService.sendNotification({
      userId: 'ALL',
      title: '🚨 CRITICAL EMERGENCY ALERT',
      message: `Manual panic triggered by ${data.studentName} in Room ${data.room} (${data.hostelBlock}). Warden & security notified.`,
      category: 'Emergency',
      severity: 'danger',
      actionUrl: '/safety-center',
    });

    return newAlert;
  },

  async triggerAiAlert(data: {
    location: string;
    room: string;
    hostelBlock: string;
    distressProbability: number;
    confidence: number;
    soundType: string;
    notes?: string;
  }): Promise<EmergencyAlert> {
    await delay(100);
    const alerts = StorageEngine.getEmergencyAlerts();
    const newAlert: EmergencyAlert = {
      id: `EMG-${new Date().getFullYear()}-${String(Math.floor(100 + Math.random() * 900))}`,
      timestamp: new Date().toISOString(),
      location: data.location,
      room: data.room,
      hostelBlock: data.hostelBlock,
      source: 'AI_AUDIO_DETECTION',
      distressProbability: data.distressProbability,
      confidence: data.confidence,
      status: 'New',
      notes: data.notes || `AI Acoustic Engine detected: ${data.soundType}. Human verification required.`,
      audioFeatures: {
        pitch: Math.floor(350 + Math.random() * 200),
        intensity: Math.floor(80 + Math.random() * 18),
        mfccSample: [-15.2, 26.4, -4.8, 16.1, -9.0, 8.4, -3.2, 12.0],
      },
    };

    StorageEngine.setEmergencyAlerts([newAlert, ...alerts]);
    StorageEngine.addAuditLog(
      'AI_ACOUSTIC_DISTRESS_ALERT',
      'AI Safety Monitoring',
      `Potential Distress Event: Acoustic detection probability ${data.distressProbability}% at ${data.location}. Requires human verification.`
    );

    // Broadcast notification
    notificationService.sendNotification({
      userId: 'ALL',
      title: '⚠️ Potential Distress Event Flagged by AI',
      message: `Acoustic sensor flagged potential distress (${data.distressProbability}%) in ${data.room}. Warden review requested.`,
      category: 'Emergency',
      severity: 'danger',
      actionUrl: '/safety-center',
    });

    return newAlert;
  },

  async updateAlertStatus(
    id: string,
    status: AlertStatus,
    notes?: string,
    acknowledgedBy?: string
  ): Promise<EmergencyAlert> {
    await delay();
    const alerts = StorageEngine.getEmergencyAlerts();
    const index = alerts.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Alert not found');

    const updated = {
      ...alerts[index],
      status,
      notes: notes || alerts[index].notes,
      acknowledgedBy: acknowledgedBy || alerts[index].acknowledgedBy,
    };

    alerts[index] = updated;
    StorageEngine.setEmergencyAlerts(alerts);
    StorageEngine.addAuditLog('EMERGENCY_STATUS_UPDATED', 'Emergency Center', `Emergency alert #${id} status changed to ${status}`);
    return updated;
  },
};

/* -------------------------------------------------------------------------- */
/*                                 AI SERVICE                                 */
/* -------------------------------------------------------------------------- */
export const aiService = {
  async getAiLogs(): Promise<AiDetectionLog[]> {
    await delay();
    return StorageEngine.getAiLogs();
  },

  async analyzeAudio(data: {
    audioLabel?: string;
    room: string;
    location: string;
    sensorId?: string;
    isDistressSimulation?: boolean;
  }): Promise<{
    status: 'SAFE' | 'DANGER';
    distressProbability: number;
    confidence: number;
    detectedAt: string;
    location: string;
    room: string;
    soundType: string;
    processedLatencyMs: number;
    triggeredAlert?: EmergencyAlert;
  }> {
    await delay(350); // Simulate neural acoustic inference processing time
    const threshold = StorageEngine.getSystemStatus().aiThreshold || 90;

    let distressProbability = 0;
    let soundType = '';
    let status: 'SAFE' | 'DANGER' = 'SAFE';

    if (data.isDistressSimulation) {
      distressProbability = Number((91 + Math.random() * 6).toFixed(1));
      soundType = data.audioLabel || 'Scream / High-Energy Vocal Distress Signature';
      status = 'DANGER';
    } else {
      distressProbability = Number((8 + Math.random() * 18).toFixed(1));
      soundType = data.audioLabel || 'Normal Conversational Ambient / Floor Footsteps';
      status = 'SAFE';
    }

    const confidence = Number((88 + Math.random() * 10).toFixed(1));
    const processedLatencyMs = Math.floor(95 + Math.random() * 50);
    const now = new Date().toISOString();

    let triggeredAlert: EmergencyAlert | undefined = undefined;

    if (distressProbability >= threshold) {
      triggeredAlert = await emergencyService.triggerAiAlert({
        location: data.location,
        room: data.room,
        hostelBlock: data.location.includes('Block B') ? 'Block B' : 'Block A',
        distressProbability,
        confidence,
        soundType,
      });
    }

    const log: AiDetectionLog = {
      id: `ai-log-${Date.now()}`,
      detectedAt: now,
      location: data.location,
      room: data.room,
      sensorId: data.sensorId || 'MIC-NODE-DEMO',
      status,
      distressProbability,
      confidence,
      soundTypeDetected: soundType,
      processedLatencyMs,
      triggeredAlertId: triggeredAlert?.id,
    };

    const logs = StorageEngine.getAiLogs();
    StorageEngine.setAiLogs([log, ...logs]);

    return {
      status,
      distressProbability,
      confidence,
      detectedAt: now,
      location: data.location,
      room: data.room,
      soundType,
      processedLatencyMs,
      triggeredAlert,
    };
  },

  getThreshold(): number {
    return StorageEngine.getSystemStatus().aiThreshold;
  },

  setThreshold(val: number): void {
    const sys = StorageEngine.getSystemStatus();
    sys.aiThreshold = val;
    StorageEngine.setSystemStatus(sys);
    StorageEngine.addAuditLog('AI_THRESHOLD_UPDATED', 'AI Safety Settings', `Acoustic distress trigger threshold updated to ${val}%`);
  },
};

/* -------------------------------------------------------------------------- */
/*                            ATTENDANCE SERVICE                              */
/* -------------------------------------------------------------------------- */
export const attendanceService = {
  async getRecords(): Promise<AttendanceRecord[]> {
    return attendanceService.getAttendance();
  },

  async getAttendance(studentId?: string): Promise<AttendanceRecord[]> {
    await delay();
    const records = StorageEngine.getAttendance();
    if (studentId) {
      return records.filter((r) => r.studentId === studentId);
    }
    return records;
  },

  async markAttendance(
    dataOrStudentId:
      | string
      | {
          studentId: string;
          studentName: string;
          roomNumber: string;
          status: 'Present' | 'Late' | 'Absent' | 'On Leave';
          checkInTime?: string;
        },
    statusArg?: 'Present' | 'Late' | 'Absent' | 'On Leave',
    dateArg?: string
  ): Promise<AttendanceRecord> {
    await delay();
    const records = StorageEngine.getAttendance();
    let studentId = '';
    let studentName = 'Student';
    let roomNumber = 'A-101';
    let status: 'Present' | 'Late' | 'Absent' | 'On Leave' = 'Present';
    let checkInTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (typeof dataOrStudentId === 'string') {
      studentId = dataOrStudentId;
      status = statusArg || 'Present';
      const student = StorageEngine.getStudents().find((s) => s.studentId === studentId);
      if (student) {
        studentName = student.fullName;
        roomNumber = student.roomNumber;
      }
    } else {
      studentId = dataOrStudentId.studentId;
      studentName = dataOrStudentId.studentName;
      roomNumber = dataOrStudentId.roomNumber;
      status = dataOrStudentId.status;
      checkInTime = dataOrStudentId.checkInTime || checkInTime;
    }

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      studentId,
      studentName,
      roomNumber,
      date: dateArg || new Date().toISOString().split('T')[0],
      checkInTime,
      status,
      wardenVerified: true,
    };

    StorageEngine.setAttendance([newRecord, ...records]);
    StorageEngine.addAuditLog('ATTENDANCE_MARKED', 'Attendance', `Warden marked attendance for ${studentName} as ${status}`);
    return newRecord;
  },
};

/* -------------------------------------------------------------------------- */
/*                           MAINTENANCE SERVICE                              */
/* -------------------------------------------------------------------------- */
export const maintenanceService = {
  async getRequests(): Promise<MaintenanceRequest[]> {
    await delay();
    return StorageEngine.getMaintenance();
  },

  async createRequest(data: Omit<MaintenanceRequest, 'id' | 'reportedDate' | 'status'>): Promise<MaintenanceRequest> {
    await delay();
    const list = StorageEngine.getMaintenance();
    const item: MaintenanceRequest = {
      ...data,
      id: `maint-${Date.now().toString().slice(-4)}`,
      reportedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };

    StorageEngine.setMaintenance([item, ...list]);
    StorageEngine.addAuditLog('MAINTENANCE_CREATED', 'Maintenance', `Request created for Room ${data.roomNumber}: ${data.issue}`);
    return item;
  },

  async updateStatus(id: string, status: MaintenanceRequest['status'], assignedStaff?: string): Promise<MaintenanceRequest> {
    await delay();
    const list = StorageEngine.getMaintenance();
    const idx = list.findIndex((m) => m.id === id);
    if (idx === -1) throw new Error('Maintenance request not found');

    const updated = {
      ...list[idx],
      status,
      assignedStaff: assignedStaff || list[idx].assignedStaff,
      completedDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : list[idx].completedDate,
    };

    list[idx] = updated;
    StorageEngine.setMaintenance(list);
    StorageEngine.addAuditLog('MAINTENANCE_STATUS_UPDATED', 'Maintenance', `Request #${id} status changed to ${status}`);
    return updated;
  },
};

/* -------------------------------------------------------------------------- */
/*                           ANNOUNCEMENTS SERVICE                            */
/* -------------------------------------------------------------------------- */
export const announcementService = {
  async getAnnouncements(): Promise<Announcement[]> {
    await delay();
    return StorageEngine.getAnnouncements();
  },

  async createAnnouncement(data: Omit<Announcement, 'id' | 'date'> & { content?: string }): Promise<Announcement> {
    await delay();
    const list = StorageEngine.getAnnouncements();
    const desc = data.description || data.content || '';
    const item: Announcement = {
      ...data,
      id: `anc-${Date.now().toString().slice(-4)}`,
      description: desc,
      content: desc,
      priority: data.priority || 'Normal',
      date: new Date().toISOString().split('T')[0],
    };

    StorageEngine.setAnnouncements([item, ...list]);
    StorageEngine.addAuditLog('ANNOUNCEMENT_CREATED', 'Announcements', `Announcement published: "${data.title}" by ${data.author}`);

    notificationService.sendNotification({
      userId: 'ALL',
      title: `📢 Announcement: ${data.title}`,
      message: desc.length > 90 ? `${desc.substring(0, 90)}...` : desc,
      category: 'Announcement',
      severity: item.priority === 'Urgent' ? 'danger' : 'info',
      actionUrl: '/announcements',
    });

    return item;
  },
};

/* -------------------------------------------------------------------------- */
/*                             FOOD MENU SERVICE                              */
/* -------------------------------------------------------------------------- */
export const foodMenuService = {
  async getFoodMenu(): Promise<DailyFoodMenu[]> {
    await delay();
    return StorageEngine.getFoodMenu();
  },

  async updateDailyMenu(day: DailyFoodMenu['day'], updatedDay: DailyFoodMenu): Promise<DailyFoodMenu> {
    await delay();
    const list = StorageEngine.getFoodMenu();
    const idx = list.findIndex((m) => m.day === day);
    if (idx !== -1) {
      list[idx] = updatedDay;
      StorageEngine.setFoodMenu(list);
      StorageEngine.addAuditLog('FOOD_MENU_UPDATED', 'Food Services', `Food menu modified for ${day}`);
    }
    return updatedDay;
  },
};

/* -------------------------------------------------------------------------- */
/*                              LAUNDRY SERVICE                               */
/* -------------------------------------------------------------------------- */
export const laundryService = {
  async getLaundryRecords(studentId?: string): Promise<LaundryRecord[]> {
    await delay();
    const list = StorageEngine.getLaundry();
    if (studentId) {
      return list.filter((l) => l.studentId === studentId);
    }
    return list;
  },

  async requestLaundry(data: {
    studentId: string;
    studentName: string;
    roomNumber: string;
    clothesCount: number;
    itemsBreakdown: { item: string; count: number }[];
  }): Promise<LaundryRecord> {
    await delay();
    const list = StorageEngine.getLaundry();
    const expected = new Date();
    expected.setDate(expected.getDate() + 2);

    const item: LaundryRecord = {
      id: `lnd-${Date.now()}`,
      studentId: data.studentId,
      studentName: data.studentName,
      roomNumber: data.roomNumber,
      clothesCount: data.clothesCount,
      itemsBreakdown: data.itemsBreakdown,
      submissionDate: new Date().toISOString().split('T')[0],
      expectedReturnDate: expected.toISOString().split('T')[0],
      status: 'Submitted',
      tagNumber: `TAG-${data.roomNumber.replace('-', '')}-${String(Date.now()).slice(-4)}`,
    };

    StorageEngine.setLaundry([item, ...list]);
    StorageEngine.addAuditLog('LAUNDRY_SUBMITTED', 'Laundry', `${data.studentName} handed in ${data.clothesCount} clothes for washing. Tag: ${item.tagNumber}`);
    return item;
  },

  async updateLaundryStatus(id: string, status: LaundryRecord['status']): Promise<LaundryRecord> {
    await delay();
    const list = StorageEngine.getLaundry();
    const idx = list.findIndex((l) => l.id === id);
    if (idx === -1) throw new Error('Laundry record not found');

    list[idx].status = status;
    if (status === 'Collected') {
      list[idx].actualReturnDate = new Date().toISOString().split('T')[0];
    }
    StorageEngine.setLaundry(list);
    return list[idx];
  },

  async getOrders(): Promise<LaundryRecord[]> {
    return laundryService.getLaundryRecords();
  },

  async getStudentOrders(studentId: string): Promise<LaundryRecord[]> {
    return laundryService.getLaundryRecords(studentId);
  },

  async createOrder(data: { studentId: string; studentName: string; itemCount: number }): Promise<LaundryRecord> {
    return laundryService.requestLaundry({
      studentId: data.studentId,
      studentName: data.studentName,
      roomNumber: 'A-204',
      clothesCount: data.itemCount,
      itemsBreakdown: [{ item: 'Standard Garments', count: data.itemCount }],
    });
  },
};

/* -------------------------------------------------------------------------- */
/*                                CCTV SERVICE                                */
/* -------------------------------------------------------------------------- */
export const cctvService = {
  async getCameras(): Promise<CctvCamera[]> {
    await delay();
    return StorageEngine.getCctv();
  },
};

/* -------------------------------------------------------------------------- */
/*                            NOTIFICATION SERVICE                            */
/* -------------------------------------------------------------------------- */
export const notificationService = {
  async getNotifications(userId?: string): Promise<NotificationItem[]> {
    await delay(20);
    const list = StorageEngine.getNotifications();
    if (!userId || userId === 'user-admin-1') {
      return list;
    }
    return list.filter((n) => n.userId === userId || n.userId === 'ALL');
  },

  async markAsRead(id: string): Promise<void> {
    const list = StorageEngine.getNotifications();
    const idx = list.findIndex((n) => n.id === id);
    if (idx !== -1) {
      list[idx].read = true;
      StorageEngine.setNotifications(list);
    }
  },

  async markAllAsRead(userId?: string): Promise<void> {
    const list = StorageEngine.getNotifications();
    const updated = list.map((n) => {
      if (!userId || n.userId === userId || n.userId === 'ALL') {
        return { ...n, read: true };
      }
      return n;
    });
    StorageEngine.setNotifications(updated);
  },

  sendNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const list = StorageEngine.getNotifications();
    const newItem: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      timestamp: 'Just now',
      read: false,
    };
    StorageEngine.setNotifications([newItem, ...list]);
    return newItem;
  },
};

/* -------------------------------------------------------------------------- */
/*                                USER SERVICE                                */
/* -------------------------------------------------------------------------- */
export const userService = {
  async getUsers(role?: UserRole): Promise<User[]> {
    await delay();
    const list = StorageEngine.getUsers();
    if (role) {
      return list.filter((u) => u.role === role);
    }
    return list;
  },

  async getPendingApprovals(): Promise<User[]> {
    await delay();
    return StorageEngine.getUsers().filter((u) => u.approvalStatus === 'PENDING');
  },

  async approveUser(userId: string): Promise<User> {
    await delay();
    const users = StorageEngine.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User not found');

    users[idx].approvalStatus = 'APPROVED';
    StorageEngine.setUsers(users);
    StorageEngine.addAuditLog('USER_APPROVED', 'User Approval', `Administrator Soniya Kamireddy approved registration for ${users[idx].name} (${users[idx].role})`);
    return users[idx];
  },

  async rejectUser(userId: string): Promise<User> {
    await delay();
    const users = StorageEngine.getUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('User not found');

    users[idx].approvalStatus = 'REJECTED';
    StorageEngine.setUsers(users);
    StorageEngine.addAuditLog('USER_REJECTED', 'User Approval', `Registration for ${users[idx].name} declined by Administrator.`);
    return users[idx];
  },

  async getStudents(): Promise<StudentProfile[]> {
    await delay();
    return StorageEngine.getStudents();
  },
};

/* -------------------------------------------------------------------------- */
/*                            SYSTEM & AUDIT LOGS                             */
/* -------------------------------------------------------------------------- */
export const systemService = {
  async getStatus(): Promise<SystemStatus> {
    await delay();
    const sys = StorageEngine.getSystemStatus();
    const alerts = StorageEngine.getEmergencyAlerts();
    sys.activeAlertsCount = alerts.filter((a) => a.status === 'New' || a.status === 'Investigating').length;
    return sys;
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    await delay();
    return StorageEngine.getAuditLogs();
  },

  resetDemoData(): void {
    StorageEngine.resetToDemoData();
  },
};

export const auditService = {
  async getLogs(): Promise<AuditLog[]> {
    return systemService.getAuditLogs();
  },
};

export const foodService = {
  async getWeeklyMenu(): Promise<FoodMenuItem[]> {
    await delay(30);
    const menus = StorageEngine.getFoodMenu();
    const items: FoodMenuItem[] = [];
    menus.forEach((m) => {
      items.push({
        id: `food-${m.day}-b`,
        day: m.day,
        mealType: 'Breakfast',
        time: m.breakfast.timings,
        items: m.breakfast.menu.join(', '),
        dietary: 'Vegetarian',
      });
      items.push({
        id: `food-${m.day}-l`,
        day: m.day,
        mealType: 'Lunch',
        time: m.lunch.timings,
        items: m.lunch.menu.join(', '),
        dietary: 'Full Indian Thali',
      });
      items.push({
        id: `food-${m.day}-s`,
        day: m.day,
        mealType: 'Snacks',
        time: m.snacks.timings,
        items: m.snacks.menu.join(', '),
        dietary: 'Tea & Savory Snacks',
      });
      items.push({
        id: `food-${m.day}-d`,
        day: m.day,
        mealType: 'Dinner',
        time: m.dinner.timings,
        items: m.dinner.menu.join(', '),
        dietary: 'Balanced Nutritional Meal',
      });
    });
    return items;
  },
};
