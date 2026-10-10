'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export interface FileAttachment {
  name: string;
  size: string;
  type: string;
  data?: string;
  uploadedAt: string;
}

export interface BaseEntity {
  id: number;
  date?: string; // YYYY-MM-DD
  year: number;
  month?: number; // 1-12
  quarter?: number; // 1-4
  attachment?: FileAttachment | null;
}

export interface TaxItem extends BaseEntity {
  taxType: string;
  monthName: string;
  planned: number;
  actual: number;
  rate: number;
}

export interface EmploymentItem extends BaseEntity {
  sector: string;
  plannedJobs: number;
  actualJobs: number;
  executionRate: number;
}

export interface BusinessItem extends BaseEntity {
  name: string;
  inn: string;
  entityType: string;
  sector: string;
  employees: number;
  annualRevenue: string;
  status: string;
}

export interface TradeItem extends BaseEntity {
  country: string;
  type: 'Eksport' | 'Import';
  productType: string;
  amount: number;
  volume: string;
}

export interface InvestmentItem extends BaseEntity {
  country: string;
  companyName: string;
  sector: string;
  plannedAmount: number;
  actualAmount: number;
  status: string;
}

export interface PriceItem extends BaseEntity {
  productName: string;
  category: string;
  currentPrice: number;
  prevPrice: number;
  changePercent: number;
  unit: string;
}

export interface DemographicsItem extends BaseEntity {
  totalPopulation: number;
  maleCount: number;
  femaleCount: number;
  birthRate: number;
  deathRate: number;
  marriages: number;
}

export interface MigrationItem extends BaseEntity {
  country: string;
  code: string;
  migrants: number;
  returned: number;
  type: string;
  flag: string;
}

export interface MahallaItem extends BaseEntity {
  name: string;
  chairman: string;
  population: number;
  households: number;
  problemRate: number;
}

export interface EducationItem extends BaseEntity {
  name: string;
  type: 'Maktab' | 'Bog\'cha' | 'Kollej / Texnikum' | 'Maktab-internat';
  capacity: number;
  students: number;
  teachers: number;
  collegeAdmissionPercent: number;
}

export interface HealthItem extends BaseEntity {
  name: string;
  type: 'Markaziy shifoxona' | 'Oilaviy poliklinika' | 'Shoshilinch tibbiy yordam' | 'Qishloq vrachlik punkti' | 'Xususiy klinika';
  beds: number;
  doctors: number;
  dailyPatients: number;
  ambulanceCars: number;
}

export interface ProjectItem extends BaseEntity {
  name: string;
  contractor: string;
  startDate: string;
  budget: number;
  progress: number;
  status: 'Rejalashtirilgan' | 'Jarayonda' | 'Yakunlangan' | 'To\'xtatilgan';
}

export interface EmptyBuildingItem extends BaseEntity {
  name: string;
  buildingType: string;
  area: number;
  address: string;
  ownerType: string;
  condition: string;
  proposedUse: string;
  isOccupied: boolean;
}

export interface MarketItem extends BaseEntity {
  name: string;
  marketType: string;
  totalStalls: number;
  occupiedStalls: number;
  area: number;
  address: string;
  hasParking: boolean;
}

export interface CropItem extends BaseEntity {
  cropType: string;
  plantedArea: number;
  expectedYield: number;
  executionRate: number;
}

export interface GreenItem extends BaseEntity {
  name: string;
  spaceType: string;
  area: number;
  treesPlanted: number;
  plannedTrees: number;
  solarPanels: number;
  solarCapacity: number;
}

export interface DraftItem {
  id: string;
  module:
    | 'tax'
    | 'employment'
    | 'business'
    | 'trade'
    | 'investment'
    | 'price'
    | 'demographics'
    | 'migration'
    | 'mahalla'
    | 'education'
    | 'health'
    | 'project'
    | 'building'
    | 'market'
    | 'crop'
    | 'green';
  moduleTitle: string;
  data: any;
  source: 'AI_PARSER' | 'MANUAL_ENTRY' | 'FILE_UPLOAD';
  confidence?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  warnings?: string[];
}

export type TimeframeMode = 'all' | 'year' | 'quarter' | 'month' | 'day';

interface DataContextType {
  // Global Filters
  timeframe: TimeframeMode;
  setTimeframe: (t: TimeframeMode) => void;
  selectedYear: number;
  setSelectedYear: (y: number) => void;
  selectedQuarter: string; // 'all' | '1' | '2' | '3' | '4'
  setSelectedQuarter: (q: string) => void;
  selectedMonth: number | 'all'; // 1-12 or 'all'
  setSelectedMonth: (m: number | 'all') => void;
  selectedDate: string; // YYYY-MM-DD or ''
  setSelectedDate: (d: string) => void;

  // CRUD Collections
  taxes: TaxItem[];
  employments: EmploymentItem[];
  businesses: BusinessItem[];
  trades: TradeItem[];
  investments: InvestmentItem[];
  prices: PriceItem[];
  demographics: DemographicsItem[];
  migrations: MigrationItem[];
  mahallas: MahallaItem[];
  educations: EducationItem[];
  healths: HealthItem[];
  projects: ProjectItem[];
  buildings: EmptyBuildingItem[];
  markets: MarketItem[];
  crops: CropItem[];
  greenSpaces: GreenItem[];

  // Filtered Collections (Dynamic by active Timeframe)
  filteredTaxes: TaxItem[];
  filteredEmployments: EmploymentItem[];
  filteredBusinesses: BusinessItem[];
  filteredTrades: TradeItem[];
  filteredInvestments: InvestmentItem[];
  filteredPrices: PriceItem[];
  filteredDemographics: DemographicsItem[];
  filteredMigrations: MigrationItem[];
  filteredMahallas: MahallaItem[];
  filteredEducations: EducationItem[];
  filteredHealths: HealthItem[];
  filteredProjects: ProjectItem[];
  filteredBuildings: EmptyBuildingItem[];
  filteredMarkets: MarketItem[];
  filteredCrops: CropItem[];
  filteredGreenSpaces: GreenItem[];

  // Mutators
  addTax: (item: Omit<TaxItem, 'id'>) => void;
  updateTax: (item: TaxItem) => void;
  deleteTax: (id: number) => void;

  addEmployment: (item: Omit<EmploymentItem, 'id'>) => void;
  updateEmployment: (item: EmploymentItem) => void;
  deleteEmployment: (id: number) => void;

  addBusiness: (item: Omit<BusinessItem, 'id'>) => void;
  updateBusiness: (item: BusinessItem) => void;
  deleteBusiness: (id: number) => void;

  addTrade: (item: Omit<TradeItem, 'id'>) => void;
  updateTrade: (item: TradeItem) => void;
  deleteTrade: (id: number) => void;

  addInvestment: (item: Omit<InvestmentItem, 'id'>) => void;
  updateInvestment: (item: InvestmentItem) => void;
  deleteInvestment: (id: number) => void;

  addPrice: (item: Omit<PriceItem, 'id'>) => void;
  updatePrice: (item: PriceItem) => void;
  deletePrice: (id: number) => void;

  addDemographics: (item: Omit<DemographicsItem, 'id'>) => void;
  updateDemographics: (item: DemographicsItem) => void;
  deleteDemographics: (id: number) => void;

  addMigration: (item: Omit<MigrationItem, 'id'>) => void;
  updateMigration: (item: MigrationItem) => void;
  deleteMigration: (id: number) => void;

  addMahalla: (item: Omit<MahallaItem, 'id'>) => void;
  updateMahalla: (item: MahallaItem) => void;
  deleteMahalla: (id: number) => void;

  addEducation: (item: Omit<EducationItem, 'id'>) => void;
  updateEducation: (item: EducationItem) => void;
  deleteEducation: (id: number) => void;

  addHealth: (item: Omit<HealthItem, 'id'>) => void;
  updateHealth: (item: HealthItem) => void;
  deleteHealth: (id: number) => void;

  addProject: (item: Omit<ProjectItem, 'id'>) => void;
  updateProject: (item: ProjectItem) => void;
  deleteProject: (id: number) => void;

  addBuilding: (item: Omit<EmptyBuildingItem, 'id'>) => void;
  updateBuilding: (item: EmptyBuildingItem) => void;
  deleteBuilding: (id: number) => void;

  addMarket: (item: Omit<MarketItem, 'id'>) => void;
  updateMarket: (item: MarketItem) => void;
  deleteMarket: (id: number) => void;

  addCrop: (item: Omit<CropItem, 'id'>) => void;
  updateCrop: (item: CropItem) => void;
  deleteCrop: (id: number) => void;

  addGreenSpace: (item: Omit<GreenItem, 'id'>) => void;
  updateGreenSpace: (item: GreenItem) => void;
  deleteGreenSpace: (id: number) => void;

  // Draft / Review & Approve System
  drafts: DraftItem[];
  pendingDraftsCount: number;
  addDraft: (draft: Omit<DraftItem, 'id' | 'createdAt' | 'status'>) => void;
  approveDraft: (draftId: string) => void;
  approveAllDrafts: () => void;
  rejectDraft: (draftId: string) => void;
  updateDraft: (draftId: string, updatedData: any) => void;
  clearDrafts: () => void;

  // Global Actions
  clearAllData: () => void;
  resetToDefaults: () => void;
  refreshCalculations: () => void;
}

const currentYear = new Date().getFullYear();

// ANGOR TUMANI UCHUN ANIQ VA HAQIQIY BASIK MA'LUMOTLAR
const defaultMahallas: MahallaItem[] = [
  { id: 1, name: "Angor MFY", chairman: "Aliyev Rustam Qodirovich", population: 4250, households: 980, problemRate: 4.2, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-15` },
  { id: 2, name: "Yangiobod MFY", chairman: "Nazarov Shuhrat Ergashovich", population: 3890, households: 890, problemRate: 3.5, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-16` },
  { id: 3, name: "Navro'z MFY", chairman: "Tursunov Bobur Shokirovich", population: 4120, households: 940, problemRate: 5.1, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-18` },
  { id: 4, name: "Gilambob MFY", chairman: "Qosimov Jasur Xolboyevich", population: 3650, households: 830, problemRate: 2.8, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-20` },
  { id: 5, name: "Tallimaron MFY", chairman: "Eshmurodov Dilshod Normatovich", population: 4680, households: 1060, problemRate: 4.8, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-22` },
  { id: 6, name: "Bahor MFY", chairman: "Xoliqova Zulfiya Olimovna", population: 3410, households: 780, problemRate: 3.2, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-25` },
  { id: 7, name: "Qorabayir MFY", chairman: "Rahmatov Sherzod Toirovich", population: 3950, households: 910, problemRate: 6.0, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-28` },
  { id: 8, name: "Do'stlik MFY", chairman: "Bozorov Otabek Mamatovich", population: 4300, households: 990, problemRate: 3.9, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-30` },
];

