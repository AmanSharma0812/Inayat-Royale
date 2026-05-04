import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MessageCircle, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { WHATSAPP_NUMBER } from '@/config/seo';
import { useCurrency } from '@/contexts/CurrencyContext';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await pb.collection('products').getOne(id, {
          expand: 'category',
          requestKey: null
        });
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const handleWhatsAppInquiry = () => {
    if (!product) return;
    const categoryName = product.expand?.category?.name || 'Uncategorized';
    const priceText = product.price ? formatPrice(product.price) : 'Price on request';
    
    const message = `Hi, I'm interested in this product: ${product.name}
Category: ${categoryName}
Price: ${priceText}
Link: ${window.location.href}`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this beautiful jewellery: ${product.name}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) return null;

  const images = Array.isArray(product.image) && product.image.length > 0 
    ? product.image 
    : (product.image && typeof product.image === 'string' ? [product.image] : []);

  return (
    <>
      <Helmet>
        <title>{`${product.name} - Inayat Royale`}</title>
        <meta name="description" content={product.description || `Buy ${product.name} at Inayat Royale.`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-12 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <BackButton className="mb-8" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* Image Gallery / Slider */}
              <div className="space-y-6">
                <div className="relative group">
                  <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
                    <CarouselContent>
                      {product.video && (
                        <CarouselItem>
                          <div className="aspect-square relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-border flex items-center justify-center">
                            <video 
                              src={pb.files.getUrl(product, product.video)} 
                              className="w-full h-full object-contain"
                              controls
                              autoPlay
                              muted
                              loop
                            />
                            <div className="absolute top-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                              Product Video
                            </div>
                          </div>
                        </CarouselItem>
                      )}
                      {images.map((img, index) => (
                        <CarouselItem key={index}>
                          <div className="aspect-square relative rounded-3xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted shadow-2xl border border-border flex items-center justify-center">
                            <img
                              src={pb.files.getUrl(product, img)}
                              alt={`${product.name} - View ${index + 1}`}
                              className="w-full h-full object-contain p-4 transition-transform duration-500 hover:scale-105"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    {images.length > 1 && (
                      <>
                        <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm" />
                        <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-background/50 backdrop-blur-sm" />
                      </>
                    )}
                  </Carousel>
                  
                  {/* Indicators / Dots */}
                  {images.length > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => api?.scrollTo(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            current === index ? 'bg-primary w-6' : 'bg-primary/20'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {(images.length > 1 || product.video) && (
                  <div className="flex flex-wrap gap-4">
                    {product.video && (
                      <button
                        onClick={() => api?.scrollTo(0)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 bg-black flex items-center justify-center ${
                          current === 0 ? 'border-primary shadow-md scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-primary border-b-[6px] border-b-transparent ml-1" />
                        </div>
                      </button>
                    )}
                    {images.map((img, idx) => {
                      const slideIndex = product.video ? idx + 1 : idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => api?.scrollTo(slideIndex)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                            current === slideIndex ? 'border-primary shadow-md scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={pb.files.getUrl(product, img, { thumb: '100x100' })}
                            alt={`${product.name} thumb ${idx}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <div className="mb-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.expand?.category && (
                      <Badge className="px-4 py-1 text-sm">{product.expand.category.name}</Badge>
                    )}
                    {product.status && product.status !== 'normal' && (
                      <Badge variant="outline" className={`px-4 py-1 text-sm font-semibold ${
                        product.status === 'limited' ? 'border-amber-500 text-amber-500 bg-amber-500/10' :
                        product.status === 'low_stock' ? 'border-red-500 text-red-500 bg-red-500/10' :
                        product.status === 'best_seller' ? 'border-blue-500 text-blue-500 bg-blue-500/10' :
                        product.status === 'new_arrival' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' :
                        ''
                      }`}>
                        {product.status === 'limited' ? 'Limited Edition' :
                         product.status === 'low_stock' ? 'Low Stock' :
                         product.status === 'best_seller' ? 'Best Seller' :
                         product.status === 'new_arrival' ? 'New Arrival' :
                         product.status}
                      </Badge>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 leading-tight">
                    {product.name}
                  </h1>
                  {product.price && (
                    <p className="text-3xl font-bold text-primary font-serif">
                      {formatPrice(product.price)}
                    </p>
                  )}
                </div>

                <div className="prose prose-neutral dark:prose-invert max-w-none mb-10">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {product.description || 'No description available for this exquisite piece.'}
                  </p>
                </div>

                <div className="mt-auto space-y-4">
                  <Button 
                    onClick={handleWhatsAppInquiry}
                    className="w-full h-16 text-lg bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-xl shadow-[#25D366]/20 transition-all duration-300 active:scale-[0.98] rounded-2xl"
                  >
                    <MessageCircle className="w-6 h-6 mr-3" />
                    Inquire on WhatsApp
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleShare}
                    className="w-full h-14 rounded-2xl border-2"
                  >
                    <Share2 className="w-5 h-5 mr-3" />
                    Share this Piece
                  </Button>
                </div>

                {/* Trust Badges or Features */}
                <div className="mt-12 grid grid-cols-2 gap-6 border-t pt-8 border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Premium Quality</p>
                      <p className="text-xs text-muted-foreground">Handcrafted Excellence</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Secure Service</p>
                      <p className="text-xs text-muted-foreground">Trusted by Thousands</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetailPage;
