import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', rate: 1, label: 'India (INR)' },
  USD: { code: 'USD', symbol: '$', rate: 0.012, label: 'USA (USD)' },
  AED: { code: 'AED', symbol: 'د.إ', rate: 0.044, label: 'UAE (AED)' }
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(CURRENCIES.INR);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('inayat_currency');
    if (saved && CURRENCIES[saved]) {
      setCurrency(CURRENCIES[saved]);
    }
  }, []);

  const changeCurrency = (code) => {
    if (CURRENCIES[code]) {
      setCurrency(CURRENCIES[code]);
      localStorage.setItem('inayat_currency', code);
    }
  };

  const formatPrice = (priceInInr) => {
    if (!priceInInr) return '';
    const converted = priceInInr * currency.rate;
    
    // Luxury formatting
    if (currency.code === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(priceInInr);
    } else if (currency.code === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(converted);
    } else {
      return `${currency.symbol} ${new Intl.NumberFormat('en-AE').format(converted)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
