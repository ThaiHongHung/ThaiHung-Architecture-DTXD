
export enum FoundationType {
  SINGLE = 'Móng đơn (30%)',
  STRIP = 'Móng băng (50%)',
  PILE = 'Móng cọc (40%)',
  RAFT = 'Móng bè (100%)'
}

export enum BasementType {
  NONE = 'Không hầm',
  SEMI = 'Bán hầm (<1.5m)',
  NORMAL = 'Hầm (1.5-2.0m)',
  DEEP = 'Hầm sâu (>2.0m)'
}

export enum RoofType {
  IRON_SHEET = 'Mái Tôn',
  CONCRETE = 'Mái BTCT',
  TILE_IRON = 'Ngói kèo sắt',
  TILE_CONCRETE = 'Ngói BTCT'
}

export enum RoadWidth {
  LARGE = '> 5m (Xe tải)',
  MEDIUM = '3m - 5m',
  SMALL = '< 3m (Ba gác)'
}

export enum NeighborType {
  FULL = 'Đã có nhà kín 2 bên',
  ONE_SIDE = 'Đất trống 1 bên',
  EMPTY = 'Đất trống 2 bên'
}

export enum FacadeCount {
  ONE = '1 Mặt tiền',
  TWO = '2 Mặt tiền',
  THREE = '3 Mặt tiền'
}

export interface InputData {
  width: number;
  length: number;
  floors: number;
  basement: BasementType;
  foundation: FoundationType;
  hasTum: boolean;
  tumArea: number;
  roof: RoofType;
  facades: FacadeCount;
  road: RoadWidth;
  neighbors: NeighborType;
  hasElevator: boolean;
  elevatorStops: number;
  hasPool: boolean;
  poolArea: number;
}

export interface PriceConfig {
  ECO: number;
  STD: number;
  LUX: number;
}

export interface AreaBreakdown {
  landArea: number;
  foundationArea: number;
  basementArea: number;
  mainFloorArea: number;
  roofTumArea: number;
  totalConvertedArea: number;
}

export interface CostBreakdown {
  packageType: 'Eco' | 'Std' | 'Lux';
  packageName: string;
  basePrice: number;
  kFactor: number;
  finalUnitPrice: number;
  constructionCost: number;
  elevatorCost: number;
  poolCost: number;
  totalCost: number;
  colorTheme: string;
  isRecommended: boolean;
}
