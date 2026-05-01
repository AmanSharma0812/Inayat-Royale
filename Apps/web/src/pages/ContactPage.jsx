import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, WHATSAPP_NUMBER } from '@/config/seo';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Contact Inayat Royale - Visit Our Showroom</title>
        <meta name="description" content="Contact Inayat Royale for premium jewellery enquiries. Visit our showroom or reach us on WhatsApp for bridal jewellery consultations and custom orders." />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
        <meta property="og:title" content="Contact Inayat Royale" />
        <meta property="og:description" content="Visit our showroom or reach us on WhatsApp for jewellery enquiries and bridal consultations." />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Contact Inayat Royale" />
        <meta name="twitter:description" content="Visit our showroom or WhatsApp for jewellery enquiries." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "name": `Contact - ${SITE_NAME}`,
          "url": `${SITE_URL}/contact`,
          "mainEntity": {
            "@type": "Organization",
            "name": SITE_NAME,
            "telephone": `+${WHATSAPP_NUMBER}`,
            "url": SITE_URL
          }
        })}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 font-serif">Get in Touch</h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We'd love to hear from you. Visit the Inayat Royale showroom or send us a message.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
              <div>
                <h2 className="text-3xl font-bold mb-10 font-serif text-primary">Contact Information</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start space-x-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Address</h3>
                      <p className="text-muted-foreground max-w-none leading-relaxed">
                        123 Royal Avenue, Zaveri Bazaar<br />
                        Mumbai, Maharashtra 400002<br />
                        India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Phone</h3>
                      <p className="text-muted-foreground leading-relaxed">+91 98145 89421</p>

                    </div>
                  </div>

                  <div className="flex items-start space-x-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Email</h3>
                      <p className="text-muted-foreground leading-relaxed">royaleinayat@gmail.com</p>

                    </div>
                  </div>

                  <div className="flex items-start space-x-5">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/20">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                      <p className="text-muted-foreground leading-relaxed">Monday - Saturday: 10:00 AM - 8:00 PM</p>
                      <p className="text-muted-foreground leading-relaxed">Sunday: 11:00 AM - 6:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-2xl">
                <h2 className="text-3xl font-bold mb-8 font-serif">Send us a Message</h2>
                <ContactForm />
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-2xl border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3773.8537935890845!2d72.83102631490214!3d18.94694098717804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce3d3b0a1c1f%3A0x3e3e3e3e3e3e3e3e!2sZaveri%20Bazaar%2C%20Mumbai!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0, filter: 'grayscale(100%) invert(100%) contrast(80%)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Inayat Royale Location"
              ></iframe>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;