import { api } from "../index";

// ─── Stock Management API ─────────────────────────────────────────────────────

/**
 * GET /stock-management/
 * Dashboard summary: total stock, low/out-of-stock counts, per-station overview
 */
export const getStockOverview = () => {
    return api.get("/stock-management");
};

/**
 * GET /stock-management/transactions
 * Full transaction history — all stations
 */
export const getTransactionHistory = () => {
    return api.get("/stock-management/transactions");
};

/**
 * GET /stock-management/transactions?station_id={stationId}
 * Transaction history filtered by station
 */
export const getTransactionHistoryByStation = (stationId) => {
    return api.get("/stock-management/transactions", {
        params: { station_id: stationId },
    });
};

/**
 * POST /stock-management/add
 * Add new fuel type stock to a station (first time)
 * @param {number} stationId
 * @param {number} fuelTypeId
 * @param {number} quantityLitres
 */
export const addStock = (stationId, fuelTypeId, quantityLitres) => {
    return api.post("/stock-management/add", {
        station_id:      stationId,
        fuel_type_id:    fuelTypeId,
        quantity_litres: quantityLitres,
    });
};

/**
 * POST /stock-management/update
 * Update existing stock for a station + fuel type
 * @param {number} stationId
 * @param {number} fuelTypeId
 * @param {number} quantityLitres
 */
export const updateStock = (stationId, fuelTypeId, quantityLitres) => {
    return api.post("/stock-management/update", {
        station_id:      stationId,
        fuel_type_id:    fuelTypeId,
        quantity_litres: quantityLitres,
    });
};