'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TaxItem {
  id: number;
  taxType: string;
  month: string;
  year: number;
  planned: number;
  actual: number;
  rate: number;
}

export interface EmploymentItem {
  id: number;
  sector: string;
  year: number;
  plannedJobs: number;
  actualJobs: number;
  executionRate: number;
}

export interface BusinessItem {
  id: number;
  name: string;
  inn: string;
  entityType: string;
  sector: string;
  employees: number;
  annualRevenue: string;
  status: string;
}

export interface TradeItem {
  id: number;
  country: string;
  type: string;
  productType: string;
  amount: number;
  volume: string;
  year: number;
}

export interface InvestmentItem {
  id: number;
  country: string;
  companyName: string;
  sector: string;
  plannedAmount: number;
  actualAmount: number;
  status: string;
  year: number;
}

export interface PriceItem {
  id: number;
  productName: string;
  category: string;
  currentPrice: number;
  prevPrice: number;
  changePercent: number;
  unit: string;
}

export interface DemographicsItem {
  id: number;
  year: number;
  quarter: number;
  totalPopulation: number;
  maleCount: number;
  femaleCount: number;
  birthRate: number;
  deathRate: number;
  marriages: number;
}

export interface MigrationItem {
  id: number;
  country: string;
  code: string;
  migrants: number;
  returned: number;
  type: string;
  flag: string;
  year: number;
}

export interface MahallaItem {
  id: number;
  name: string;
  chairman: string;
  population: number;
  households: number;
  problemRate: number;
}

export interface EducationItem {
  id: number;
  name: string;
  type: string;
  capacity: number;
  students: number;
  teachers: number;
  collegeAdmissionPercent: number;
}

export interface HealthItem {
  id: number;
  name: string;
  type: string;
  beds: number;
  doctors: number;
  dailyPatients: number;
  ambulanceCars: number;
}

export interface ProjectItem {
  id: number;
  name: string;
  contractor: string;
  startDate: string;
  budget: number;
  progress: number;
  status: string;
}

export interface EmptyBuildingItem {
  id: number;
  name: string;
  buildingType: string;
  area: number;
  address: string;
  ownerType: string;
  condition: string;
  proposedUse: string;
  isOccupied: boolean;
}

export interface MarketItem {
  id: number;
  name: string;
  marketType: string;
  totalStalls: number;
  occupiedStalls: number;
  area: number;
  address: string;
  hasParking: boolean;
}

export interface CropItem {
  id: number;
  cropType: string;
  plantedArea: number;
  expectedYield: number;
  executionRate: number;
  year: number;
}

export interface GreenItem {
  id: number;
  name: string;
  spaceType: string;
  area: number;
  treesPlanted: number;
  plannedTrees: number;
  solarPanels: number;
  solarCapacity: number;
}

interface DataContextType {
  selectedYear: number;
  setSelectedYear: (y: number) => void;
  selectedQuarter: string;
  setSelectedQuarter: (q: string) => void;

  taxes: TaxItem[];
  setTaxes: React.Dispatch<React.SetStateAction<TaxItem[]>>;
  addTax: (item: Omit<TaxItem, 'id'>) => void;
  updateTax: (item: TaxItem) => void;
  deleteTax: (id: number) => void;

  employments: EmploymentItem[];
  setEmployments: React.Dispatch<React.SetStateAction<EmploymentItem[]>>;
  addEmployment: (item: Omit<EmploymentItem, 'id'>) => void;
  updateEmployment: (item: EmploymentItem) => void;
  deleteEmployment: (id: number) => void;

  businesses: BusinessItem[];
  setBusinesses: React.Dispatch<React.SetStateAction<BusinessItem[]>>;
  addBusiness: (item: Omit<BusinessItem, 'id'>) => void;
  updateBusiness: (item: BusinessItem) => void;
  deleteBusiness: (id: number) => void;

  trades: TradeItem[];
  setTrades: React.Dispatch<React.SetStateAction<TradeItem[]>>;
  addTrade: (item: Omit<TradeItem, 'id'>) => void;
  updateTrade: (item: TradeItem) => void;
  deleteTrade: (id: number) => void;

  investments: InvestmentItem[];
  setInvestments: React.Dispatch<React.SetStateAction<InvestmentItem[]>>;
  addInvestment: (item: Omit<InvestmentItem, 'id'>) => void;
  updateInvestment: (item: InvestmentItem) => void;
  deleteInvestment: (id: number) => void;

