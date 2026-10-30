import type { PharmacistConfirmation, EventSettings } from '../types';

const STORAGE_KEY_CONFIRMATIONS = 'crfal_carteiras_confirmations_v1';
const STORAGE_KEY_SETTINGS = 'crfal_carteiras_settings_v1';

export const DEFAULT_EVENT_SETTINGS: EventSettings = {
  title: 'Solenidade Oficial de Juramento e Entrega de Carteiras Profissionais',
  edition: 'Turma Solene 2026 • CRF/AL',
  date: '2026-11-27',
  time: '19:00',
  doorsOpenTime: '18:00',
  venueName: 'Auditório Nobre do CRF/AL',
  venueAddress: 'Rua Coronel José Francisco Vieira, 102 - Farol',
  cityState: 'Maceió - AL',
  maxCompanionsPerPharmacist: 2,
  totalCapacity: 220,
  dressCode: 'Esporte Fino / Passeio Completo (Solene)',
  contactEmail: 'atendimento@crfal.org.br',
  contactPhone: '(82) 3221-5095',
  instructions: [
    'Apresentar documento de identificação original com foto na recepção.',
    'Chegar com no mínimo 40 minutos de antecedência para assinatura da ata de juramento.',
    'Limite de até 2 acompanhantes por profissional para garantia da capacidade do auditório.',
    'Traje solene obrigatório para a cerimônia de outorga e foto oficial.',
  ],
};

const INITIAL_MOCK_CONFIRMATIONS: PharmacistConfirmation[] = [
  {
    id: 'conf-101',
    fullName: 'Mariana Silveira Cavalcante',
    cpf: '084.721.934-12',
    email: 'mariana.cavalcante@gmail.com',
    phone: '(82) 99654-1234',
    registrationNumber: '6842/AL',
    collegeOrCourse: 'UFAL - Universidade Federal de Alagoas',
    companionsCount: 2,
    companionNames: ['Carlos Alberto Cavalcante', 'Luciana Silveira'],
    specialNeeds: '',
    confirmedAt: '2026-10-25T14:30:00.000Z',
    qrCodeToken: 'CRFAL-2026-MSC-8942',
    checkedIn: true,
    checkedInAt: '2026-10-30T10:15:00.000Z',
  },
  {
    id: 'conf-102',
    fullName: 'Lucas Gabriel Tenório de Albuquerque',
    cpf: '112.458.794-55',
    email: 'lucas.albuquerque.farm@gmail.com',
    phone: '(82) 98845-9876',
    registrationNumber: '6843/AL',
    collegeOrCourse: 'CESMAC',
    companionsCount: 2,
    companionNames: ['Fernanda Tenório', 'Roberto Albuquerque'],
    specialNeeds: '',
    confirmedAt: '2026-10-26T09:15:00.000Z',
    qrCodeToken: 'CRFAL-2026-LGT-3190',
    checkedIn: false,
  },
  {
    id: 'conf-103',
    fullName: 'Beatriz Vasconcelos de Holanda',
    cpf: '045.892.334-80',
    email: 'beatriz.holanda@yahoo.com.br',
    phone: '(82) 99123-4567',
    registrationNumber: '6844/AL',
    collegeOrCourse: 'UNIT Alagoas',
    companionsCount: 1,
    companionNames: ['Eduardo Holanda'],
    specialNeeds: 'Cadeira próxima à saída por gestação',
    confirmedAt: '2026-10-27T16:45:00.000Z',
    qrCodeToken: 'CRFAL-2026-BVH-7521',
    checkedIn: true,
    checkedInAt: '2026-10-30T10:45:00.000Z',
  },
  {
    id: 'conf-104',
    fullName: 'Thiago Alexandre Brandão Rocha',
    cpf: '078.614.904-23',
    email: 'thiago.brandao.farm@outlook.com',
    phone: '(82) 99933-7890',
    registrationNumber: '6845/AL',
    collegeOrCourse: 'UFAL - Campus Arapiraca',
    companionsCount: 2,
    companionNames: ['Marta Brandão', 'José Alexandre Rocha'],
    specialNeeds: '',
    confirmedAt: '2026-10-28T11:20:00.000Z',
    qrCodeToken: 'CRFAL-2026-TAB-4890',
    checkedIn: false,
  },
  {
    id: 'conf-105',
    fullName: 'Camila Mendonça de Paiva',
    cpf: '091.332.884-61',
    email: 'camila.paiva.m@gmail.com',
    phone: '(82) 98711-2244',
    registrationNumber: '6846/AL',
    collegeOrCourse: 'CESMAC',
    companionsCount: 1,
    companionNames: ['Helena Mendonça'],
    specialNeeds: '',
    confirmedAt: '2026-10-29T18:05:00.000Z',
    qrCodeToken: 'CRFAL-2026-CMP-6134',
    checkedIn: false,
  },
];

