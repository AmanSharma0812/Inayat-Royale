import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchContacts = async () => {
    setIsLoading(true);
    try {
      const data = await pb.collection('contacts').getFullList({ 
        sort: '-id',
        requestKey: null
      });
      setContacts(data);
    } catch (error) {
      if (!pb.isAbort(error)) {
        toast.error('Failed to fetch contact submissions');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact submission?')) {
      try {
        await pb.collection('contacts').delete(id, { requestKey: null });
        toast.success('Contact submission deleted successfully');
        fetchContacts();
      } catch (error) {
        toast.error('Failed to delete contact submission');
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Submissions - Admin Dashboard</title>
        <meta name="description" content="View and manage customer contact submissions." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold font-serif mb-2">Contact Submissions</h1>
              <p className="text-muted-foreground">View and manage customer enquiries</p>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading submissions...</p>
              </div>
            ) : contacts.length > 0 ? (
              <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
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
                          <TableCell className="max-w-md">
                            <p className="line-clamp-2 max-w-none">{contact.message}</p>
                          </TableCell>
                          <TableCell>
                            {format(new Date(contact.created), 'MMM dd, yyyy')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="destructive"
                              size="sm"
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
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl">
                <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 font-serif">No submissions yet</h3>
                <p className="text-muted-foreground">
                  Contact form submissions will appear here
                </p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AdminContacts;