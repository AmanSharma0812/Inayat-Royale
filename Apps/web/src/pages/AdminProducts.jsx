import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Pencil, Trash2, Plus, X, Package } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ConfirmDialog';
import { useCurrency } from '@/contexts/CurrencyContext';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  category: z.string().min(1, 'Please select a category'),
  price: z.string().optional(),
  image: z.any().optional(),
  video: z.any().optional(),
  status: z.string().optional()
});

const AdminProducts = () => {
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      price: '',
      image: undefined,
      video: undefined,
      status: 'normal'
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
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      if (files.length + imageFiles.length > 5) {
        toast.error('You can only upload up to 5 images');
        return;
      }

      const newFiles = [...imageFiles, ...files];
      setImageFiles(newFiles);

      const newPreviews = [];
      let loaded = 0;
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push(reader.result);
          loaded++;
          if (loaded === files.length) {
            setImagePreviews([...imagePreviews, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error('Video must be less than 20MB');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
  };

  const removeImage = (index) => {
    const newFiles = [...imageFiles];
    newFiles.splice(index, 1);
    setImageFiles(newFiles);

    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  const onSubmit = async (data) => {
    if (!editingProduct && imageFiles.length < 2) {
      toast.error('At least 2 images are required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      if (data.description) formData.append('description', data.description);
      if (data.category) formData.append('category', data.category);
      
      const priceVal = parseFloat(data.price);
      if (!isNaN(priceVal)) {
        formData.append('price', priceVal);
      }

      // Append all new image files
      imageFiles.forEach(file => {
        formData.append('image', file);
      });

      // Append new video file if any
      if (videoFile) {
        formData.append('video', videoFile);
      }
      
      if (data.status) formData.append('status', data.status);

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
      const data = error?.response?.data;
      if (data && Object.keys(data).length > 0) {
        // Map PocketBase field errors to the form
        Object.entries(data).forEach(([field, err]) => {
          toast.error(`${field}: ${err.message || 'Validation failed'}`);
          form.setError(field, { message: err.message });
        });
      } else {
        const msg = error?.response?.message || error?.message || 'Unknown error';
        toast.error(`Failed to save product: ${msg}`);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: product.price?.toString() || '',
      status: product.status || 'normal',
    });
    
    if (product.image && Array.isArray(product.image)) {
      const urls = product.image.map(img => pb.files.getUrl(product, img));
      setImagePreviews(urls);
    } else if (product.image && typeof product.image === 'string') {
      setImagePreviews([pb.files.getUrl(product, product.image)]);
    }

    if (product.video) {
      setVideoPreview(pb.files.getUrl(product, product.video));
    } else {
      setVideoPreview(null);
    }
    
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await pb.collection('products').delete(deleteId, { requestKey: null });
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    form.reset();
    setEditingProduct(null);
    setImageFiles([]);
    setImagePreviews([]);
    setVideoFile(null);
    setVideoPreview(null);
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <BackButton className="mb-8" />
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold font-serif mb-2">Manage Products</h1>
                <p className="text-muted-foreground">Add, edit, or remove products (Min 2 images required)</p>
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
                            <FormLabel>Product Images (Min 2, Max 5)</FormLabel>
                            <FormControl>
                              <div className="mt-2">
                                <Input
                                  type="file"
                                  accept="image/jpeg,image/png,image/webp,image/avif"
                                  multiple
                                  className="text-foreground mb-4"
                                  onChange={handleImageChange}
                                />
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                  {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative aspect-square">
                                      <img
                                        src={preview}
                                        alt={`Preview ${index}`}
                                        className="w-full h-full object-cover rounded-lg shadow-sm border border-border"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                  {imagePreviews.length < 5 && (
                                    <div className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center text-muted-foreground text-xs p-2 text-center">
                                      <Plus className="w-6 h-6 mb-1 opacity-20" />
                                      <span>Add Image</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Status / Badge</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Normal" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="normal">Normal</SelectItem>
                                <SelectItem value="limited">Limited Edition</SelectItem>
                                <SelectItem value="low_stock">Low Stock</SelectItem>
                                <SelectItem value="best_seller">Best Seller</SelectItem>
                                <SelectItem value="new_arrival">New Arrival</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="video"
                        render={() => (
                          <FormItem>
                            <FormLabel>Product Video (Optional, Max 20MB)</FormLabel>
                            <FormControl>
                              <div className="mt-2">
                                <Input
                                  type="file"
                                  accept="video/mp4,video/webm"
                                  className="text-foreground mb-4"
                                  onChange={handleVideoChange}
                                />
                                {videoPreview && (
                                  <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-black">
                                    <video 
                                      src={videoPreview} 
                                      className="w-full h-full object-contain"
                                      controls
                                    />
                                    <button
                                      type="button"
                                      onClick={removeVideo}
                                      className="absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors z-10"
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

                      <div className="flex gap-3 pt-4">
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
                      {Array.isArray(product.image) && product.image.length > 0 ? (
                        <img
                          src={pb.files.getUrl(product, product.image[0], { thumb: '300x300' })}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : product.image && typeof product.image === 'string' ? (
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
                          {formatPrice(product.price)}
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
                          onClick={() => {
                            setDeleteId(product.id);
                            setIsDeleteDialogOpen(true);
                          }}
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

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
      />
    </>
  );
};

export default AdminProducts;