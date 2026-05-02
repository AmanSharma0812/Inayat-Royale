import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME } from '@/config/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';


const ShippingPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Shipping Policy - {SITE_NAME}</title>
        <meta name="description" content="Shipping policy and delivery information for Inayat Royale." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <BackButton className="mb-8" />
            <h1 className="text-4xl font-bold mb-12 font-serif text-primary border-b pb-4">Shipping Policy</h1>

            
            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <p className="text-lg leading-relaxed">
                  At Inayat Royale, we are committed to delivering your jewellery safely and on time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif">Order Processing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All orders are processed within 3-4 business days after confirmation. Orders placed on weekends or holidays will be processed on the next working day.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif">Shipping Time</h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li><strong>Standard Delivery:</strong> 3–7 business days across India</li>
                </ul>
                <p className="mt-4 text-muted-foreground italic">
                  Delivery time may vary depending on your location and courier service availability.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif">Shipping Charges</h2>
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  <li>Free shipping on orders above ₹500.</li>
                  <li>A standard shipping fee of ₹99 will be applied to orders below this amount.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif">Order Tracking</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Once your order is shipped, you will receive a tracking ID via SMS or email to monitor your delivery status.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif">Delivery Issues</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Please ensure your address and contact details are correct. Inayat Royale is not responsible for delays caused by incorrect information or courier issues.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif">Damaged or Lost Packages</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If your package arrives damaged or is lost in transit, please contact us within 48 hours of delivery. We will assist you in resolving the issue as quickly as possible.
                </p>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ShippingPolicy;