  prices: PriceItem[];
  setPrices: React.Dispatch<React.SetStateAction<PriceItem[]>>;
  addPrice: (item: Omit<PriceItem, 'id'>) => void;
  updatePrice: (item: PriceItem) => void;
  deletePrice: (id: number) => void;

  demographics: DemographicsItem[];
  setDemographics: React.Dispatch<React.SetStateAction<DemographicsItem[]>>;
  addDemographics: (item: Omit<DemographicsItem, 'id'>) => void;
  updateDemographics: (item: DemographicsItem) => void;
  deleteDemographics: (id: number) => void;

  migrations: MigrationItem[];
  setMigrations: React.Dispatch<React.SetStateAction<MigrationItem[]>>;
  addMigration: (item: Omit<MigrationItem, 'id'>) => void;
  updateMigration: (item: MigrationItem) => void;
  deleteMigration: (id: number) => void;

  mahallas: MahallaItem[];
  setMahallas: React.Dispatch<React.SetStateAction<MahallaItem[]>>;
  addMahalla: (item: Omit<MahallaItem, 'id'>) => void;
  updateMahalla: (item: MahallaItem) => void;
  deleteMahalla: (id: number) => void;

  educations: EducationItem[];
  setEducations: React.Dispatch<React.SetStateAction<EducationItem[]>>;
  addEducation: (item: Omit<EducationItem, 'id'>) => void;
  updateEducation: (item: EducationItem) => void;
  deleteEducation: (id: number) => void;

  healths: HealthItem[];
  setHealths: React.Dispatch<React.SetStateAction<HealthItem[]>>;
  addHealth: (item: Omit<HealthItem, 'id'>) => void;
  updateHealth: (item: HealthItem) => void;
  deleteHealth: (id: number) => void;

  projects: ProjectItem[];
  setProjects: React.Dispatch<React.SetStateAction<ProjectItem[]>>;
  addProject: (item: Omit<ProjectItem, 'id'>) => void;
  updateProject: (item: ProjectItem) => void;
  deleteProject: (id: number) => void;

  buildings: EmptyBuildingItem[];
  setBuildings: React.Dispatch<React.SetStateAction<EmptyBuildingItem[]>>;
  addBuilding: (item: Omit<EmptyBuildingItem, 'id'>) => void;
  updateBuilding: (item: EmptyBuildingItem) => void;
  deleteBuilding: (id: number) => void;

  markets: MarketItem[];
  setMarkets: React.Dispatch<React.SetStateAction<MarketItem[]>>;
  addMarket: (item: Omit<MarketItem, 'id'>) => void;
  updateMarket: (item: MarketItem) => void;
  deleteMarket: (id: number) => void;

  crops: CropItem[];
  setCrops: React.Dispatch<React.SetStateAction<CropItem[]>>;
  addCrop: (item: Omit<CropItem, 'id'>) => void;
  updateCrop: (item: CropItem) => void;
  deleteCrop: (id: number) => void;

  greenSpaces: GreenItem[];
  setGreenSpaces: React.Dispatch<React.SetStateAction<GreenItem[]>>;
  addGreenSpace: (item: Omit<GreenItem, 'id'>) => void;
  updateGreenSpace: (item: GreenItem) => void;
  deleteGreenSpace: (id: number) => void;

  clearAllData: () => void;
  resetToDefaults: () => void;
  refreshCalculations: () => void;
}

// Dastlabki namunaviy ma'lumotlar
const defaultTaxes: TaxItem[] = [
  { id: 1, taxType: 'QQS', month: 'Yanvar', year: 2024, planned: 2500000000, actual: 2350000000, rate: 94.0 },
  { id: 2, taxType: 'Foyda solig\'i', month: 'Yanvar', year: 2024, planned: 1800000000, actual: 1750000000, rate: 97.2 },
  { id: 3, taxType: 'Mol-mulk solig\'i', month: 'Yanvar', year: 2024, planned: 800000000, actual: 720000000, rate: 90.0 },
  { id: 4, taxType: 'Yer solig\'i', month: 'Yanvar', year: 2024, planned: 600000000, actual: 580000000, rate: 96.7 },
  { id: 5, taxType: 'QQS', month: 'Fevral', year: 2024, planned: 2700000000, actual: 2680000000, rate: 99.3 },
  { id: 6, taxType: 'Foyda solig\'i', month: 'Fevral', year: 2024, planned: 1900000000, actual: 1820000000, rate: 95.8 },
];

