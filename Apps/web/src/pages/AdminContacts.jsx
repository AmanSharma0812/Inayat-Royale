import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, MessageSquare } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const result = await pb.collection('contacts').getList(1, 500, { 
        sort: '-id',
        requestKey: null
      });
      setContacts(result.items);
    } catch (error) {
      if (!pb.isAbort(error)) {
        toast.error('Failed to fetch enquiries');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await pb.collection('contacts').delete(id, { requestKey: null });
      toast.success('Deleted');
      fetchContacts();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  return (
    <>
      <Helmet>
        <title>Enquiries - Admin</title>
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-20 container mx-auto px-4 pt-8">
          <BackButton className="mb-8" />
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-serif mb-2">Customer Enquiries</h1>
            <p className="text-muted-foreground">Manage your contact form submissions</p>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading...</p>
            </div>
          ) : contacts.length > 0 ? (
            <div className="bg-card rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell className="max-w-md italic">"{contact.message}"</TableCell>
                      <TableCell>
                        {contact.created ? new Date(contact.created).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(contact.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-xl border border-dashed">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-serif">No enquiries yet</h3>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AdminContacts;