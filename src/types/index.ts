export type Currency = 'ARS' | 'BRL' | 'UYU' | 'PYG';
export type Language = 'es' | 'pt';
export type TransportType = 'flight' | 'bus';
export type TimeOfDay = 'all' | 'morning' | 'afternoon' | 'night';
export type ReservationStatus = 
  | 'pending_payment' // Plazo 24hs
  | 'confirmed_paid'  // Pagada
  | 'modified'        // Modificada
  | 'refund_requested'// Solicitud de cancelación/reembolso
  | 'refunded'        // Reembolsada
  | 'cancelled';      // Cancelada sin pago / expirada

export type UserRole = 'client' | 'support_agent' | 'agency_admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  docType: string;
  docNumber: string;
  phone: string;
  country: string;
  role: UserRole;
  isRegistered: boolean;
}

export interface Passenger {
  id: string;
  fullName: string;
  docType: string;
  docNumber: string;
  seatCode: string;
}

export interface PackageOffer {
  id: string;
  code: string;
  title: string;
  titlePt: string;
  origin: string;
  originCity: string;
  destination: string;
  destinationCity: string;
  destinationCountry: 'Argentina' | 'Brasil' | 'Uruguay' | 'Paraguay';
  transportType: TransportType;
  carrierName: string;
  carrierCode: string;
  departureTime: string; // e.g., "08:30"
  arrivalTime: string;   // e.g., "11:45"
  timeSlot: 'morning' | 'afternoon' | 'night';
  duration: string;
  date: string;
  priceUSD: number; // Base reference price in USD
  availableSeats: number;
  totalSeats: number;
  isPackage: boolean;
  packageDetails?: {
    hotelName: string;
    hotelStars: number;
    nights: number;
    includesBreakfast: boolean;
    transfersIncluded: boolean;
    excursionIncluded?: string;
  };
  promotionTag?: string;
  promotionDiscountPercent?: number;
  image: string;
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  titlePt: string;
  discountPercent: number;
  applicableDestinations: string[]; // ['all'] or city names
  validUntil: string;
  active: boolean;
}

export interface Reservation {
  id: string;
  bookingCode: string; // e.g., "VM-89241"
  userId: string;
  userEmail: string;
  userName: string;
  packageId: string;
  packageSnapshot: PackageOffer;
  travelDate: string;
  travelTime: string;
  seatCodes: string[];
  passengers: Passenger[];
  totalAmountUSD: number;
  paidAmountLocal?: number;
  paidCurrency?: Currency;
  status: ReservationStatus;
  createdAt: string; // ISO string
  paymentDeadline: string; // ISO string 24hs from creation
  paymentDetails?: {
    method: 'credit_card' | 'debit_card' | 'paypal';
    cardLast4?: string;
    cardHolder?: string;
    paypalEmail?: string;
    paidAt: string;
    authTransactionId: string;
    tokenApproved: boolean;
  };
  refundRequest?: {
    requestedAt: string;
    reason: string;
    percentage: number; // 100, 50, or 0
    estimatedRefundUSD: number;
    status: 'pending' | 'approved' | 'rejected';
    adminNotes?: string;
  };
  modificationsHistory?: {
    previousDate: string;
    previousSeats: string[];
    modifiedAt: string;
    modificationFeeUSD: number;
  }[];
}

export interface SupportMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'booking' | 'payment' | 'refund' | 'schedule' | 'general';
  status: 'open' | 'attending' | 'resolved';
  isLiveChat: boolean;
  isOffHoursForm?: boolean;
  messages: SupportMessage[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'payment_reminder' | 'payment_success' | 'schedule_change' | 'offer' | 'refund_status' | 'booking_modified';
  channel: 'push' | 'email';
  timestamp: string;
  read: boolean;
  relatedReservationCode?: string;
}

export interface NotificationSettings {
  pushEnabled: boolean;
  emailEnabled: boolean;
  flightScheduleChanges: boolean;
  promotionsAndOffers: boolean;
  payment24hReminder: boolean;
  refundAndCancellations: boolean;
}