const defaultEmployments: EmploymentItem[] = [
  { id: 1, sector: "Kichik biznes va tadbirkorlik", year: 2024, plannedJobs: 1500, actualJobs: 1450, executionRate: 96.6 },
  { id: 2, sector: "Xizmat ko'rsatish va servis", year: 2024, plannedJobs: 2000, actualJobs: 2100, executionRate: 105.0 },
  { id: 3, sector: "Qishloq xo'jaligi va agrosanoat", year: 2024, plannedJobs: 1000, actualJobs: 980, executionRate: 98.0 },
  { id: 4, sector: "Sanoat va ishlab chiqarish", year: 2024, plannedJobs: 800, actualJobs: 820, executionRate: 102.5 },
  { id: 5, sector: "Qurilish va infratuzilma", year: 2024, plannedJobs: 600, actualJobs: 570, executionRate: 95.0 },
];

const defaultBusinesses: BusinessItem[] = [
  { id: 1, name: "Chilonzor Tekstil MCHJ", inn: "302456789", entityType: "MCHJ", sector: "To'qimachilik", employees: 240, annualRevenue: "14.5 mlrd so'm", status: "Faol" },
  { id: 2, name: "Orient Agro Plast XK", inn: "305123987", entityType: "XK", sector: "Qishloq xo'jaligi", employees: 85, annualRevenue: "4.8 mlrd so'm", status: "Faol" },
  { id: 3, name: "Grand Polimer Savdo AJ", inn: "201987654", entityType: "AJ", sector: "Kimyo sanoati", employees: 320, annualRevenue: "28.0 mlrd so'm", status: "Faol" },
  { id: 4, name: "YTT Karimov Dilshod", inn: "587412365", entityType: "YTT", sector: "Savdo va xizmat", employees: 12, annualRevenue: "850 mln so'm", status: "Faol" },
  { id: 5, name: "Smart Auto Servis MCHJ", inn: "308965412", entityType: "MCHJ", sector: "Avtoservis", employees: 45, annualRevenue: "2.1 mlrd so'm", status: "Faol" },
];

const defaultTrades: TradeItem[] = [
  { id: 1, country: "Rossiya", type: "Eksport", productType: "To'qimachilik va ip-kalava", amount: 4800000, volume: "1,200 t", year: 2024 },
  { id: 2, country: "Xitoy", type: "Import", productType: "Asbob-uskunalar va texnika", amount: 8200000, volume: "650 t", year: 2024 },
  { id: 3, country: "Qozog'iston", type: "Eksport", productType: "Qurilish materiallari", amount: 3100000, volume: "4,500 t", year: 2024 },
  { id: 4, country: "Turkiya", type: "Eksport", productType: "Quritilgan mevalar", amount: 2200000, volume: "800 t", year: 2024 },
  { id: 5, country: "Germaniya", type: "Import", productType: "Tibbiyot va farmatsevtika", amount: 1900000, volume: "45 t", year: 2024 },
];

const defaultInvestments: InvestmentItem[] = [
  { id: 1, country: "Germaniya", companyName: "Knauf Gips Toshkent", sector: "Qurilish materiallari", plannedAmount: 15000000, actualAmount: 14200000, status: "Jarayonda", year: 2024 },
  { id: 2, country: "Turkiya", companyName: "Beko Textile Invest", sector: "To'qimachilik", plannedAmount: 8500000, actualAmount: 8500000, status: "Yakunlangan", year: 2024 },
  { id: 3, country: "Xitoy", companyName: "Silk Road Solar Energy", sector: "Yashil energetika", plannedAmount: 22000000, actualAmount: 18000000, status: "Jarayonda", year: 2024 },
  { id: 4, country: "Janubiy Koreya", companyName: "Hansol Medical Tech", sector: "Tibbiy texnika", plannedAmount: 6000000, actualAmount: 4800000, status: "Jarayonda", year: 2024 },
  { id: 5, country: "BAA", companyName: "Emirates Agro Logistics", sector: "Agrologistika", plannedAmount: 12000000, actualAmount: 5000000, status: "Kechikmoqda", year: 2024 },
];

