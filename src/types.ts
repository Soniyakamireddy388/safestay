export type UserRole = 'ADMIN' | 'WARDEN' | 'STUDENT' | 'PARENT';

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  // Role specific fields
  studentId?: string;
  wardId?: string; // For parents: studentId of their child
  hostelBlock?: string;
  roomNumber?: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  studentId: string;
  fullName: string;
  email: string;
  phone: string;
  emergencyContact: string;
  parentId?: string;
  parentName?: string;
  parentPhone?: string;
  hostelBlock: string;
  roomNumber: string;
  bedNumber: number;
  monthlyFee: number;
  feeStatus: 'PAID' | 'PENDING' | 'OVERDUE';
  attendanceRate: number; // percentage e.g. 92
  checkInStatus: 'CHECKED_IN' | 'CHECKED_OUT' | 'ON_LEAVE';
  joiningDate: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  hostelBlock: string; // e.g., "Block A", "Block B"
  floor: number;
  roomType: 'SINGLE_AC' | 'SINGLE_NON_AC' | 'DOUBLE_AC' | 'DOUBLE_NON_AC' | 'TRIPLE_NON_AC';
  capacity: number;
  occupiedBeds: number;
  pricePerMonth: number;
  facilities: string[];
  image: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  currentOccupants?: string[];
}

export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  roomId: string;
  roomNumber: string;
  hostelBlock: string;
  roomType: string;
  bookingDate: string;
  startDate: string;
  endDate: string;
  amount: number;
  status: BookingStatus;
  notes?: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  amount: number;
  feeMonth: string;
  paymentDate: string;
  dueDate: string;
  paymentMethod: 'UPI' | 'NET_BANKING' | 'CREDIT_CARD' | 'DEBIT_CARD';
  status: 'PAID' | 'PENDING' | 'FAILED';
  receiptUrl?: string;
}

export type ComplaintCategory = 
  | 'Electrical' 
  | 'Plumbing' 
  | 'Cleaning' 
  | 'Food' 
  | 'Internet' 
  | 'Room' 
  | 'Security' 
  | 'Other';

export type ComplaintStatus = 
  | 'Submitted' 
  | 'Under Review' 
  | 'Assigned' 
  | 'In Progress' 
  | 'Resolved' 
  | 'Closed';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  date: string;
  assignedTo?: string; // Warden name
  resolvedDate?: string;
  resolutionNotes?: string;
  image?: string;
}

export interface MaintenanceRequest {
  id: string;
  roomNumber: string;
  hostelBlock: string;
  issue: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  description: string;
  reportedBy: string;
  reportedDate: string;
  assignedStaff?: string;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed';
  completedDate?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'Present' | 'Late' | 'Absent' | 'On Leave';
  wardenVerified: boolean;
}

export interface MealDetail {
  menu: string[];
  timings: string;
  calories?: string;
  special?: string;
}

export interface DailyFoodMenu {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  breakfast: MealDetail;
  lunch: MealDetail;
  snacks: MealDetail;
  dinner: MealDetail;
}

export interface LaundryRecord {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  clothesCount: number;
  itemsBreakdown: { item: string; count: number }[];
  submissionDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  status: 'Submitted' | 'Washing' | 'Ready' | 'Collected';
  tagNumber: string;
  tokenNumber?: string;
}

export type AnnouncementCategory = 'General' | 'Academic' | 'Maintenance' | 'Safety' | 'Event' | 'Holiday';

export interface Announcement {
  id: string;
  title: string;
  description?: string;
  content?: string;
  category: AnnouncementCategory | string;
  priority?: 'Normal' | 'High' | 'Urgent';
  author: string;
  role?: string;
  date: string;
  targetAudience?: 'ALL' | 'STUDENTS' | 'PARENTS' | 'WARDENS';
  isPinned?: boolean;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'Payment' | 'Complaint' | 'Announcement' | 'Emergency' | 'Attendance' | 'Booking';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  severity?: 'info' | 'warning' | 'danger' | 'success';
}

export type AlertSource = 'MANUAL_PANIC' | 'AI_AUDIO_DETECTION';
export type AlertStatus = 'New' | 'Acknowledged' | 'Investigating' | 'Resolved' | 'False Alarm';

export interface EmergencyAlert {
  id: string;
  timestamp: string;
  location: string;
  room: string;
  hostelBlock: string;
  studentName?: string;
  studentId?: string;
  studentPhone?: string;
  source: AlertSource;
  distressProbability?: number; // 0-100
  confidence?: number; // 0-100
  status: AlertStatus;
  acknowledgedBy?: string;
  notes?: string;
  audioFeatures?: {
    pitch?: number;
    intensity?: number;
    mfccSample?: number[];
  };
}

export interface AiDetectionLog {
  id: string;
  detectedAt: string;
  location: string;
  room: string;
  sensorId: string;
  status: 'SAFE' | 'DANGER';
  distressProbability: number;
  confidence: number;
  soundTypeDetected: string;
  processedLatencyMs: number;
  triggeredAlertId?: string;
}

export interface CctvCamera {
  id: string;
  cameraNumber: string;
  name: string;
  location: string;
  hostelBlock: string;
  status: 'ONLINE' | 'OFFLINE' | 'RECORDING';
  lastMotionDetected?: string;
  resolution: string;
  fps: number;
  isDemo: boolean;
  videoType: 'entrance' | 'lobby' | 'gate' | 'corridor';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entity: string;
  description: string;
  ipAddress: string;
}

export interface SystemStatus {
  frontendStatus: 'ONLINE';
  backendApiStatus: 'ONLINE' | 'DEMO_MODE' | 'OFFLINE';
  mysqlStatus: 'ONLINE' | 'CONNECTED_IN_MEMORY' | 'OFFLINE';
  aiServiceStatus: 'ONLINE' | 'DEMO_MODE' | 'OFFLINE';
  twilioServiceStatus: 'DEMO_MODE' | 'ACTIVE' | 'OFFLINE';
  aiThreshold: number; // e.g. 90
  activeAlertsCount: number;
}

// Compatibility type aliases
export type AttendanceStatus = 'Present' | 'Late' | 'Absent' | 'On Leave';
export type EmergencyAlertStatus = AlertStatus;
export type LaundryOrder = LaundryRecord;
export interface FoodMenuItem {
  id: string;
  day: string;
  mealType: string;
  time: string;
  items: string;
  dietary: string;
}
