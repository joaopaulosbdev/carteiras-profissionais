export interface PharmacistConfirmation {
  id: string;
  fullName: string;
  cpf: string;
  email: string;
  phone: string;
  registrationNumber?: string;
  collegeOrCourse?: string;
  companionsCount: number;
  companionNames?: string[];
  specialNeeds?: string;
  confirmedAt: string;
  qrCodeToken: string;
  checkedIn: boolean;
  checkedInAt?: string;
  notes?: string;
}

export interface EventSettings {
  title: string;
  edition: string;
  date: string;
  time: string;
  doorsOpenTime: string;
  venueName: string;
  venueAddress: string;
  cityState: string;
  maxCompanionsPerPharmacist: number;
  totalCapacity: number;
  dressCode: string;
  contactEmail: string;
  contactPhone: string;
  instructions: string[];
}
