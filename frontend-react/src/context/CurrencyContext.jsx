import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ─── Currency Meta ────────────────────────────────────────────────────────────
export const CURRENCIES = [
  { code: 'USD', symbol: '$',    name: 'US Dollar' },
  { code: 'EUR', symbol: '€',    name: 'Euro' },
  { code: 'GBP', symbol: '£',    name: 'British Pound' },
  { code: 'BDT', symbol: '৳',   name: 'Bangladeshi Taka' },
  { code: 'INR', symbol: '₹',    name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥',    name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$',   name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$',   name: 'Canadian Dollar' },
  { code: 'SGD', symbol: 'S$',   name: 'Singapore Dollar' },
  { code: 'CHF', symbol: 'Fr',   name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥',    name: 'Chinese Yuan' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'MYR', symbol: 'RM',   name: 'Malaysian Ringgit' },
  { code: 'THB', symbol: '฿',    name: 'Thai Baht' },
  { code: 'PKR', symbol: '₨',    name: 'Pakistani Rupee' },
];

const CACHE_KEY   = 'fx_rates_cache_v2';
const CACHE_TTL   = 60 * 60 * 1000; // 1 hour

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const getCurrencyMeta = (code) =>
  CURRENCIES.find((c) => c.code === code) || { code, symbol: code, name: code };

/** Read cached rates from localStorage — returns null if absent or expired */
const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { timestamp, rates } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_TTL) return null;
    return rates;
  } catch {
    return null;
  }
};

/** Persist rates to localStorage with a timestamp */
const writeCache = (rates) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), rates }));
  } catch { /* storage full — ignore */ }
};

// ─── Context ──────────────────────────────────────────────────────────────────
const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  // Active currency code (default USD until profile loads)
  const [currency, setCurrencyCode] = useState(
    () => localStorage.getItem('preferred_currency') || 'USD'
  );
  // USD-based exchange rates  { EUR: 0.93, BDT: 110.2, ... }
  const [rates, setRates] = useState({});
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesError, setRatesError]   = useState(false);

  // ── Fetch rates ─────────────────────────────────────────────────────────────
  const fetchRates = useCallback(async (force = false) => {
    if (!force) {
      const cached = readCache();
      if (cached) {
        setRates(cached);
        setRatesLoading(false);
        return;
      }
    }

    setRatesLoading(true);
    setRatesError(false);
    try {
      // open.er-api.com: free, no API key, CORS-enabled, backed by exchangerate-api.com
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      if (data.result !== 'success') throw new Error('API error');
      const newRates = { ...data.rates, USD: 1 }; // rates already include USD: 1
      setRates(newRates);
      writeCache(newRates);
    } catch (err) {
      console.error('Failed to fetch exchange rates:', err);
      setRatesError(true);
      // Fall back to cached (even if expired)
      const stale = (() => {
        try {
          const raw = localStorage.getItem(CACHE_KEY);
          return raw ? JSON.parse(raw).rates : null;
        } catch { return null; }
      })();
      if (stale) setRates(stale);
    } finally {
      setRatesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  // ── Public setter (called by Settings after save & DashboardLayout on mount) ─
  const setCurrency = useCallback((code) => {
    setCurrencyCode(code);
    localStorage.setItem('preferred_currency', code);
  }, []);

  // ── Derived values ───────────────────────────────────────────────────────────
  const meta   = getCurrencyMeta(currency);
  const symbol = meta.symbol;
  /** Conversion rate: 1 USD → X [currency] */
  const rate   = rates[currency] ?? 1;

  /**
   * Convert a USD amount and format as the active currency.
   * @param {number|string} usdAmount
   * @param {{ compact?: boolean }} opts
   */
  const formatCurrency = useCallback(
    (usdAmount, { compact = false } = {}) => {
      const num   = parseFloat(usdAmount) || 0;
      const converted = num * rate;

      // JPY and similar currencies have no decimal places
      const noDecimals = ['JPY', 'KRW', 'VND', 'IDR', 'PKR', 'BDT', 'INR', 'THB', 'MYR', 'AED'];
      const decimals   = noDecimals.includes(currency) ? 0 : 2;

      if (compact && converted >= 1000) {
        return `${symbol}${(converted / 1000).toFixed(1)}K`;
      }
      return `${symbol}${converted.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`;
    },
    [currency, rate, symbol]
  );

  /**
   * Get the display rate string, e.g. "1 USD = 110.25 BDT"
   */
  const rateDisplay = currency === 'USD'
    ? null
    : `1 USD = ${rate.toLocaleString('en-US', { maximumFractionDigits: 4 })} ${currency}`;

  const value = {
    currency,
    symbol,
    rate,
    rates,
    ratesLoading,
    ratesError,
    rateDisplay,
    formatCurrency,
    setCurrency,
    refreshRates: () => fetchRates(true),
    CURRENCIES,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside <CurrencyProvider>');
  return ctx;
};

export default CurrencyContext;