export const getStoredConfirmations = (): PharmacistConfirmation[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONFIRMATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CONFIRMATIONS, JSON.stringify(INITIAL_MOCK_CONFIRMATIONS));
      return INITIAL_MOCK_CONFIRMATIONS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading confirmations from localStorage', err);
    return INITIAL_MOCK_CONFIRMATIONS;
  }
};

export const saveConfirmation = (data: Omit<PharmacistConfirmation, 'id' | 'confirmedAt' | 'qrCodeToken' | 'checkedIn'>): PharmacistConfirmation => {
  const list = getStoredConfirmations();
  
  // Clean CPF for comparison
  const cleanCpf = data.cpf.replace(/\D/g, '');
  const existingIndex = list.findIndex(item => item.cpf.replace(/\D/g, '') === cleanCpf);
  
  const initials = data.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 3)
    .map(n => n[0].toUpperCase())
    .join('');
  
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const token = `CRFAL-2026-${initials}-${randomSuffix}`;

  if (existingIndex >= 0) {
    // Update existing
    const updated: PharmacistConfirmation = {
      ...list[existingIndex],
      ...data,
      confirmedAt: new Date().toISOString(),
    };
    list[existingIndex] = updated;
    localStorage.setItem(STORAGE_KEY_CONFIRMATIONS, JSON.stringify(list));
    return updated;
  }

  const newRecord: PharmacistConfirmation = {
    ...data,
    id: `conf-${Date.now()}`,
    confirmedAt: new Date().toISOString(),
    qrCodeToken: token,
    checkedIn: false,
  };

  list.unshift(newRecord);
  localStorage.setItem(STORAGE_KEY_CONFIRMATIONS, JSON.stringify(list));
  return newRecord;
};

export const toggleCheckInStatus = (id: string, checkedIn: boolean): PharmacistConfirmation | null => {
  const list = getStoredConfirmations();
  const index = list.findIndex(item => item.id === id);
  if (index === -1) return null;

  list[index].checkedIn = checkedIn;
  list[index].checkedInAt = checkedIn ? new Date().toISOString() : undefined;
  localStorage.setItem(STORAGE_KEY_CONFIRMATIONS, JSON.stringify(list));
  return list[index];
};

export const deleteConfirmation = (id: string): boolean => {
  const list = getStoredConfirmations();
  const filtered = list.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY_CONFIRMATIONS, JSON.stringify(filtered));
  return true;
};

export const findConfirmationByCpfOrEmail = (query: string): PharmacistConfirmation | undefined => {
  const list = getStoredConfirmations();
  const clean = query.trim().toLowerCase();
  const digits = clean.replace(/\D/g, '');

  return list.find(item => {
    const itemDigits = item.cpf.replace(/\D/g, '');
    if (digits.length >= 8 && itemDigits.includes(digits)) return true;
    if (item.email.toLowerCase() === clean) return true;
    if (item.qrCodeToken.toLowerCase() === clean) return true;
    return false;
  });
};

export const getStoredSettings = (): EventSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_EVENT_SETTINGS;
    return { ...DEFAULT_EVENT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_EVENT_SETTINGS;
  }
};

export const saveSettings = (settings: EventSettings): void => {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
};

export const resetToInitialMock = (): void => {
  localStorage.setItem(STORAGE_KEY_CONFIRMATIONS, JSON.stringify(INITIAL_MOCK_CONFIRMATIONS));
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(DEFAULT_EVENT_SETTINGS));
};

export const formatCPF = (val: string): string => {
  const digits = val.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
};

export const formatPhone = (val: string): string => {
  const digits = val.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export const exportToCSV = (confirmations: PharmacistConfirmation[]): void => {
  const headers = [
    'Nome Completo',
    'CPF',
    'E-mail',
    'Telefone / WhatsApp',
    'Inscrição / Protocolo',
    'Instituição de Ensino',
    'Qtd Acompanhantes',
    'Nomes dos Acompanhantes',
    'Necessidade Especial',
    'Data de Confirmação',
    'Token QR Code',
    'Status Presença',
    'Horário de Check-in'
  ];

  const rows = confirmations.map(c => [
    `"${c.fullName.replace(/"/g, '""')}"`,
    `"${c.cpf}"`,
    `"${c.email}"`,
    `"${c.phone}"`,
    `"${c.registrationNumber || ''}"`,
    `"${c.collegeOrCourse || ''}"`,
    c.companionsCount,
    `"${(c.companionNames || []).join(', ').replace(/"/g, '""')}"`,
    `"${(c.specialNeeds || '').replace(/"/g, '""')}"`,
    `"${new Date(c.confirmedAt).toLocaleString('pt-BR')}"`,
    `"${c.qrCodeToken}"`,
    c.checkedIn ? 'PRESENTE' : 'CONFIRMADO',
    c.checkedInAt ? `"${new Date(c.checkedInAt).toLocaleString('pt-BR')}"` : '""'
  ]);

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `confirmados_solenidade_crfal_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
