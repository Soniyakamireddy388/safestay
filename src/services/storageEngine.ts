import {
  INITIAL_USERS,
  INITIAL_STUDENT_PROFILES,
  INITIAL_ROOMS,
  INITIAL_BOOKINGS,
  INITIAL_PAYMENTS,
  INITIAL_COMPLAINTS,
  INITIAL_MAINTENANCE,
  INITIAL_ATTENDANCE,
  INITIAL_FOOD_MENU,
  INITIAL_LAUNDRY,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EMERGENCY_ALERTS,
  INITIAL_AI_DETECTION_LOGS,
  INITIAL_CCTV_CAMERAS,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import {
  User,
  StudentProfile,
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
} from '../types';

const STORAGE_KEYS = {
  USERS: 'safestay_users',
  STUDENTS: 'safestay_students',
  ROOMS: 'safestay_rooms',
  BOOKINGS: 'safestay_bookings',
  PAYMENTS: 'safestay_payments',
  COMPLAINTS: 'safestay_complaints',
  MAINTENANCE: 'safestay_maintenance',
  ATTENDANCE: 'safestay_attendance',
  FOOD_MENU: 'safestay_food_menu',
  LAUNDRY: 'safestay_laundry',
  ANNOUNCEMENTS: 'safestay_announcements',
  EMERGENCY: 'safestay_emergency',
  AI_LOGS: 'safestay_ai_logs',
  CCTV: 'safestay_cctv',
  AUDIT: 'safestay_audit',
  NOTIFICATIONS: 'safestay_notifications',
  CURRENT_USER: 'safestay_current_user',
  SYSTEM_STATUS: 'safestay_system_status',
};

function getStoredItem<T>(key: string, defaultData: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch {
    return defaultData;
  }
}

function setStoredItem<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error for key:', key, e);
  }
}

