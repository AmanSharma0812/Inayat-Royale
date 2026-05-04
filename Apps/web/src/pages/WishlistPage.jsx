import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '@/contexts/WishlistContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const WishlistPage = () => {
  const { wishlist } = useWishlist();

  return (
    <>
      <Helmet>
        <title>My Wishlist - Inayat Royale</title>
        <meta name="description" content="Your favorite royal jewellery pieces saved in one place." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold font-serif mb-2">My Wishlist</h1>
                <p className="text-muted-foreground">Your curated collection of royal treasures</p>
              </div>
              <Link to="/products">
                <Button variant="outline" className="rounded-xl border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>

            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence>
                  {wishlist.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24 bg-card rounded-3xl border border-border"
              >
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-12 h-12 text-muted-foreground opacity-20" />
                </div>
                <h2 className="text-2xl font-serif font-bold mb-4">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-10 max-w-sm mx-auto">
                  Start adding your favorite pieces to your wishlist and build your dream jewellery collection.
                </p>
                <Link to="/products">
                  <Button size="lg" className="px-8 rounded-xl">
                    Explore Collections
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default WishlistPage;
