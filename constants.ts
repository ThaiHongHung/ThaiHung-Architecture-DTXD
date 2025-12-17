
import { BasementType, FacadeCount, FoundationType, NeighborType, RoadWidth, RoofType } from "./types";

// Percentages
export const FOUNDATION_PERCENT: Record<FoundationType, number> = {
  [FoundationType.SINGLE]: 0.30,
  [FoundationType.STRIP]: 0.50,
  [FoundationType.PILE]: 0.40,
  [FoundationType.RAFT]: 1.00,
};

export const BASEMENT_PERCENT: Record<BasementType, number> = {
  [BasementType.NONE]: 0.0,
  [BasementType.SEMI]: 1.5,
  [BasementType.NORMAL]: 2.0,
  [BasementType.DEEP]: 2.5,
};

export const ROOF_PERCENT: Record<RoofType, number> = {
  [RoofType.IRON_SHEET]: 0.30,
  [RoofType.CONCRETE]: 0.50,
  [RoofType.TILE_IRON]: 0.70,
  [RoofType.TILE_CONCRETE]: 1.00,
};

// K Factors
export const FACADE_K: Record<FacadeCount, number> = {
  [FacadeCount.ONE]: 0.0,
  [FacadeCount.TWO]: 0.03,
  [FacadeCount.THREE]: 0.05,
};

export const ROAD_K: Record<RoadWidth, number> = {
  [RoadWidth.LARGE]: 0.0,
  [RoadWidth.MEDIUM]: 0.025,
  [RoadWidth.SMALL]: 0.08,
};

export const NEIGHBOR_K: Record<NeighborType, number> = {
  [NeighborType.FULL]: 0.0,
  [NeighborType.ONE_SIDE]: 0.02,
  [NeighborType.EMPTY]: 0.04,
};

// Base Prices
export const BASE_PRICE = {
  ECO: 6000000,
  STD: 7500000,
  LUX: 10000000,
};

// Add-ons
export const ELEVATOR_BASE_COST = 400000000;
export const ELEVATOR_STOP_COST = 15000000;
export const POOL_UNIT_COST = 9000000;