const defaultPrices: PriceItem[] = [
  { id: 1, productName: "Mol go'shti (lahm)", category: "Oziq-ovqat", currentPrice: 85000, prevPrice: 82000, changePercent: 3.6, unit: "kg" },
  { id: 2, productName: "O'simlik yog'i", category: "Oziq-ovqat", currentPrice: 16500, prevPrice: 17200, changePercent: -4.0, unit: "litr" },
  { id: 3, productName: "Shakar", category: "Oziq-ovqat", currentPrice: 13000, prevPrice: 13000, changePercent: 0.0, unit: "kg" },
  { id: 4, productName: "Kartoshka", category: "Qishloq xo'jaligi", currentPrice: 4500, prevPrice: 5000, changePercent: -10.0, unit: "kg" },
  { id: 5, productName: "Un (1-nav)", category: "Oziq-ovqat", currentPrice: 6200, prevPrice: 6000, changePercent: 3.3, unit: "kg" },
  { id: 6, productName: "Benzin AI-92", category: "Yoqilg'i", currentPrice: 10200, prevPrice: 9800, changePercent: 4.1, unit: "litr" },
];

const defaultDemographics: DemographicsItem[] = [
  { id: 1, year: 2024, quarter: 1, totalPopulation: 287450, maleCount: 142100, femaleCount: 145350, birthRate: 21.4, deathRate: 4.8, marriages: 1450 },
  { id: 2, year: 2023, quarter: 4, totalPopulation: 284200, maleCount: 140500, femaleCount: 143700, birthRate: 20.8, deathRate: 4.9, marriages: 1820 },
  { id: 3, year: 2023, quarter: 3, totalPopulation: 281800, maleCount: 139200, femaleCount: 142600, birthRate: 22.1, deathRate: 4.7, marriages: 1640 },
  { id: 4, year: 2023, quarter: 2, totalPopulation: 279500, maleCount: 138100, femaleCount: 141400, birthRate: 19.8, deathRate: 5.0, marriages: 1310 },
];

const defaultMigrations: MigrationItem[] = [
  { id: 1, country: 'Rossiya', code: 'RU', migrants: 8450, returned: 2100, type: 'Mehnat', flag: '🇷🇺', year: 2024 },
  { id: 2, country: 'Qozog\'iston', code: 'KZ', migrants: 1560, returned: 890, type: 'Mehnat', flag: '🇰🇿', year: 2024 },
  { id: 3, country: 'Turkiya', code: 'TR', migrants: 980, returned: 320, type: 'Mehnat', flag: '🇹🇷', year: 2024 },
  { id: 4, country: 'Janubiy Koreya', code: 'KR', migrants: 750, returned: 180, type: 'Mehnat', flag: '🇰🇷', year: 2024 },
  { id: 5, country: 'AQSh', code: 'US', migrants: 320, returned: 45, type: 'Doimiy', flag: '🇺🇸', year: 2024 },
  { id: 6, country: 'Germaniya', code: 'DE', migrants: 180, returned: 30, type: "Ta'lim", flag: '🇩🇪', year: 2024 },
];

const defaultMahallas: MahallaItem[] = [
  { id: 1, name: "Navbahor", chairman: "Azizov Alisher", population: 5420, households: 1250, problemRate: 94.5 },
  { id: 2, name: "Gulshan", chairman: "Karimova Dildora", population: 4800, households: 1100, problemRate: 98.0 },
  { id: 3, name: "Do'stlik", chairman: "Toshmatov Vali", population: 6200, households: 1420, problemRate: 91.2 },
  { id: 4, name: "Alisher Navoiy", chairman: "Nazarov Bobur", population: 7100, households: 1650, problemRate: 96.0 },
  { id: 5, name: "O'zbekiston", chairman: "Eshmurodov Jasur", population: 5900, households: 1380, problemRate: 89.5 },
];

