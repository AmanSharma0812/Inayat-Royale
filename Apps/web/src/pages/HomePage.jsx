import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, LOGO_URL, WHATSAPP_NUMBER } from '@/config/seo';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Award, Clock, MessageCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CategoryCard from '@/components/CategoryCard';
import TrustBadge from '@/components/TrustBadge';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const records = await pb.collection('categories').getFullList({ requestKey: null });
        setCategories(records.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const trustBadges = [
    {
      icon: Shield,
      title: 'Certified Quality',
      description: 'BIS hallmarked jewellery with authenticity certificates'
    },
    {
      icon: Award,
      title: '99.9% Pure Gold',
      description: 'Guaranteed purity with transparent pricing'
    },
    {
      icon: Clock,
      title: 'Royal Heritage',
      description: 'Trusted by generations for premium craftsmanship'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Inayat Royale - Where Every Sparkle Tells a Royal Story</title>
        <meta name="description" content="Discover exquisite handcrafted premium jewellery by Inayat Royale. BIS hallmarked, 99.9% pure gold, certified quality. Shop bridal, gold & silver jewellery." />
        <link rel="canonical" href={SITE_URL} />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="Inayat Royale - Where Every Sparkle Tells a Royal Story" />
        <meta property="og:description" content="Discover exquisite handcrafted premium jewellery. BIS hallmarked, 99.9% pure gold. Bridal, gold & silver collections with certified quality." />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Inayat Royale luxury jewellery collection" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Inayat Royale - Where Every Sparkle Tells a Royal Story" />
        <meta name="twitter:description" content="Discover exquisite handcrafted premium jewellery. BIS hallmarked, 99.9% pure gold." />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        {/* JSON-LD: JewelryStore */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "JewelryStore",
          "name": SITE_NAME,
          "url": SITE_URL,
          "logo": LOGO_URL,
          "description": "Premium handcrafted jewellery with BIS hallmark certification and royal heritage.",
          "telephone": `+${WHATSAPP_NUMBER}`,
          "priceRange": "₹₹₹",
          "sameAs": [`https://wa.me/${WHATSAPP_NUMBER}`],
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${SITE_URL}/products?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="/hero_banner.jpg"
                alt="Inayat Royale Bridal Jewellery Collection"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col items-center"
              >
                <img 
                  src="/logo.png" 
                  alt="Inayat Royale Logo" 
                  className="h-36 md:h-48 w-auto object-contain mb-8 drop-shadow-2xl"
                />
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight font-serif">
                  Where Every Sparkle<br /><span className="text-primary">Tells a Royal Story</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto font-light">
                  Discover exquisite handcrafted jewellery that celebrates life's most precious and royal moments
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/products">
                    <Button size="lg" className="text-lg px-8 h-14">
                      Explore Collection
                    </Button>
                  </Link>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="text-lg px-8 h-14 bg-white/5 backdrop-blur-sm text-white border-white/20 hover:bg-primary hover:text-primary-foreground hover:border-primary">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      WhatsApp Enquiry
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Featured Collections</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Explore our curated selection of fine jewellery crafted with precision and passion
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map((category, index) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    index={index}
                    onClick={() => window.location.href = '/products'}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="py-24 bg-muted">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl md:text-5xl font-bold mb-6 font-serif">The Inayat Royale Story</h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-none">
                    Inayat Royale has been crafting exceptional pieces that tell stories of love, celebration, and royal heritage. Our master craftsmen combine traditional techniques with contemporary designs to create jewellery that transcends generations.
                  </p>
                  <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-none">
                    Every piece is meticulously crafted with certified materials, ensuring you receive nothing but the finest quality. Our commitment to excellence has made us a trusted name in premium luxury jewellery.
                  </p>
                  <Link to="/about">
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                      Discover Our Heritage
                    </Button>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute -inset-4 bg-primary/10 rounded-3xl transform rotate-3"></div>
                  <img
                    src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a"
                    alt="Jewellery craftsmanship"
                    className="relative rounded-2xl shadow-2xl w-full border border-border"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Why Choose Inayat Royale</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Your trust is our most precious jewel
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {trustBadges.map((badge, index) => (
                  <TrustBadge
                    key={index}
                    icon={badge.icon}
                    title={badge.title}
                    description={badge.description}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;