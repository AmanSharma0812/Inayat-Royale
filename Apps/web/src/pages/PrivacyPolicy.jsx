import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME, WHATSAPP_NUMBER } from '@/config/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - {SITE_NAME}</title>
        <meta name="description" content="Privacy policy and data protection information for Inayat Royale." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-12 font-serif text-primary border-b pb-4">Privacy Policy</h1>
            
            <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground">
              <section>
                <p className="text-lg leading-relaxed text-foreground">
                  At Inayat Royale, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you shop with us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif text-foreground">Information We Collect</h2>
                <p>
                  We may collect personal details such as your name, phone number, email address, shipping address, and payment information when you place an order or contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif text-foreground">How We Use Your Information</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Process and deliver your orders</li>
                  <li>Communicate order updates and customer support</li>
                  <li>Improve our products and services</li>
                  <li>Send promotional offers (only if you choose to receive them)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif text-foreground">Data Protection</h2>
                <p>
                  We take appropriate security measures to protect your personal information and ensure it is not misused, accessed, or disclosed without authorization.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif text-foreground">Sharing of Information</h2>
                <p>
                  We do not sell, trade, or rent your personal information. Your data may only be shared with trusted third parties such as delivery partners or payment gateways for order fulfillment.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif text-foreground">Cookies & Tracking</h2>
                <p>
                  Our website may use cookies to enhance your browsing experience and understand customer preferences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif text-foreground">Your Consent</h2>
                <p>
                  By using our services, you agree to the terms of this Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif text-foreground">Updates to Policy</h2>
                <p>
                  Inayat Royale reserves the right to update or modify this policy at any time. Changes will be reflected on this page.
                </p>
              </section>

              <section className="pt-8 border-t border-border">
                <h2 className="text-2xl font-semibold mb-4 font-serif text-foreground">Contact Us</h2>
                <p>If you have any questions about our Privacy Policy, feel free to contact us at:</p>
                <div className="mt-4 space-y-2">
                  <p>📧 <strong>Email:</strong> royaleinayat@gmail.com</p>
                  <p>📞 <strong>Phone:</strong> 9814589421</p>
                </div>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
