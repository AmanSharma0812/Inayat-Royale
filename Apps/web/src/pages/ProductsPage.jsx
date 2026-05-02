import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/config/seo';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import BackButton from '@/components/BackButton';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          pb.collection('products').getFullList({ 
            expand: 'category',
            sort: '-id',
            requestKey: null
          }),
          pb.collection('categories').getFullList({ requestKey: null })
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <>
      <Helmet>
        <title>Jewellery Collection - Inayat Royale | Fashion, Bridal & Lifestyle</title>

        <meta name="description" content="Browse Inayat Royale's exquisite collection of premium fashion, bridal, and lifestyle jewellery. Quality assured designs with transparent pricing. Shop now." />

        <link rel="canonical" href={`${SITE_URL}/products`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={`${SITE_URL}/products`} />
        <meta property="og:title" content="Jewellery Collection - Inayat Royale" />
        <meta property="og:description" content="Browse our exquisite collection of premium fashion, bridal, and lifestyle jewellery. Quality assured designs with transparent pricing." />

        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Jewellery Collection - Inayat Royale" />
        <meta name="twitter:description" content="Browse premium fashion, bridal and lifestyle jewellery. Quality assured designs." />

        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <BackButton className="mb-8" />
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">Our Royal Collection</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover exquisite pieces crafted with precision and passion by Inayat Royale
              </p>
            </div>


            <div className="flex flex-wrap gap-3 justify-center mb-16">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                className={`transition-all duration-200 ${selectedCategory !== 'all' ? 'border-primary/30 hover:border-primary' : ''}`}
              >
                All Products
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`transition-all duration-200 ${selectedCategory !== category.id ? 'border-primary/30 hover:border-primary' : ''}`}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square rounded-2xl bg-muted" />
                    <Skeleton className="h-6 w-3/4 bg-muted" />
                    <Skeleton className="h-4 w-full bg-muted" />
                    <Skeleton className="h-4 w-2/3 bg-muted" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    category={product.expand?.category}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border border-border rounded-3xl bg-card">
                <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">💎</span>
                </div>
                <h3 className="text-2xl font-semibold mb-2 font-serif">No products found</h3>
                <p className="text-muted-foreground mb-8">
                  {selectedCategory === 'all' 
                    ? 'No products available at the moment.' 
                    : 'No products in this category yet.'}
                </p>
                {selectedCategory !== 'all' && (
                  <Button onClick={() => setSelectedCategory('all')}>
                    View All Products
                  </Button>
                )}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductsPage;