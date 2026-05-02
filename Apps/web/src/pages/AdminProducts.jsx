import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Pencil, Trash2, Plus, X, Package } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().min(1, 'Please select a category'),
  price: z.string().optional(),
  image: z.any().optional()
});

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      price: '',
      image: undefined
    }
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const [productsData, categoriesData] = await Promise.all([
        pb.collection('products').getFullList({
          expand: 'category',
          sort: '-id',
          requestKey: null
        }),
        pb.collection('categories').getFullList({ requestKey: null })
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      if (!pb.isAbort(error)) {
        const msg = error?.response?.message || error?.message || 'Unknown error';
        toast.error(`Failed to fetch products: ${msg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.category) formData.append('category', data.category);
      
      // Ensure price is a valid number before appending
      const priceVal = parseFloat(data.price);
      if (!isNaN(priceVal)) {
        formData.append('price', priceVal);
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (editingProduct) {
        await pb.collection('products').update(editingProduct.id, formData, { requestKey: null });
        toast.success('Product updated successfully');
      } else {
        await pb.collection('products').create(formData, { requestKey: null });
        toast.success('Product created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Submit Error:', error);
      const msg = error?.response?.message || error?.message || 'Unknown error';
      toast.error(`Failed to save product: ${msg}`);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price?.toString() || '',
    });
    if (product.image) {
      setImagePreview(pb.files.getUrl(product, product.image));
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    try {
        await pb.collection('products').delete(id, { requestKey: null });
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
  };

  const resetForm = () => {
    form.reset();
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <>
      <Helmet>
        <title>Manage Products - Admin Dashboard</title>
        <meta name="description" content="Manage product catalog for Luxury Jewels." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-20 bg-muted">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold font-serif mb-2">Manage Products</h1>
                <p className="text-muted-foreground">Add, edit, or remove products from your catalog</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) resetForm();
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="font-serif">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Bridal Necklace"

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
                                placeholder="Product description"
                                rows={4}
                                {...field}
                                className="text-foreground placeholder:text-muted-foreground resize-none"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (₹)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="25000"
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
                        name="image"
                        render={() => (
                          <FormItem>
                            <FormLabel>Product Image</FormLabel>
                            <FormControl>
                              <div className="mt-2">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  className="text-foreground"
                                  onChange={handleImageChange}
                                />
                                {imagePreview && (
                                  <div className="mt-4 relative inline-block">
                                    <img
                                      src={imagePreview}
                                      alt="Preview"
                                      className="w-32 h-32 object-cover rounded-lg shadow-sm border border-border"
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setImageFile(null);
                                        setImagePreview(null);
                                      }}
                                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-3">
                        <Button type="submit" className="flex-1">
                          {editingProduct ? 'Update Product' : 'Create Product'}
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
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-card rounded-2xl overflow-hidden shadow-sm flex flex-col">
                    <div className="aspect-square relative bg-muted">
                      {product.image ? (
                        <img
                          src={pb.files.getUrl(product, product.image, { thumb: '300x300' })}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Package className="w-16 h-16 opacity-20" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-xl font-semibold mb-2 font-serif">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.expand?.category?.name || 'No Category'}
                      </p>
                      {product.price && (
                        <p className="text-lg font-bold text-primary mb-4">
                          ₹{Number(product.price).toLocaleString('en-IN')}
                        </p>
                      )}
                      <div className="flex gap-2 mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card rounded-2xl">
                <div className="w-24 h-24 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 font-serif">No products yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by adding your first product to the catalog
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
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

export default AdminProducts;