const defaultEducations: EducationItem[] = [
  { id: 1, name: "1-sonli ixtisoslashtirilgan davlat maktabi", type: "Maktab", capacity: 1200, students: 1350, teachers: 82, collegeAdmissionPercent: 92.4 },
  { id: 2, name: "20-sonli umumiy o'rta ta'lim maktabi", type: "Maktab", capacity: 960, students: 890, teachers: 54, collegeAdmissionPercent: 78.0 },
  { id: 3, name: "45-sonli ixtisoslashtirilgan maktab-internat", type: "Internat", capacity: 600, students: 580, teachers: 48, collegeAdmissionPercent: 88.5 },
  { id: 4, name: "12-sonli davlat maktabgacha ta'lim tashkiloti", type: "Bog'cha", capacity: 280, students: 310, teachers: 22, collegeAdmissionPercent: 0 },
  { id: 5, name: "Tuman pedagogika kasb-hunar maktabi", type: "Kollej", capacity: 750, students: 680, teachers: 45, collegeAdmissionPercent: 65.0 },
];

const defaultHealths: HealthItem[] = [
  { id: 1, name: "Tuman markaziy shifoxonasi", type: "Shifoxona", beds: 420, doctors: 95, dailyPatients: 380, ambulanceCars: 14 },
  { id: 2, name: "1-sonli tuman oilaviy poliklinikasi", type: "Poliklinika", beds: 0, doctors: 42, dailyPatients: 520, ambulanceCars: 4 },
  { id: 3, name: "2-sonli tuman oilaviy poliklinikasi", type: "Poliklinika", beds: 0, doctors: 38, dailyPatients: 460, ambulanceCars: 3 },
  { id: 4, name: "Tug'uruq kompleksi", type: "Tug'uruqxona", beds: 150, doctors: 32, dailyPatients: 110, ambulanceCars: 2 },
  { id: 5, name: "Shoshilinch tibbiy yordam markazi", type: "Shoshilinch", beds: 120, doctors: 45, dailyPatients: 190, ambulanceCars: 8 },
];

const defaultProjects: ProjectItem[] = [
  { id: 1, name: "20-umumiy ta'lim maktabi binosini mukammal ta'mirlash", contractor: "Binokor MCHJ", startDate: "10.05.2023", budget: 4500000000, progress: 85, status: "Jarayonda" },
  { id: 2, name: "Yangi ko'p tarmoqli tuman poliklinikasi qurilishi", contractor: "Shahar Qurilish AJ", startDate: "15.01.2023", budget: 8200000000, progress: 100, status: "Yakunlangan" },
  { id: 3, name: "Markaziy istirohat bog'ini obodonlashtirish", contractor: "Yashil Diyor UK", startDate: "01.08.2023", budget: 2100000000, progress: 45, status: "Kechikmoqda" },
  { id: 4, name: "5-sonli maktabgacha ta'lim muassasasi filiali", contractor: "Nurli Qurilish XK", startDate: "20.02.2024", budget: 3200000000, progress: 60, status: "Jarayonda" },
];

const defaultBuildings: EmptyBuildingItem[] = [
  { id: 1, name: "Eski poyabzal fabrikasi binosi", buildingType: "Sanoat", area: 3400, address: "Sanoat ko'chasi 14", ownerType: "Davlat", condition: "O'rtacha", proposedUse: "Kichik sanoat zonasi", isOccupied: false },
  { id: 2, name: "Sobiq ma'muriy bino", buildingType: "Ma'muriy", area: 1200, address: "Navoiy shoh ko'chasi 58", ownerType: "Davlat", condition: "Yaxshi", proposedUse: "IT park filiali", isOccupied: false },
  { id: 3, name: "Omborxona binosi", buildingType: "Logistika", area: 2100, address: "Temiryo'lchilar 2", ownerType: "Xususiy", condition: "Ta'mirtalab", proposedUse: "Agrologistika markazi", isOccupied: false },
];

const defaultMarkets: MarketItem[] = [
  { id: 1, name: "Chilonzor dehqon bozori", marketType: "Dehqon bozori", totalStalls: 650, occupiedStalls: 590, area: 12000, address: "Farhod ko'chasi 1", hasParking: true },
  { id: 2, name: "Qatortol savdo majmuasi", marketType: "Savdo markazi", totalStalls: 420, occupiedStalls: 395, area: 8500, address: "Qatortol ko'chasi 28", hasParking: true },
  { id: 3, name: "Buyum bozori (Eski shahar)", marketType: "Kiyim-kechak", totalStalls: 800, occupiedStalls: 710, area: 15000, address: "Navoiy 105", hasParking: true },
];

