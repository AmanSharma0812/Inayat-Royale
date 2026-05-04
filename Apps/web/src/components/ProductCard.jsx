import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Eye, Heart } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WHATSAPP_NUMBER } from '@/config/seo';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/contexts/CartContext';

const ProductCard = ({ product, category }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);
  // Support both array and string (legacy) in the 'image' field
  const images = Array.isArray(product.image) && product.image.length > 0 
    ? product.image 
    : (product.image && typeof product.image === 'string' ? [product.image] : []);

  const imageUrl = images.length > 0
    ? pb.files.getUrl(product, images[0], { thumb: '400x400' })
    : 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cf4?w=400&h=400&fit=crop';

  const handleWhatsAppInquiry = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation();
    const categoryName = category?.name || 'Uncategorized';
    const priceText = product.price ? formatPrice(product.price) : 'Price on request';
    const descriptionText = product.description ? product.description : 'No description available';
    
    const message = `Hi, I'm interested in this product: ${product.name} - Category: ${categoryName} - Price: ${priceText} - Description: ${descriptionText} - Link: ${window.location.origin}/product/${product.id}`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col border border-border group">
          <div className="relative overflow-hidden aspect-square">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            />
            
            {/* Category Badge */}
            {category && (
              <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md text-primary-foreground shadow-md border-none px-3 py-1">
                {category.name}
              </Badge>
            )}
            {images.length > 1 && (
              <Badge variant="secondary" className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white border-none">
                +{images.length - 1} More
              </Badge>
            )}
            {product.status && product.status !== 'normal' && (
              <Badge className={`absolute top-4 left-16 px-3 py-1 border-none shadow-lg ${
                product.status === 'limited' ? 'bg-amber-500 text-white' :
                product.status === 'low_stock' ? 'bg-red-500 text-white' :
                product.status === 'best_seller' ? 'bg-blue-500 text-white' :
                product.status === 'new_arrival' ? 'bg-emerald-500 text-white' :
                'bg-primary'
              }`}>
                {product.status === 'limited' ? 'Limited Edition' :
                 product.status === 'low_stock' ? 'Low Stock' :
                 product.status === 'best_seller' ? 'Best Seller' :
                 product.status === 'new_arrival' ? 'New Arrival' :
                 product.status}
              </Badge>
            )}
          </div>
          <div className="p-6 flex-1 flex flex-col bg-gradient-to-b from-card to-muted/30">
            <h3 className="text-xl font-bold mb-2 font-serif group-hover:text-primary transition-colors">{product.name}</h3>
            {product.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}
            <div className="mt-auto pt-4 flex flex-col gap-4">
              {product.price && (
                <p className="text-2xl font-bold text-primary font-serif">
                  {formatPrice(product.price)}
                </p>
              )}
              <div className="flex gap-2">
                <Button 
                  onClick={handleWhatsAppInquiry}
                  className="flex-1 h-11 bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-lg shadow-[#25D366]/20 transition-all duration-300 rounded-xl px-2"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold">Inquire</span>
                </Button>
                <Button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  variant="outline"
                  className="flex-1 h-11 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 rounded-xl px-2"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  <span className="text-xs font-bold">Add to Wishlist</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;