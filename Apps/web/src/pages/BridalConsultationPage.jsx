import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, Mail, Phone, MessageSquare, Sparkles, Heart, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';

const BridalConsultationPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
      // Save to a new collection 'consultations' in PocketBase
      // Fallback to 'contacts' if consultations doesn't exist
      try {
        await pb.collection('consultations').create({
          ...data,
          type: 'bridal'
        });
      } catch (err) {
        await pb.collection('contacts').create({
          name: data.name,
          email: data.email,
          message: `BRIDAL CONSULTATION REQUEST:\nWedding Date: ${data.weddingDate}\nPhone: ${data.phone}\nNeeds: ${data.needs}\nAdditional Info: ${data.message}`
        });
      }
      
      toast.success("Royal request received! Our bridal consultant will contact you within 24 hours.");
      e.target.reset();
    } catch (error) {
      toast.error("Failed to send request. Please try again or contact us via WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Bridal Consultation - Inayat Royale</title>
        <meta name="description" content="Book a private consultation for your royal bridal jewellery with Inayat Royale's expert designers." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-background relative overflow-hidden">
          {/* Ornamental Background Elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 transform translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-primary/5 skew-x-12 transform -translate-x-1/2 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                  <Sparkles className="w-3.5 h-3.5" />
                  Bespoke Bridal Services
                </div>
                <h1 className="text-5xl md:text-7xl font-bold font-serif mb-8 leading-tight">
                  Your Journey to <br />
                  <span className="text-primary italic">Royal Elegance</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-lg">
                  Every bride deserves to feel like royalty. Book a private consultation with our master designers to curate the perfect jewellery set for your special day.
                </p>

                <div className="space-y-8">
                  {[
                    { icon: Heart, title: "Personalized Design", desc: "Consultations tailored to your wedding theme and outfit." },
                    { icon: Clock, title: "Priority Crafting", desc: "Bridal sets receive dedicated craftsmanship timelines." },
                    { icon: User, title: "Expert Stylist", desc: "Work 1-on-1 with a professional jewellery stylist." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center shrink-0 shadow-sm">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{item.title}</h3>
                        <p className="text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Consultation Form */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative"
              >
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                
                <h2 className="text-3xl font-bold font-serif mb-2">Book Your Session</h2>
                <p className="text-muted-foreground mb-8">Tell us about your dream wedding</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
                        <Input name="name" required placeholder="Aria Singh" className="pl-11 h-12 rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
                        <Input name="phone" required type="tel" placeholder="+91 98765 43210" className="pl-11 h-12 rounded-xl" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
                      <Input name="email" required type="email" placeholder="aria@example.com" className="pl-11 h-12 rounded-xl" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Wedding Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-3.5 w-4 h-4 text-muted-foreground" />
                        <Input name="weddingDate" required type="date" className="pl-11 h-12 rounded-xl" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold ml-1">Interested In</label>
                      <select name="needs" className="w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                        <option value="complete_set">Complete Bridal Set</option>
                        <option value="necklace">Necklace Only</option>
                        <option value="earrings">Earrings & Maang Tikka</option>
                        <option value="bangles">Bangles & Rings</option>
                        <option value="custom">Custom Requirement</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold ml-1">Additional Details</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
                      <Textarea 
                        name="message" 
                        placeholder="Share your vision, preferred colors, or any specific requests..." 
                        className="pl-11 pt-3.5 rounded-xl min-h-[120px] resize-none"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-14 text-lg rounded-2xl shadow-xl shadow-primary/20 transition-all duration-300 active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      "Request Private Consultation"
                    )}
                  </Button>
                </form>
              </motion.div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BridalConsultationPage;