const totalCalculatedPop = defaultMahallas.reduce((acc, m) => acc + m.population, 0);

const defaultDemographics: DemographicsItem[] = [
  {
    id: 1,
    year: currentYear,
    quarter: 1,
    month: 1,
    date: `${currentYear}-01-01`,
    totalPopulation: totalCalculatedPop,
    maleCount: Math.round(totalCalculatedPop * 0.495),
    femaleCount: Math.round(totalCalculatedPop * 0.505),
    birthRate: 18.4,
    deathRate: 4.2,
    marriages: 240,
  },
];

const defaultEducations: EducationItem[] = [
  { id: 1, name: "Angor tuman 1-sonli umumta'lim maktabi", type: "Maktab", capacity: 960, students: 920, teachers: 68, collegeAdmissionPercent: 82.5, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-10` },
  { id: 2, name: "Angor tuman 2-sonli ixtisoslashtirilgan maktab", type: "Maktab", capacity: 750, students: 710, teachers: 54, collegeAdmissionPercent: 89.0, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-12` },
  { id: 3, name: "Angor tuman 5-sonli umumta'lim maktabi", type: "Maktab", capacity: 800, students: 780, teachers: 58, collegeAdmissionPercent: 76.4, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-14` },
  { id: 4, name: "Angor tuman 1-sonli DMTT (Bog'cha)", type: "Bog'cha", capacity: 280, students: 275, teachers: 22, collegeAdmissionPercent: 0, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-15` },
  { id: 5, name: "Angor Agrosanoat va texnologiyalar texnikumi", type: "Kollej / Texnikum", capacity: 600, students: 540, teachers: 42, collegeAdmissionPercent: 65.0, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-18` },
];

const defaultHealths: HealthItem[] = [
  { id: 1, name: "Angor tuman markaziy ko'p tarmoqli shifoxonasi", type: "Markaziy shifoxona", beds: 220, doctors: 58, dailyPatients: 450, ambulanceCars: 8, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-10` },
  { id: 2, name: "Angor 1-sonli markaziy poliklinika", type: "Oilaviy poliklinika", beds: 30, doctors: 32, dailyPatients: 380, ambulanceCars: 4, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-12` },
  { id: 3, name: "Tallimaron oilaviy shifokorlik punkti", type: "Qishloq vrachlik punkti", beds: 10, doctors: 6, dailyPatients: 95, ambulanceCars: 2, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-15` },
  { id: 4, name: "Yangiobod tez tibbiy yordam bo'limi", type: "Shoshilinch tibbiy yordam", beds: 15, doctors: 12, dailyPatients: 140, ambulanceCars: 3, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-18` },
];

const defaultTaxes: TaxItem[] = [
  { id: 1, taxType: "Qo'shilgan qiymat solig'i (QQS)", monthName: "Yanvar", planned: 2500000000, actual: 2420000000, rate: 96.8, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-31` },
  { id: 2, taxType: "Foyda solig'i", monthName: "Yanvar", planned: 1800000000, actual: 1780000000, rate: 98.9, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-31` },
  { id: 3, taxType: "Mol-mulk solig'i", monthName: "Yanvar", planned: 850000000, actual: 810000000, rate: 95.3, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-31` },
  { id: 4, taxType: "Jismoniy shaxslar daromad solig'i (JSHDS)", monthName: "Fevral", planned: 1950000000, actual: 1980000000, rate: 101.5, year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-28` },
  { id: 5, taxType: "Yer solig'i", monthName: "Fevral", planned: 720000000, actual: 735000000, rate: 102.1, year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-28` },
];

const defaultEmployments: EmploymentItem[] = [
  { id: 1, sector: "Kichik biznes va xususiy tadbirkorlik", plannedJobs: 1200, actualJobs: 1260, executionRate: 105.0, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-31` },
  { id: 2, sector: "Qishloq xo'jaligi va agrosanoat", plannedJobs: 950, actualJobs: 980, executionRate: 103.2, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-31` },
  { id: 3, sector: "Xizmat ko'rsatish va servis sohalari", plannedJobs: 800, actualJobs: 830, executionRate: 103.8, year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-28` },
  { id: 4, sector: "Sanoat va qayta ishlash korxonalari", plannedJobs: 650, actualJobs: 610, executionRate: 93.8, year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-28` },
];

const defaultBusinesses: BusinessItem[] = [
  { id: 1, name: "Angor Agro Klaster MCHJ", inn: "308456123", entityType: "MCHJ", sector: "Agrosanoat va qayta ishlash", employees: 210, annualRevenue: "18.5 mlrd so'm", status: "Faol", year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-10` },
  { id: 2, name: "Surxon Surxondaryo To'qimachilik XK", inn: "305112445", entityType: "XK", sector: "To'qimachilik sanoati", employees: 95, annualRevenue: "6.2 mlrd so'm", status: "Faol", year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-12` },
  { id: 3, name: "Angor Nurli Kelajak Savdo MCHJ", inn: "302998877", entityType: "MCHJ", sector: "Savdo va logistika", employees: 45, annualRevenue: "3.8 mlrd so'm", status: "Faol", year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-15` },
  { id: 4, name: "YTT Omonov Sardor", inn: "587123984", entityType: "YTT", sector: "Maishiy xizmat", employees: 8, annualRevenue: "480 mln so'm", status: "Faol", year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-20` },
];

