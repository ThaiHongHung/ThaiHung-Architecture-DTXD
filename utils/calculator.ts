import { BASEMENT_PERCENT, ELEVATOR_BASE_COST, ELEVATOR_STOP_COST, FACADE_K, FOUNDATION_PERCENT, NEIGHBOR_K, POOL_UNIT_COST, ROAD_K, ROOF_PERCENT } from "../constants";
import { AreaBreakdown, CostBreakdown, InputData, PriceConfig } from "../types";

export const calculateAreas = (data: InputData): AreaBreakdown => {
  const landArea = data.width * data.length;
  
  // Móng
  const foundationArea = landArea * FOUNDATION_PERCENT[data.foundation];

  // Hầm
  const basementArea = landArea * BASEMENT_PERCENT[data.basement];

  // Thân (Trệt + Lầu)
  // "Số tầng lầu" usually means levels above ground floor. 
  // Formula: S_Dat * (1 [Trệt] + Số lầu) * 100%
  const mainFloorArea = landArea * (1 + data.floors);

  // Mái & Tum
  let roofTumArea = 0;
  const roofCoeff = ROOF_PERCENT[data.roof];

  if (data.hasTum) {
    // S_Mai_Tum = (Diện tích Tum * 100%) + ((S_Dat - Diện tích Tum) * 50% [Sân thượng]) + (Diện tích Tum * %Vật_Liệu_Mái)
    // Note: The prompt explicitly defines this formula.
    const terraceArea = Math.max(0, landArea - data.tumArea);
    roofTumArea = (data.tumArea * 1.0) + (terraceArea * 0.5) + (data.tumArea * roofCoeff);
  } else {
    // Nếu không Tum: S_Dat * %Vật_Liệu_Mái
    roofTumArea = landArea * roofCoeff;
  }

  const totalConvertedArea = foundationArea + basementArea + mainFloorArea + roofTumArea;

  return {
    landArea,
    foundationArea,
    basementArea,
    mainFloorArea,
    roofTumArea,
    totalConvertedArea
  };
};

export const calculateCosts = (data: InputData, areas: AreaBreakdown, prices: PriceConfig): CostBreakdown[] => {
  // 1. Calculate K Factor
  // Total_K = 1 + K_MatTien + K_Duong + K_HangXom
  const kFac = 1 + FACADE_K[data.facades] + ROAD_K[data.road] + NEIGHBOR_K[data.neighbors];

  // 2. Add-on Costs
  let elevatorCost = 0;
  if (data.hasElevator) {
    const extraStops = Math.max(0, data.elevatorStops - 3);
    elevatorCost = ELEVATOR_BASE_COST + (extraStops * ELEVATOR_STOP_COST);
  }

  let poolCost = 0;
  if (data.hasPool) {
    poolCost = data.poolArea * POOL_UNIT_COST;
  }

  // 3. Generate Packages
  const packages: CostBreakdown[] = [
    {
      packageType: 'Eco',
      packageName: 'Gói Tiết Kiệm',
      basePrice: prices.ECO,
      kFactor: kFac,
      finalUnitPrice: prices.ECO * kFac,
      constructionCost: areas.totalConvertedArea * (prices.ECO * kFac),
      elevatorCost,
      poolCost,
      totalCost: (areas.totalConvertedArea * (prices.ECO * kFac)) + elevatorCost + poolCost,
      colorTheme: 'gray',
      isRecommended: false
    },
    {
      packageType: 'Std',
      packageName: 'Gói Phổ Thông',
      basePrice: prices.STD,
      kFactor: kFac,
      finalUnitPrice: prices.STD * kFac,
      constructionCost: areas.totalConvertedArea * (prices.STD * kFac),
      elevatorCost,
      poolCost,
      totalCost: (areas.totalConvertedArea * (prices.STD * kFac)) + elevatorCost + poolCost,
      colorTheme: 'blue',
      isRecommended: true
    },
    {
      packageType: 'Lux',
      packageName: 'Gói Cao Cấp',
      basePrice: prices.LUX,
      kFactor: kFac,
      finalUnitPrice: prices.LUX * kFac,
      constructionCost: areas.totalConvertedArea * (prices.LUX * kFac),
      elevatorCost,
      poolCost,
      totalCost: (areas.totalConvertedArea * (prices.LUX * kFac)) + elevatorCost + poolCost,
      colorTheme: 'amber',
      isRecommended: false
    }
  ];

  return packages;
};