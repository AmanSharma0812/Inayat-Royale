import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SHOP_WHATSAPP_NUMBER } from '@/config/whatsappConfig.js';

const ProductCard = ({ product, category }) => {
  const imageUrl = product.image 
    ? pb.files.getUrl(product, product.image, { thumb: '300x300' })
    : 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cf4?w=300&h=300&fit=crop'; // Generic elegant jewelry background

  const handleWhatsAppInquiry = () => {
    const categoryName = category?.name || 'Uncategorized';
    const priceText = product.price ? `₹${product.price.toLocaleString('en-IN')}` : 'Price on request';
    const descriptionText = product.description ? product.description : 'No description available';
    
    const message = `Hi, I'm interested in this product: ${product.name} - Category: ${categoryName} - Price: ${priceText} - Description: ${descriptionText}`;
    
    window.open(`https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-border">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {category && (
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground shadow-md">
              {category.name}
            </Badge>
          )}
        </div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold mb-2 font-serif">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 max-w-none">
              {product.description}
            </p>
          )}
          <div className="mt-auto pt-4">
            {product.price && (
              <p className="text-2xl font-bold text-primary mb-4">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            )}
            <Button 
              onClick={handleWhatsAppInquiry}
              className="w-full h-11 bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg shadow-[#25D366]/20 transition-all duration-200 active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Inquire on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;