const defaultTrades: TradeItem[] = [
  { id: 1, country: "Rossiya Federatsiyasi", type: "Eksport", productType: "Meva-sabzavot va dukkakli mahsulotlar", amount: 4800000, volume: "3,200 tonna", year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-20` },
  { id: 2, country: "Qozog'iston", type: "Eksport", productType: "To'qimachilik va ip-kalava", amount: 3200000, volume: "850 tonna", year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-25` },
  { id: 3, country: "Xitoy", type: "Import", productType: "Issiqxona va tomchilatib sug'orish uskunalari", amount: 2100000, volume: "45 ta komplekt", year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-10` },
  { id: 4, country: "Afg'oniston", type: "Eksport", productType: "Qurilish materiallari va oziq-ovqat", amount: 1950000, volume: "1,800 tonna", year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-18` },
];

const defaultInvestments: InvestmentItem[] = [
  { id: 1, country: "Turkiya", companyName: "Anadolu Modern Agro Teknoloji", sector: "Intensiv bog'dorchilik va qayta ishlash", plannedAmount: 5000000, actualAmount: 4850000, status: "Amalda", year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-15` },
  { id: 2, country: "Xitoy", companyName: "Sino-Surxon Solar Energy Ltd", sector: "Quyosh elektr stansiyasi", plannedAmount: 8500000, actualAmount: 6200000, status: "Jarayonda", year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-10` },
];

const defaultPrices: PriceItem[] = [
  { id: 1, productName: "Kolip non (1-nav)", category: "Oziq-ovqat", currentPrice: 3000, prevPrice: 3000, changePercent: 0.0, unit: "dona", year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-10` },
  { id: 2, productName: "Mol go'shti (suyaksiz)", category: "Oziq-ovqat", currentPrice: 85000, prevPrice: 82000, changePercent: 3.6, unit: "kg", year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-12` },
  { id: 3, productName: "O'simlik yog'i (paxta)", category: "Oziq-ovqat", currentPrice: 17000, prevPrice: 17500, changePercent: -2.8, unit: "litr", year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-05` },
  { id: 4, productName: "Shakar (mahalliy)", category: "Oziq-ovqat", currentPrice: 13500, prevPrice: 13500, changePercent: 0.0, unit: "kg", year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-10` },
];

const defaultMigrations: MigrationItem[] = [
  { id: 1, country: "Rossiya", code: "RU", migrants: 1450, returned: 210, type: "Mavsumiy mehnat", flag: "🇷🇺", year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-20` },
  { id: 2, country: "Qozog'iston", code: "KZ", migrants: 620, returned: 130, type: "Qurilish va savdo", flag: "🇰🇿", year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-25` },
  { id: 3, country: "Turkiya", code: "TR", migrants: 280, returned: 45, type: "Xizmat ko'rsatish", flag: "🇹🇷", year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-10` },
  { id: 4, country: "Janubiy Koreya", code: "KR", migrants: 140, returned: 18, type: "Ishchi viza (E-9)", flag: "🇰🇷", year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-15` },
];

const defaultProjects: ProjectItem[] = [
  { id: 1, name: "Angor tuman markaziy ko'chalarini asfaltlash va yoritish", contractor: "Surxon Yo'l Qurlish MCHJ", startDate: `${currentYear}-01-15`, budget: 4500000000, progress: 85, status: "Jarayonda", year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-15` },
  { id: 2, name: "Yangiobod MFY yangi oilaviy shifokorlik punkti qurilishi", contractor: "Angor Sanoat Qurilish XK", startDate: `${currentYear}-01-20`, budget: 1800000000, progress: 100, status: "Yakunlangan", year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-20` },
  { id: 3, name: "Tallimaron 14-sonli DMTT binosini rekonstruksiya qilish", contractor: "Zang Stroy Servis MCHJ", startDate: `${currentYear}-02-01`, budget: 2300000000, progress: 60, status: "Jarayonda", year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-01` },
];

const defaultBuildings: EmptyBuildingItem[] = [
  { id: 1, name: "Sobiq paxta tozalash punkti binosi", buildingType: "Ishlab chiqarish maydoni", area: 2400, address: "Angor tumani, Tallimaron MFY", ownerType: "Davlat mulki", condition: "O'rtacha ta'mirtalab", proposedUse: "Kichik sanoat zonasi va tikuvchilik sexi", isOccupied: false, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-10` },
  { id: 2, name: "Eski ma'muriy idora binosi", buildingType: "Ma'muriy bino", area: 650, address: "Angor tumani, Markaziy ko'cha 14", ownerType: "Munitsipal", condition: "Yaxshi", proposedUse: "Yoshlar IT-akademiyasi va kovorking", isOccupied: false, year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-12` },
];

const defaultMarkets: MarketItem[] = [
  { id: 1, name: "Angor tuman markaziy dehqon bozori", marketType: "Oziq-ovqat va qishloq xo'jaligi", totalStalls: 450, occupiedStalls: 410, area: 12500, address: "Angor shaharchasi, Mustaqillik shoh ko'chasi", hasParking: true, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-10` },
  { id: 2, name: "Yangiobod ixtisoslashgan kiyim va maishiy buyumlar bozori", marketType: "Kiyim-kechak va buyum", totalStalls: 220, occupiedStalls: 195, area: 6800, address: "Yangiobod MFY hududi", hasParking: true, year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-15` },
];

const defaultCrops: CropItem[] = [
  { id: 1, cropType: "G'o'za (Paxta)", plantedArea: 5400, expectedYield: 18900, executionRate: 100.0, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-10` },
  { id: 2, cropType: "Kuzgi bug'doy", plantedArea: 4800, expectedYield: 28800, executionRate: 102.5, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-15` },
  { id: 3, cropType: "Meva va sabzavot ekinlari", plantedArea: 2100, expectedYield: 42000, executionRate: 98.4, year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-10` },
];