const defaultCrops: CropItem[] = [
  { id: 1, cropType: "Paxta", plantedArea: 12500, expectedYield: 45000, executionRate: 98.2, year: 2024 },
  { id: 2, cropType: "G'alla", plantedArea: 18200, expectedYield: 72000, executionRate: 104.5, year: 2024 },
  { id: 3, cropType: "Sabzavotlar", plantedArea: 6400, expectedYield: 38000, executionRate: 95.0, year: 2024 },
  { id: 4, cropType: "Poliz ekinlari", plantedArea: 3100, expectedYield: 22000, executionRate: 101.0, year: 2024 },
];

const defaultGreenSpaces: GreenItem[] = [
  { id: 1, name: "Yangi O'zbekiston bog'i tumani qismi", spaceType: "Bog'", area: 45.0, treesPlanted: 18500, plannedTrees: 20000, solarPanels: 120, solarCapacity: 48.0 },
  { id: 2, name: "Chilonzor yashil belbog'i", spaceType: "Ko'kalamzor", area: 28.5, treesPlanted: 12400, plannedTrees: 15000, solarPanels: 45, solarCapacity: 18.0 },
  { id: 3, name: "Bunyodkor shoh ko'chasi xiyoboni", spaceType: "Xiyobon", area: 12.0, treesPlanted: 6200, plannedTrees: 6500, solarPanels: 80, solarCapacity: 32.0 },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedQuarter, setSelectedQuarter] = useState<string>('Barcha choraklar');

  const [taxes, setTaxes] = useState<TaxItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_taxes');
      if (saved) return JSON.parse(saved);
    }
    return defaultTaxes;
  });

  const [employments, setEmployments] = useState<EmploymentItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_employments');
      if (saved) return JSON.parse(saved);
    }
    return defaultEmployments;
  });

  const [businesses, setBusinesses] = useState<BusinessItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_businesses');
      if (saved) return JSON.parse(saved);
    }
    return defaultBusinesses;
  });

  const [trades, setTrades] = useState<TradeItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_trades');
      if (saved) return JSON.parse(saved);
    }
    return defaultTrades;
  });

  const [investments, setInvestments] = useState<InvestmentItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_investments');
      if (saved) return JSON.parse(saved);
    }
    return defaultInvestments;
  });

  const [prices, setPrices] = useState<PriceItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_prices');
      if (saved) return JSON.parse(saved);
    }
    return defaultPrices;
  });

  const [demographics, setDemographics] = useState<DemographicsItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_demographics');
      if (saved) return JSON.parse(saved);
    }
    return defaultDemographics;
  });

  const [migrations, setMigrations] = useState<MigrationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_migrations');
      if (saved) return JSON.parse(saved);
    }
    return defaultMigrations;
  });

  const [mahallas, setMahallas] = useState<MahallaItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_mahallas');
      if (saved) return JSON.parse(saved);
    }
    return defaultMahallas;
  });

  const [educations, setEducations] = useState<EducationItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_educations');
      if (saved) return JSON.parse(saved);
    }
    return defaultEducations;
  });

  const [healths, setHealths] = useState<HealthItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_healths');
      if (saved) return JSON.parse(saved);
    }
    return defaultHealths;
  });

  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_projects');
      if (saved) return JSON.parse(saved);
    }
    return defaultProjects;
  });

  const [buildings, setBuildings] = useState<EmptyBuildingItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_buildings');
      if (saved) return JSON.parse(saved);
    }
    return defaultBuildings;
  });

  const [markets, setMarkets] = useState<MarketItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_markets');
      if (saved) return JSON.parse(saved);
    }
    return defaultMarkets;
  });

  const [crops, setCrops] = useState<CropItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_crops');
      if (saved) return JSON.parse(saved);
    }
    return defaultCrops;
  });

  const [greenSpaces, setGreenSpaces] = useState<GreenItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('eb_greenSpaces');
      if (saved) return JSON.parse(saved);
    }
    return defaultGreenSpaces;
  });

  // LocalStorage saqlash
  useEffect(() => { localStorage.setItem('eb_taxes', JSON.stringify(taxes)); }, [taxes]);
  useEffect(() => { localStorage.setItem('eb_employments', JSON.stringify(employments)); }, [employments]);
  useEffect(() => { localStorage.setItem('eb_businesses', JSON.stringify(businesses)); }, [businesses]);
  useEffect(() => { localStorage.setItem('eb_trades', JSON.stringify(trades)); }, [trades]);
  useEffect(() => { localStorage.setItem('eb_investments', JSON.stringify(investments)); }, [investments]);
  useEffect(() => { localStorage.setItem('eb_prices', JSON.stringify(prices)); }, [prices]);
  useEffect(() => { localStorage.setItem('eb_demographics', JSON.stringify(demographics)); }, [demographics]);
  useEffect(() => { localStorage.setItem('eb_migrations', JSON.stringify(migrations)); }, [migrations]);
  useEffect(() => { localStorage.setItem('eb_mahallas', JSON.stringify(mahallas)); }, [mahallas]);
  useEffect(() => { localStorage.setItem('eb_educations', JSON.stringify(educations)); }, [educations]);
  useEffect(() => { localStorage.setItem('eb_healths', JSON.stringify(healths)); }, [healths]);
  useEffect(() => { localStorage.setItem('eb_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('eb_buildings', JSON.stringify(buildings)); }, [buildings]);
  useEffect(() => { localStorage.setItem('eb_markets', JSON.stringify(markets)); }, [markets]);
  useEffect(() => { localStorage.setItem('eb_crops', JSON.stringify(crops)); }, [crops]);
  useEffect(() => { localStorage.setItem('eb_greenSpaces', JSON.stringify(greenSpaces)); }, [greenSpaces]);

  // CRUD helpers
  const addTax = (item: Omit<TaxItem, 'id'>) => setTaxes(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateTax = (item: TaxItem) => setTaxes(prev => prev.map(t => t.id === item.id ? item : t));
  const deleteTax = (id: number) => setTaxes(prev => prev.filter(t => t.id !== id));

  const addEmployment = (item: Omit<EmploymentItem, 'id'>) => setEmployments(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateEmployment = (item: EmploymentItem) => setEmployments(prev => prev.map(e => e.id === item.id ? item : e));
  const deleteEmployment = (id: number) => setEmployments(prev => prev.filter(e => e.id !== id));

  const addBusiness = (item: Omit<BusinessItem, 'id'>) => setBusinesses(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateBusiness = (item: BusinessItem) => setBusinesses(prev => prev.map(b => b.id === item.id ? item : b));
  const deleteBusiness = (id: number) => setBusinesses(prev => prev.filter(b => b.id !== id));

  const addTrade = (item: Omit<TradeItem, 'id'>) => setTrades(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateTrade = (item: TradeItem) => setTrades(prev => prev.map(t => t.id === item.id ? item : t));
  const deleteTrade = (id: number) => setTrades(prev => prev.filter(t => t.id !== id));

  const addInvestment = (item: Omit<InvestmentItem, 'id'>) => setInvestments(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateInvestment = (item: InvestmentItem) => setInvestments(prev => prev.map(i => i.id === item.id ? item : i));
  const deleteInvestment = (id: number) => setInvestments(prev => prev.filter(i => i.id !== id));

  const addPrice = (item: Omit<PriceItem, 'id'>) => setPrices(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updatePrice = (item: PriceItem) => setPrices(prev => prev.map(p => p.id === item.id ? item : p));
  const deletePrice = (id: number) => setPrices(prev => prev.filter(p => p.id !== id));

  const addDemographics = (item: Omit<DemographicsItem, 'id'>) => setDemographics(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateDemographics = (item: DemographicsItem) => setDemographics(prev => prev.map(d => d.id === item.id ? item : d));
  const deleteDemographics = (id: number) => setDemographics(prev => prev.filter(d => d.id !== id));

  const addMigration = (item: Omit<MigrationItem, 'id'>) => setMigrations(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateMigration = (item: MigrationItem) => setMigrations(prev => prev.map(m => m.id === item.id ? item : m));
  const deleteMigration = (id: number) => setMigrations(prev => prev.filter(m => m.id !== id));

  const addMahalla = (item: Omit<MahallaItem, 'id'>) => setMahallas(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateMahalla = (item: MahallaItem) => setMahallas(prev => prev.map(m => m.id === item.id ? item : m));
  const deleteMahalla = (id: number) => setMahallas(prev => prev.filter(m => m.id !== id));

  const addEducation = (item: Omit<EducationItem, 'id'>) => setEducations(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateEducation = (item: EducationItem) => setEducations(prev => prev.map(e => e.id === item.id ? item : e));
  const deleteEducation = (id: number) => setEducations(prev => prev.filter(e => e.id !== id));

  const addHealth = (item: Omit<HealthItem, 'id'>) => setHealths(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateHealth = (item: HealthItem) => setHealths(prev => prev.map(h => h.id === item.id ? item : h));
  const deleteHealth = (id: number) => setHealths(prev => prev.filter(h => h.id !== id));

  const addProject = (item: Omit<ProjectItem, 'id'>) => setProjects(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateProject = (item: ProjectItem) => setProjects(prev => prev.map(p => p.id === item.id ? item : p));
  const deleteProject = (id: number) => setProjects(prev => prev.filter(p => p.id !== id));

  const addBuilding = (item: Omit<EmptyBuildingItem, 'id'>) => setBuildings(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateBuilding = (item: EmptyBuildingItem) => setBuildings(prev => prev.map(b => b.id === item.id ? item : b));
  const deleteBuilding = (id: number) => setBuildings(prev => prev.filter(b => b.id !== id));

  const addMarket = (item: Omit<MarketItem, 'id'>) => setMarkets(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateMarket = (item: MarketItem) => setMarkets(prev => prev.map(m => m.id === item.id ? item : m));
  const deleteMarket = (id: number) => setMarkets(prev => prev.filter(m => m.id !== id));

  const addCrop = (item: Omit<CropItem, 'id'>) => setCrops(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateCrop = (item: CropItem) => setCrops(prev => prev.map(c => c.id === item.id ? item : c));
  const deleteCrop = (id: number) => setCrops(prev => prev.filter(c => c.id !== id));

  const addGreenSpace = (item: Omit<GreenItem, 'id'>) => setGreenSpaces(prev => [{ id: Date.now(), ...item }, ...prev]);
  const updateGreenSpace = (item: GreenItem) => setGreenSpaces(prev => prev.map(g => g.id === item.id ? item : g));
  const deleteGreenSpace = (id: number) => setGreenSpaces(prev => prev.filter(g => g.id !== id));

  const clearAllData = () => {
    if (confirm("Barcha taxminiy ma'lumotlarni o'chirib, toza holda yangidan kiritmoqchimisiz?")) {
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
      localStorage.clear();
      alert("Barcha ma'lumotlar tozalandi. Endi o'zingizning haqiqiy ma'lumotlaringizni kiritishingiz mumkin!");
    }
  };

  const resetToDefaults = () => {
    if (confirm("Namunaviy ko'rsatkichlarni qayta tiklamoqchimisiz?")) {
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
      alert("Namunaviy ma'lumotlar tiklandi!");
    }
  };

  const refreshCalculations = () => {
    alert("Barcha bo'limlar bo'yicha ko'rsatkichlar va boshqaruv paneli qayta hisoblandi!");
  };

  return (
    <DataContext.Provider
      value={{
        selectedYear,
        setSelectedYear,
        selectedQuarter,
        setSelectedQuarter,
        taxes, setTaxes, addTax, updateTax, deleteTax,
        employments, setEmployments, addEmployment, updateEmployment, deleteEmployment,
        businesses, setBusinesses, addBusiness, updateBusiness, deleteBusiness,
        trades, setTrades, addTrade, updateTrade, deleteTrade,
        investments, setInvestments, addInvestment, updateInvestment, deleteInvestment,
        prices, setPrices, addPrice, updatePrice, deletePrice,
        demographics, setDemographics, addDemographics, updateDemographics, deleteDemographics,
        migrations, setMigrations, addMigration, updateMigration, deleteMigration,
        mahallas, setMahallas, addMahalla, updateMahalla, deleteMahalla,
        educations, setEducations, addEducation, updateEducation, deleteEducation,
        healths, setHealths, addHealth, updateHealth, deleteHealth,
        projects, setProjects, addProject, updateProject, deleteProject,
        buildings, setBuildings, addBuilding, updateBuilding, deleteBuilding,
        markets, setMarkets, addMarket, updateMarket, deleteMarket,
        crops, setCrops, addCrop, updateCrop, deleteCrop,
        greenSpaces, setGreenSpaces, addGreenSpace, updateGreenSpace, deleteGreenSpace,
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
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