export const StorageEngine = {
  getUsers: (): User[] => getStoredItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS),
  setUsers: (data: User[]) => setStoredItem(STORAGE_KEYS.USERS, data),

  getStudents: (): StudentProfile[] => getStoredItem<StudentProfile[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENT_PROFILES),
  setStudents: (data: StudentProfile[]) => setStoredItem(STORAGE_KEYS.STUDENTS, data),

  getRooms: (): Room[] => getStoredItem<Room[]>(STORAGE_KEYS.ROOMS, INITIAL_ROOMS),
  setRooms: (data: Room[]) => setStoredItem(STORAGE_KEYS.ROOMS, data),

  getBookings: (): Booking[] => getStoredItem<Booking[]>(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS),
  setBookings: (data: Booking[]) => setStoredItem(STORAGE_KEYS.BOOKINGS, data),

  getPayments: (): Payment[] => getStoredItem<Payment[]>(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS),
  setPayments: (data: Payment[]) => setStoredItem(STORAGE_KEYS.PAYMENTS, data),

  getComplaints: (): Complaint[] => getStoredItem<Complaint[]>(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS),
  setComplaints: (data: Complaint[]) => setStoredItem(STORAGE_KEYS.COMPLAINTS, data),

  getMaintenance: (): MaintenanceRequest[] => getStoredItem<MaintenanceRequest[]>(STORAGE_KEYS.MAINTENANCE, INITIAL_MAINTENANCE),
  setMaintenance: (data: MaintenanceRequest[]) => setStoredItem(STORAGE_KEYS.MAINTENANCE, data),

  getAttendance: (): AttendanceRecord[] => getStoredItem<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE),
  setAttendance: (data: AttendanceRecord[]) => setStoredItem(STORAGE_KEYS.ATTENDANCE, data),

  getFoodMenu: (): DailyFoodMenu[] => getStoredItem<DailyFoodMenu[]>(STORAGE_KEYS.FOOD_MENU, INITIAL_FOOD_MENU),
  setFoodMenu: (data: DailyFoodMenu[]) => setStoredItem(STORAGE_KEYS.FOOD_MENU, data),

  getLaundry: (): LaundryRecord[] => getStoredItem<LaundryRecord[]>(STORAGE_KEYS.LAUNDRY, INITIAL_LAUNDRY),
  setLaundry: (data: LaundryRecord[]) => setStoredItem(STORAGE_KEYS.LAUNDRY, data),

  getAnnouncements: (): Announcement[] => getStoredItem<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS),
  setAnnouncements: (data: Announcement[]) => setStoredItem(STORAGE_KEYS.ANNOUNCEMENTS, data),

  getEmergencyAlerts: (): EmergencyAlert[] => getStoredItem<EmergencyAlert[]>(STORAGE_KEYS.EMERGENCY, INITIAL_EMERGENCY_ALERTS),
  setEmergencyAlerts: (data: EmergencyAlert[]) => setStoredItem(STORAGE_KEYS.EMERGENCY, data),

  getAiLogs: (): AiDetectionLog[] => getStoredItem<AiDetectionLog[]>(STORAGE_KEYS.AI_LOGS, INITIAL_AI_DETECTION_LOGS),
  setAiLogs: (data: AiDetectionLog[]) => setStoredItem(STORAGE_KEYS.AI_LOGS, data),

  getCctv: (): CctvCamera[] => getStoredItem<CctvCamera[]>(STORAGE_KEYS.CCTV, INITIAL_CCTV_CAMERAS),
  setCctv: (data: CctvCamera[]) => setStoredItem(STORAGE_KEYS.CCTV, data),

  getAuditLogs: (): AuditLog[] => getStoredItem<AuditLog[]>(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS),
  setAuditLogs: (data: AuditLog[]) => setStoredItem(STORAGE_KEYS.AUDIT, data),

  getNotifications: (): NotificationItem[] => getStoredItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS),
  setNotifications: (data: NotificationItem[]) => setStoredItem(STORAGE_KEYS.NOTIFICATIONS, data),

  getCurrentUser: (): User => getStoredItem<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]), // Soniya Kamireddy by default
  setCurrentUser: (user: User) => setStoredItem(STORAGE_KEYS.CURRENT_USER, user),

  getSystemStatus: (): SystemStatus =>
    getStoredItem<SystemStatus>(STORAGE_KEYS.SYSTEM_STATUS, {
      frontendStatus: 'ONLINE',
      backendApiStatus: 'ONLINE',
      mysqlStatus: 'ONLINE',
      aiServiceStatus: 'ONLINE',
      twilioServiceStatus: 'DEMO_MODE',
      aiThreshold: 90,
      activeAlertsCount: 1,
    }),
  setSystemStatus: (status: SystemStatus) => setStoredItem(STORAGE_KEYS.SYSTEM_STATUS, status),

  addAuditLog: (action: string, entity: string, description: string, user?: User) => {
    const currentUser = user || StorageEngine.getCurrentUser();
    const logs = StorageEngine.getAuditLogs();
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userName: currentUser ? currentUser.name : 'System',
      userRole: currentUser ? currentUser.role : 'ADMIN',
      action,
      entity,
      description,
      ipAddress: '192.168.1.100',
    };
    StorageEngine.setAuditLogs([newLog, ...logs]);
  },

  resetToDemoData: () => {
    localStorage.clear();
    setStoredItem(STORAGE_KEYS.USERS, INITIAL_USERS);
    setStoredItem(STORAGE_KEYS.STUDENTS, INITIAL_STUDENT_PROFILES);
    setStoredItem(STORAGE_KEYS.ROOMS, INITIAL_ROOMS);
    setStoredItem(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    setStoredItem(STORAGE_KEYS.PAYMENTS, INITIAL_PAYMENTS);
    setStoredItem(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    setStoredItem(STORAGE_KEYS.MAINTENANCE, INITIAL_MAINTENANCE);
    setStoredItem(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE);
    setStoredItem(STORAGE_KEYS.FOOD_MENU, INITIAL_FOOD_MENU);
    setStoredItem(STORAGE_KEYS.LAUNDRY, INITIAL_LAUNDRY);
    setStoredItem(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    setStoredItem(STORAGE_KEYS.EMERGENCY, INITIAL_EMERGENCY_ALERTS);
    setStoredItem(STORAGE_KEYS.AI_LOGS, INITIAL_AI_DETECTION_LOGS);
    setStoredItem(STORAGE_KEYS.CCTV, INITIAL_CCTV_CAMERAS);
    setStoredItem(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setStoredItem(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },

  resetAll: () => {
    StorageEngine.resetToDemoData();
  },
};