const defaultGreenSpaces: GreenItem[] = [
  { id: 1, name: "Angor 'Yashil makon' istirohat bog'i", spaceType: "Tuman markaziy istirohat bog'i", area: 18.5, treesPlanted: 14500, plannedTrees: 15000, solarPanels: 48, solarCapacity: 25.0, year: currentYear, quarter: 1, month: 1, date: `${currentYear}-01-15` },
  { id: 2, name: "Tallimaron va Yangiobod avtomobil yo'li yoqasi yashil belbog'i", spaceType: "Himoya ihota daraxtzori", area: 32.0, treesPlanted: 26800, plannedTrees: 28000, solarPanels: 24, solarCapacity: 12.0, year: currentYear, quarter: 1, month: 2, date: `${currentYear}-02-20` },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Global Filters
  const [timeframe, setTimeframe] = useState<TimeframeMode>('year');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Storage helper
  const loadStored = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    try {
      const stored = localStorage.getItem(`eboshqaruv_angor_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  const [taxes, setTaxes] = useState<TaxItem[]>(() => loadStored('taxes', defaultTaxes));
  const [employments, setEmployments] = useState<EmploymentItem[]>(() => loadStored('employments', defaultEmployments));
  const [businesses, setBusinesses] = useState<BusinessItem[]>(() => loadStored('businesses', defaultBusinesses));
  const [trades, setTrades] = useState<TradeItem[]>(() => loadStored('trades', defaultTrades));
  const [investments, setInvestments] = useState<InvestmentItem[]>(() => loadStored('investments', defaultInvestments));
  const [prices, setPrices] = useState<PriceItem[]>(() => loadStored('prices', defaultPrices));
  const [demographics, setDemographics] = useState<DemographicsItem[]>(() => loadStored('demographics', defaultDemographics));
  const [migrations, setMigrations] = useState<MigrationItem[]>(() => loadStored('migrations', defaultMigrations));
  const [mahallas, setMahallas] = useState<MahallaItem[]>(() => loadStored('mahallas', defaultMahallas));
  const [educations, setEducations] = useState<EducationItem[]>(() => loadStored('educations', defaultEducations));
  const [healths, setHealths] = useState<HealthItem[]>(() => loadStored('healths', defaultHealths));
  const [projects, setProjects] = useState<ProjectItem[]>(() => loadStored('projects', defaultProjects));
  const [buildings, setBuildings] = useState<EmptyBuildingItem[]>(() => loadStored('buildings', defaultBuildings));
  const [markets, setMarkets] = useState<MarketItem[]>(() => loadStored('markets', defaultMarkets));
  const [crops, setCrops] = useState<CropItem[]>(() => loadStored('crops', defaultCrops));
  const [greenSpaces, setGreenSpaces] = useState<GreenItem[]>(() => loadStored('greenSpaces', defaultGreenSpaces));
  const [drafts, setDrafts] = useState<DraftItem[]>(() => loadStored('drafts', []));

  // Sync to LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('eboshqaruv_angor_taxes', JSON.stringify(taxes));
      localStorage.setItem('eboshqaruv_angor_employments', JSON.stringify(employments));
      localStorage.setItem('eboshqaruv_angor_businesses', JSON.stringify(businesses));
      localStorage.setItem('eboshqaruv_angor_trades', JSON.stringify(trades));
      localStorage.setItem('eboshqaruv_angor_investments', JSON.stringify(investments));
      localStorage.setItem('eboshqaruv_angor_prices', JSON.stringify(prices));
      localStorage.setItem('eboshqaruv_angor_demographics', JSON.stringify(demographics));
      localStorage.setItem('eboshqaruv_angor_migrations', JSON.stringify(migrations));
      localStorage.setItem('eboshqaruv_angor_mahallas', JSON.stringify(mahallas));
      localStorage.setItem('eboshqaruv_angor_educations', JSON.stringify(educations));
      localStorage.setItem('eboshqaruv_angor_healths', JSON.stringify(healths));
      localStorage.setItem('eboshqaruv_angor_projects', JSON.stringify(projects));
      localStorage.setItem('eboshqaruv_angor_buildings', JSON.stringify(buildings));
      localStorage.setItem('eboshqaruv_angor_markets', JSON.stringify(markets));
      localStorage.setItem('eboshqaruv_angor_crops', JSON.stringify(crops));
      localStorage.setItem('eboshqaruv_angor_greenSpaces', JSON.stringify(greenSpaces));
      localStorage.setItem('eboshqaruv_angor_drafts', JSON.stringify(drafts));
    } catch (e) {
      console.error('LocalStorage saqlashda xatolik:', e);
    }
  }, [
    taxes, employments, businesses, trades, investments, prices,
    demographics, migrations, mahallas, educations, healths,
    projects, buildings, markets, crops, greenSpaces, drafts
  ]);

  // Global Timeframe Filter Helper
  const filterByTimeframe = <T extends BaseEntity>(items: T[]): T[] => {
    if (timeframe === 'all') return items;

    return items.filter(item => {
      // Year check
      if (item.year && item.year !== selectedYear) return false;

      // Day check
      if (timeframe === 'day' && selectedDate) {
        return item.date === selectedDate;
      }

      // Month check
      if (timeframe === 'month' && selectedMonth !== 'all') {
        if (item.month && item.month !== selectedMonth) return false;
      }

      // Quarter check
      if (timeframe === 'quarter' && selectedQuarter !== 'all') {
        const qNum = parseInt(selectedQuarter, 10);
        if (item.quarter && item.quarter !== qNum) return false;
      }

      return true;
    });
  };

  const filteredTaxes = useMemo(() => filterByTimeframe(taxes), [taxes, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredEmployments = useMemo(() => filterByTimeframe(employments), [employments, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredBusinesses = useMemo(() => filterByTimeframe(businesses), [businesses, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredTrades = useMemo(() => filterByTimeframe(trades), [trades, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredInvestments = useMemo(() => filterByTimeframe(investments), [investments, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredPrices = useMemo(() => filterByTimeframe(prices), [prices, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredDemographics = useMemo(() => filterByTimeframe(demographics), [demographics, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredMigrations = useMemo(() => filterByTimeframe(migrations), [migrations, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredMahallas = useMemo(() => filterByTimeframe(mahallas), [mahallas, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredEducations = useMemo(() => filterByTimeframe(educations), [educations, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredHealths = useMemo(() => filterByTimeframe(healths), [healths, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredProjects = useMemo(() => filterByTimeframe(projects), [projects, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredBuildings = useMemo(() => filterByTimeframe(buildings), [buildings, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredMarkets = useMemo(() => filterByTimeframe(markets), [markets, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredCrops = useMemo(() => filterByTimeframe(crops), [crops, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);
  const filteredGreenSpaces = useMemo(() => filterByTimeframe(greenSpaces), [greenSpaces, timeframe, selectedYear, selectedQuarter, selectedMonth, selectedDate]);

  // CRUD Operations with ID Generation
  const getNextId = (list: { id: number }[]) =>
    list.length > 0 ? Math.max(...list.map(i => i.id)) + 1 : 1;

  // Tax
  const addTax = (item: Omit<TaxItem, 'id'>) => setTaxes(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updateTax = (item: TaxItem) => setTaxes(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteTax = (id: number) => setTaxes(prev => prev.filter(i => i.id !== id));

  // Employment
  const addEmployment = (item: Omit<EmploymentItem, 'id'>) => setEmployments(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updateEmployment = (item: EmploymentItem) => setEmployments(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteEmployment = (id: number) => setEmployments(prev => prev.filter(i => i.id !== id));

  // Business
  const addBusiness = (item: Omit<BusinessItem, 'id'>) => setBusinesses(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updateBusiness = (item: BusinessItem) => setBusinesses(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteBusiness = (id: number) => setBusinesses(prev => prev.filter(i => i.id !== id));

  // Trade
  const addTrade = (item: Omit<TradeItem, 'id'>) => setTrades(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updateTrade = (item: TradeItem) => setTrades(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteTrade = (id: number) => setTrades(prev => prev.filter(i => i.id !== id));

  // Investment
  const addInvestment = (item: Omit<InvestmentItem, 'id'>) => setInvestments(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updateInvestment = (item: InvestmentItem) => setInvestments(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteInvestment = (id: number) => setInvestments(prev => prev.filter(i => i.id !== id));

  // Price
  const addPrice = (item: Omit<PriceItem, 'id'>) => setPrices(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updatePrice = (item: PriceItem) => setPrices(prev => prev.map(i => i.id === item.id ? item : i));
  const deletePrice = (id: number) => setPrices(prev => prev.filter(i => i.id !== id));

  // Demographics
  const addDemographics = (item: Omit<DemographicsItem, 'id'>) => setDemographics(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updateDemographics = (item: DemographicsItem) => setDemographics(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteDemographics = (id: number) => setDemographics(prev => prev.filter(i => i.id !== id));

  // Migration
  const addMigration = (item: Omit<MigrationItem, 'id'>) => setMigrations(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updateMigration = (item: MigrationItem) => setMigrations(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteMigration = (id: number) => setMigrations(prev => prev.filter(i => i.id !== id));

  // Mahalla
  const addMahalla = (item: Omit<MahallaItem, 'id'>) => {
    setMahallas(prev => {
      const next = [ { ...item, id: getNextId(prev) }, ...prev ];
      // Update dynamic demographics total
      const totalP = next.reduce((s, m) => s + m.population, 0);
      setDemographics(dPrev => [
        {
          id: dPrev.length > 0 ? dPrev[0].id : 1,
          year: item.year || currentYear,
          quarter: item.quarter || 1,
          month: item.month || 1,
          date: item.date || `${currentYear}-01-01`,
          totalPopulation: totalP,
          maleCount: Math.round(totalP * 0.495),
          femaleCount: Math.round(totalP * 0.505),
          birthRate: 18.4,
          deathRate: 4.2,
          marriages: Math.round(totalP * 0.0075),
        }
      ]);
      return next;
    });
  };

  const updateMahalla = (item: MahallaItem) => {
    setMahallas(prev => {
      const next = prev.map(i => i.id === item.id ? item : i);
      const totalP = next.reduce((s, m) => s + m.population, 0);
      setDemographics(dPrev => [
        {
          id: dPrev.length > 0 ? dPrev[0].id : 1,
          year: item.year || currentYear,
          quarter: item.quarter || 1,
          month: item.month || 1,
          date: item.date || `${currentYear}-01-01`,
          totalPopulation: totalP,
          maleCount: Math.round(totalP * 0.495),
          femaleCount: Math.round(totalP * 0.505),
          birthRate: 18.4,
          deathRate: 4.2,
          marriages: Math.round(totalP * 0.0075),
        }
      ]);
      return next;
    });
  };

  const deleteMahalla = (id: number) => {
    setMahallas(prev => {
      const next = prev.filter(i => i.id !== id);
      const totalP = next.reduce((s, m) => s + m.population, 0);
      setDemographics(dPrev => [
        {
          id: dPrev.length > 0 ? dPrev[0].id : 1,
          year: currentYear,
          quarter: 1,
          month: 1,
          date: `${currentYear}-01-01`,
          totalPopulation: totalP,
          maleCount: Math.round(totalP * 0.495),
          femaleCount: Math.round(totalP * 0.505),
          birthRate: 18.4,
          deathRate: 4.2,
          marriages: Math.round(totalP * 0.0075),
        }
      ]);
      return next;
    });
  };

  // Education
  const addEducation = (item: Omit<EducationItem, 'id'>) => setEducations(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updateEducation = (item: EducationItem) => setEducations(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteEducation = (id: number) => setEducations(prev => prev.filter(i => i.id !== id));

  // Health
  const addHealth = (item: Omit<HealthItem, 'id'>) => setHealths(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updateHealth = (item: HealthItem) => setHealths(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteHealth = (id: number) => setHealths(prev => prev.filter(i => i.id !== id));

  // Project
  const addProject = (item: Omit<ProjectItem, 'id'>) => setProjects(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updateProject = (item: ProjectItem) => setProjects(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteProject = (id: number) => setProjects(prev => prev.filter(i => i.id !== id));

  // Buildings
  const addBuilding = (item: Omit<EmptyBuildingItem, 'id'>) => setBuildings(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updateBuilding = (item: EmptyBuildingItem) => setBuildings(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteBuilding = (id: number) => setBuildings(prev => prev.filter(i => i.id !== id));

  // Markets
  const addMarket = (item: Omit<MarketItem, 'id'>) => setMarkets(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updateMarket = (item: MarketItem) => setMarkets(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteMarket = (id: number) => setMarkets(prev => prev.filter(i => i.id !== id));

  // Crops
  const addCrop = (item: Omit<CropItem, 'id'>) => setCrops(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updateCrop = (item: CropItem) => setCrops(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteCrop = (id: number) => setCrops(prev => prev.filter(i => i.id !== id));

  // Green spaces
  const addGreenSpace = (item: Omit<GreenItem, 'id'>) => setGreenSpaces(prev => [ { ...item, id: getNextId(prev) }, ...prev ]);
  const updateGreenSpace = (item: GreenItem) => setGreenSpaces(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteGreenSpace = (id: number) => setGreenSpaces(prev => prev.filter(i => i.id !== id));

  // Draft / Review & Approve System
  const addDraft = (draft: Omit<DraftItem, 'id' | 'createdAt' | 'status'>) => {
    const newDraft: DraftItem = {
      ...draft,
      id: 'draft_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };
    setDrafts(prev => [newDraft, ...prev]);
  };

  const approveDraft = (draftId: string) => {
    const target = drafts.find(d => d.id === draftId);
    if (!target) return;

    const d = target.data;
    switch (target.module) {
      case 'tax': addTax(d); break;
      case 'employment': addEmployment(d); break;
      case 'business': addBusiness(d); break;
      case 'trade': addTrade(d); break;
      case 'investment': addInvestment(d); break;
      case 'price': addPrice(d); break;
      case 'demographics': addDemographics(d); break;
      case 'migration': addMigration(d); break;
      case 'mahalla': addMahalla(d); break;
      case 'education': addEducation(d); break;
      case 'health': addHealth(d); break;
      case 'project': addProject(d); break;
      case 'building': addBuilding(d); break;
      case 'market': addMarket(d); break;
      case 'crop': addCrop(d); break;
      case 'green': addGreenSpace(d); break;
    }

    setDrafts(prev => prev.map(item => item.id === draftId ? { ...item, status: 'APPROVED' } : item));
  };

  const approveAllDrafts = () => {
    const pendingList = drafts.filter(d => d.status === 'PENDING');
    pendingList.forEach(item => {
      const d = item.data;
      switch (item.module) {
        case 'tax': addTax(d); break;
        case 'employment': addEmployment(d); break;
        case 'business': addBusiness(d); break;
        case 'trade': addTrade(d); break;
        case 'investment': addInvestment(d); break;
        case 'price': addPrice(d); break;
        case 'demographics': addDemographics(d); break;
        case 'migration': addMigration(d); break;
        case 'mahalla': addMahalla(d); break;
        case 'education': addEducation(d); break;
        case 'health': addHealth(d); break;
        case 'project': addProject(d); break;
        case 'building': addBuilding(d); break;
        case 'market': addMarket(d); break;
        case 'crop': addCrop(d); break;
        case 'green': addGreenSpace(d); break;
      }
    });

    setDrafts(prev => prev.map(d => d.status === 'PENDING' ? { ...d, status: 'APPROVED' } : d));
  };

  const rejectDraft = (draftId: string) => {
    setDrafts(prev => prev.map(d => d.id === draftId ? { ...d, status: 'REJECTED' } : d));
  };

  const updateDraft = (draftId: string, updatedData: any) => {
    setDrafts(prev => prev.map(d => d.id === draftId ? { ...d, data: updatedData } : d));
  };

  const clearDrafts = () => {
    setDrafts([]);
  };

  const pendingDraftsCount = drafts.filter(d => d.status === 'PENDING').length;

  // Global Actions
  const clearAllData = () => {
    if (typeof window !== 'undefined' && !confirm("Haqiqatdan ham barcha namunaviy ma'lumotlarni tozalab, bo'sh holatga keltirmoqchimisiz?")) {
      return;
    }
    setTaxes([]);
    setEmployments([]);
    setBusinesses([]);
    setTrades([]);
    setInvestments([]);
    setPrices([]);
    setDemographics([]);
    setMigrations([]);
    setMahallas([]);
    setEducations([]);
    setHealths([]);
    setProjects([]);
    setBuildings([]);
    setMarkets([]);
    setCrops([]);
    setGreenSpaces([]);
  };

  const resetToDefaults = () => {
    setTaxes(defaultTaxes);
    setEmployments(defaultEmployments);
    setBusinesses(defaultBusinesses);
    setTrades(defaultTrades);
    setInvestments(defaultInvestments);
    setPrices(defaultPrices);
    setDemographics(defaultDemographics);
    setMigrations(defaultMigrations);
    setMahallas(defaultMahallas);
    setEducations(defaultEducations);
    setHealths(defaultHealths);
    setProjects(defaultProjects);
    setBuildings(defaultBuildings);
    setMarkets(defaultMarkets);
    setCrops(defaultCrops);
    setGreenSpaces(defaultGreenSpaces);
  };

  const refreshCalculations = () => {
    // Triggers recalculation
    const totalP = mahallas.reduce((s, m) => s + m.population, 0);
    if (totalP > 0) {
      setDemographics(dPrev => [
        {
          id: dPrev.length > 0 ? dPrev[0].id : 1,
          year: selectedYear,
          quarter: selectedQuarter !== 'all' ? parseInt(selectedQuarter, 10) : 1,
          month: selectedMonth !== 'all' ? selectedMonth : 1,
          date: `${selectedYear}-01-01`,
          totalPopulation: totalP,
          maleCount: Math.round(totalP * 0.495),
          femaleCount: Math.round(totalP * 0.505),
          birthRate: 18.4,
          deathRate: 4.2,
          marriages: Math.round(totalP * 0.0075),
        }
      ]);
    }
  };

  return (
    <DataContext.Provider
      value={{
        timeframe,
        setTimeframe,
        selectedYear,
        setSelectedYear,
        selectedQuarter,
        setSelectedQuarter,
        selectedMonth,
        setSelectedMonth,
        selectedDate,
        setSelectedDate,

        taxes,
        employments,
        businesses,
        trades,
        investments,
        prices,
        demographics,
        migrations,
        mahallas,
        educations,
        healths,
        projects,
        buildings,
        markets,
        crops,
        greenSpaces,

        filteredTaxes,
        filteredEmployments,
        filteredBusinesses,
        filteredTrades,
        filteredInvestments,
        filteredPrices,
        filteredDemographics,
        filteredMigrations,
        filteredMahallas,
        filteredEducations,
        filteredHealths,
        filteredProjects,
        filteredBuildings,
        filteredMarkets,
        filteredCrops,
        filteredGreenSpaces,

        addTax, updateTax, deleteTax,
        addEmployment, updateEmployment, deleteEmployment,
        addBusiness, updateBusiness, deleteBusiness,
        addTrade, updateTrade, deleteTrade,
        addInvestment, updateInvestment, deleteInvestment,
        addPrice, updatePrice, deletePrice,
        addDemographics, updateDemographics, deleteDemographics,
        addMigration, updateMigration, deleteMigration,
        addMahalla, updateMahalla, deleteMahalla,
        addEducation, updateEducation, deleteEducation,
        addHealth, updateHealth, deleteHealth,
        addProject, updateProject, deleteProject,
        addBuilding, updateBuilding, deleteBuilding,
        addMarket, updateMarket, deleteMarket,
        addCrop, updateCrop, deleteCrop,
        addGreenSpace, updateGreenSpace, deleteGreenSpace,

        drafts,
        pendingDraftsCount,
        addDraft,
        approveDraft,
        approveAllDrafts,
        rejectDraft,
        updateDraft,
        clearDrafts,

        clearAllData,
        resetToDefaults,
        refreshCalculations,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
