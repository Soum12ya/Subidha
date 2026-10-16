export type UserRole = 'customer' | 'business';

export interface CustomerProfile {
  id: string;
  role: 'customer';
  fullName: string;
  phone: string; // 10-digit Indian phone number
  email?: string;
  city: string;
  preferredLanguage: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  subscriptionPlanId: string;
  subscriptionValidUntil: string;
  createdAt: string;
}

export interface BusinessProfile {
  id: string;
  role: 'business';
  businessName: string;
  contactPersonName: string;
  phone: string; // 10-digit Indian phone number
  businessEmail: string;
  businessCategory: string;
  city: string;
  businessAddress: string;
  operationalSize: string;
  subscriptionPlanId: string;
  billingFrequency: 'Monthly' | 'Annual';
  includedCapacity: number;
  usedCapacity: number;
  createdAt: string;
}

export type AppUser = CustomerProfile | BusinessProfile;

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: 'personal' | 'escort' | 'errands' | 'tourist' | 'logistics' | 'transport';
  audience: 'customer' | 'business' | 'both';
  shortDescription: string;
  fullDescription: string;
  estimatedDuration: string;
  baseCoverageNote: string;
  externalExpenseNote: string;
  iconName: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  audience: 'customer' | 'tourist' | 'business' | 'enterprise';
  priceDisplay: string;
  billingPeriod: string;
  badge?: string;
  description: string;
  features: string[];
  externalExpensePolicy: string;
}

export type BookingStatus = 'Requested' | 'Scheduled' | 'In Progress' | 'Completed';

export interface CustomerBooking {
  id: string;
  customerId: string;
  serviceId: string;
  serviceTitle: string;
  preferredDate: string;
  preferredTime: string;
  pickupLocation: string;
  dropOrVenueLocation?: string;
  instructions: string;
  status: BookingStatus;
  assignedAgentPlaceholder: string;
  createdAt: string;
}

export type TaskPriority = 'Standard' | 'High' | 'Urgent';
export type TaskStatus = 'Queued' | 'Assigned' | 'In Transit' | 'Completed';

export interface BusinessTask {
  id: string;
  businessId: string;
  taskCategory: string;
  pickupOrigin: string;
  destination: string;
  assignedAgentId?: string;
  assignedAgentName: string;
  priority: TaskPriority;
  status: TaskStatus;
  notes?: string;
  createdDate: string;
}

export interface FieldAgent {
  id: string;
  agentCode: string;
  name: string;
  availability: 'Available' | 'On Active Task' | 'Standby';
  currentTaskId?: string;
  specialization: string;
  demoRating: string;
}

export interface PhoneLookupResponse {
  exists: boolean;
  role: UserRole;
  phone: string;
  maskedPhone?: string;
  message: string;
}

export interface OtpVerifyResponse {
  success: boolean;
  user?: AppUser;
  error?: string;
}