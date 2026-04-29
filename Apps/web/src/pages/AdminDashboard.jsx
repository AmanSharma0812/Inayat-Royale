import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Package, FolderOpen, MessageSquare, ArrowRight, KeyRound } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    contacts: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, categories, contacts] = await Promise.all([
          pb.collection('products').getList(1, 1, { requestKey: null }),
          pb.collection('categories').getList(1, 1, { requestKey: null }),
          pb.collection('contacts').getList(1, 1, { requestKey: null })
        ]);
        setStats({
          products: products.totalItems,
          categories: categories.totalItems,
          contacts: contacts.totalItems
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const dashboardCards = [
    {
      title: 'Products',
      description: 'Manage your product catalog',
      icon: Package,
      count: stats.products,
      link: '/admin/products',
      color: 'text-blue-600'
    },
    {
      title: 'Categories',
      description: 'Organize product categories',
      icon: FolderOpen,
      count: stats.categories,
      link: '/admin/categories',
      color: 'text-green-600'
    },
    {
      title: 'Contact Submissions',
      description: 'View customer enquiries',
      icon: MessageSquare,
      count: stats.contacts,
      link: '/admin/contacts',
      color: 'text-purple-600'
    },
    {
      title: 'Change Password',
      description: 'Update your admin account password',
      icon: KeyRound,
      count: null,
      link: '/admin/change-password',
      color: 'text-amber-600'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Inayat Royale</title>
        <meta name="description" content="Manage products, categories, and customer enquiries." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">Admin Dashboard</h1>
              <p className="text-xl text-muted-foreground">
                Manage your jewellery shop from one place
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardCards.map((card, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${card.color}`}>
                        <card.icon className="w-6 h-6" />
                      </div>
                      {card.count !== null && (
                        <span className="text-3xl font-bold">{card.count}</span>
                      )}
                    </div>
                    <CardTitle className="font-serif">{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={card.link}>
                      <Button variant="outline" className="w-full group">
                        Manage
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AdminDashboard;