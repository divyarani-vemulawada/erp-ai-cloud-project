import ExchangeRate from "../models/ExchangeRate";

export const getCachedFXRates = async (): Promise<Record<string, number>> => {
  try {
    // 1. Check if we have recent rates in DB (updated within last 12 hours)
    const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
    const cachedRates = await ExchangeRate.find({ updatedAt: { $gte: twelveHoursAgo } });

    if (cachedRates.length > 0) {
      const rateMap: Record<string, number> = {};
      cachedRates.forEach((r) => {
        rateMap[r.currency] = r.rate;
      });
      return rateMap;
    }

    // 2. Fetch fresh rates from public keyless endpoint (Base INR)
    console.log("Fetching fresh exchange rates...");
    const res = await fetch("https://open.er-api.com/v6/latest/INR");
    if (!res.ok) throw new Error("Failed to fetch exchange rates");
    
    const data = await res.json();
    if (data.result !== "success" || !data.rates) {
      throw new Error("Invalid API response format");
    }

    const rates = data.rates as Record<string, number>;
    
    // 3. Upsert rates to DB
    const upsertPromises = Object.entries(rates).map(async ([currency, rate]) => {
      return ExchangeRate.findOneAndUpdate(
        { currency: currency.toUpperCase() },
        { rate, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    });
    await Promise.all(upsertPromises);

    return rates;
  } catch (error) {
    console.error("FX rate fetch error:", error);
    
    // Fallback: Return whatever rates we have in DB even if old
    const allRates = await ExchangeRate.find();
    const rateMap: Record<string, number> = { INR: 1 };
    allRates.forEach((r) => {
      rateMap[r.currency] = r.rate;
    });
    return rateMap;
  }
};
