import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME } from '@/config/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ReturnPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Return & Damage Policy - {SITE_NAME}</title>
        <meta name="description" content="Return and damage policy for Inayat Royale products." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-24 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-12 font-serif text-primary border-b pb-4">Return & Damage Policy</h1>
            
            <div className="prose prose-invert max-w-none space-y-8">
              <section>
                <p className="text-lg leading-relaxed italic">
                  At Inayat Royale, we maintain strict quality checks to ensure you receive your jewellery in perfect condition.
                </p>
              </section>

              <section className="bg-muted/50 p-6 rounded-2xl border border-primary/20">
                <p className="text-lg font-medium text-primary mb-0">
                  We have a no return and no exchange policy on all products. However, in the rare case that you receive a damaged or defective item, we will assist you with a replacement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif">Eligibility for Replacement</h2>
                <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                  <li><strong>Unboxing Video:</strong> You must record a clear unboxing video while opening the package.</li>
                  <li><strong>Continuous Footage:</strong> The video should be continuous and unedited, clearly showing the sealed package and the damage.</li>
                  <li><strong>Reporting Window:</strong> The issue must be reported within 24–48 hours of delivery.</li>
                </ul>
                <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm font-medium">
                  Claims without a proper unboxing video will not be accepted.
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 font-serif">Important Notes</h2>
                <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                  <li>Slight variations in color or design due to lighting and photography are not considered defects.</li>
                  <li>Used or worn items will not be eligible for replacement.</li>
                </ul>
              </section>

              <section>
                <p className="text-muted-foreground leading-relaxed">
                  For any concerns, feel free to contact our support team—we’re here to help make your experience smooth and satisfying.
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

export default ReturnPolicy;
