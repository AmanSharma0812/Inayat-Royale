import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '@/config/seo';
import { motion } from 'framer-motion';
import { Award, Users, Heart, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';


const AboutPage = () => {
  const values = [
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards in craftsmanship and quality, ensuring every piece meets our rigorous criteria.'
    },
    {
      icon: Heart,
      title: 'Trust',
      description: 'Building lasting relationships with our customers through transparency, honesty, and exceptional service.'
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: "Blending traditional techniques with modern designs to create timeless pieces that resonate with today's generation."
    },
    {
      icon: Users,
      title: 'Heritage',
      description: 'Preserving the art of jewellery making while passing down knowledge through generations of master craftsmen.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>About Inayat Royale - Our Heritage & Craftsmanship</title>
        <meta name="description" content="Discover the story behind Inayat Royale — premium fashion jewellery craftsmanship, contemporary designs, and a commitment to elegance in every handcrafted piece." />

        <link rel="canonical" href={`${SITE_URL}/about`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={`${SITE_URL}/about`} />
        <meta property="og:title" content="About Inayat Royale - Our Heritage & Craftsmanship" />
        <meta property="og:description" content="Premium fashion jewellery craftsmanship, contemporary designs, and a commitment to elegance in every handcrafted piece." />

        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Inayat Royale" />
        <meta name="twitter:description" content="Premium fashion jewellery craftsmanship and contemporary elegance." />

        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="py-24 bg-muted relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599643478524-fb66f70362f6?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">
              <BackButton className="mb-8" />
              <motion.div

                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">The Inayat Royale Heritage</h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Where Every Sparkle Tells a Royal Story
                </p>
              </motion.div>
            </div>
          </section>

          <section className="py-24 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <div className="relative p-4 border border-primary/20 rounded-3xl">
                    <img
                      src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908"
                      alt="Jewellery workshop"
                      className="rounded-2xl shadow-xl w-full"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl font-bold mb-6 font-serif text-primary">Subtle Sophistication</h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-none">
                    Inayat Royale is where luxury meets grace. Our jewellery is inspired by royal aesthetics and designed for the modern woman who loves to stand out with subtle sophistication.
                  </p>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed max-w-none">
                    Every design carries a touch of glamour, ensuring you feel confident, beautiful, and truly special every time you wear it.
                  </p>

                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="order-2 lg:order-1"
                >
                  <h2 className="text-4xl font-bold mb-8 font-serif">Why Choose Inayat Royale</h2>
                  <div className="space-y-8">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Certified Quality</h3>
                        <p className="text-muted-foreground leading-relaxed max-w-none">
                          Our jewellery is crafted with high-grade alloys and premium finishes. We ensure every piece meets our standards for durability and aesthetic beauty.

                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Master Craftsmanship</h3>
                        <p className="text-muted-foreground leading-relaxed max-w-none">
                          Our team of skilled artisans brings decades of experience, combining traditional techniques with contemporary design sensibilities.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Heart className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
                        <p className="text-muted-foreground leading-relaxed max-w-none">
                          We believe in honest pricing with no hidden charges. Our customers always know exactly what they're paying for.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Sparkles className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Lifetime Support</h3>
                        <p className="text-muted-foreground leading-relaxed max-w-none">
                          We offer complimentary cleaning, maintenance, and repair services for all our jewellery, ensuring your pieces remain beautiful forever.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="order-1 lg:order-2"
                >
                  <div className="relative p-4 border border-primary/20 rounded-3xl">
                    <img
                      src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0"
                      alt="Quality jewellery"
                      className="rounded-2xl shadow-xl w-full"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="py-24 bg-muted">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Our Values</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  The principles that guide everything we do at Inayat Royale
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-card border border-border rounded-2xl p-8 text-center hover:border-primary/50 transition-colors duration-300"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                      <value.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 font-serif">{value.title}</h3>
                    <p className="text-sm text-muted-foreground max-w-none">{value.description}</p>
                  </motion.div>
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

export default AboutPage;