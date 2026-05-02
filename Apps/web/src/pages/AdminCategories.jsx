import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Pencil, Trash2, Plus, FolderOpen } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional()
});

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await pb.collection('categories').getFullList({ 
        sort: '-id',
        requestKey: null
      });
      setCategories(data);
    } catch (error) {
      if (!pb.isAbort(error)) {
        const msg = error?.response?.message || error?.message || 'Unknown error';
        toast.error(`Failed to fetch categories: ${msg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (editingCategory) {
        await pb.collection('categories').update(editingCategory.id, data, { requestKey: null });
        toast.success('Category updated successfully');
      } else {
        await pb.collection('categories').create(data, { requestKey: null });
        toast.success('Category created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      const msg = error?.response?.message || error?.message || 'Unknown error';
      toast.error(`${editingCategory ? 'Failed to update' : 'Failed to create'} category: ${msg}`);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    form.reset({
      name: category.name,
      description: category.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category? This may affect products using this category.')) {
      try {
        await pb.collection('categories').delete(id, { requestKey: null });
        toast.success('Category deleted successfully');
        fetchCategories();
      } catch (error) {
        const msg = error?.response?.message || error?.message || 'Unknown error';
        toast.error(`Failed to delete category: ${msg}`);
      }
    }
  };

  const resetForm = () => {
    form.reset();
    setEditingCategory(null);
  };

  return (
    <>
      <Helmet>
        <title>Manage Categories - Admin Dashboard</title>
        <meta name="description" content="Manage product categories for Luxury Jewels." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold font-serif mb-2">Manage Categories</h1>
                <p className="text-muted-foreground">Organize your product catalog with categories</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-serif">
                      {editingCategory ? 'Edit Category' : 'Add New Category'}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Bridal Jewellery" 
                                {...field}
                                className="text-foreground placeholder:text-muted-foreground"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Category description" 
                                rows={4} 
                                {...field}
                                className="text-foreground placeholder:text-muted-foreground resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-3">
                        <Button type="submit" className="flex-1">
                          {editingCategory ? 'Update Category' : 'Create Category'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsDialogOpen(false);
                            resetForm();
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading categories...</p>
              </div>
            ) : categories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                  <div key={category.id} className="bg-card rounded-2xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <span className="text-2xl font-bold text-primary">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 font-serif">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mb-4 max-w-none">
                        {category.description}
                      </p>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl">
                <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FolderOpen className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 font-serif">No categories yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first category to organize products
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AdminCategories;