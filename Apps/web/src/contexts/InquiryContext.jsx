import React, { createContext, useContext, useState } from 'react';

const InquiryContext = createContext();

export const InquiryProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inquiryData, setInquiryData] = useState(null);

  // Open for a single product inquiry
  const openProductInquiry = (product, category) => {
    setInquiryData({ type: 'product', product, category: category || null });
    setIsOpen(true);
  };

  // Open for wishlist (cart) inquiry
  const openWishlistInquiry = (items) => {
    setInquiryData({ type: 'wishlist', items });
    setIsOpen(true);
  };

  const closeInquiry = () => {
    setIsOpen(false);
    setInquiryData(null);
  };

  return (
    <InquiryContext.Provider value={{ isOpen, inquiryData, openProductInquiry, openWishlistInquiry, closeInquiry }}>
      {children}
    </InquiryContext.Provider>
  );
};

export const useInquiry = () => {
  const context = useContext(InquiryContext);
  if (!context) throw new Error('useInquiry must be used within InquiryProvider');
  return context;
};
