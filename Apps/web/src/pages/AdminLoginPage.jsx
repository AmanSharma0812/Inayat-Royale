import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import BackButton from '@/components/BackButton';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const AdminLoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        toast.success('Login successful');
        navigate('/admin');
      } else {
        toast.error(result.error || 'Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Inayat Royale - Admin Login</title>
        <meta name="description" content="Admin login portal for Inayat Royale management system." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
        <div className="absolute top-8 left-8 z-20">
          <BackButton />
        </div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1656042744506-1d3c6e2b013e')] bg-cover bg-center opacity-10"></div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-2xl p-8 md:p-10">
            <div className="text-center mb-10">
              <img 
                src="/logo.png" 
                alt="Inayat Royale Logo" 
                className="h-28 w-auto object-contain mx-auto mb-6 drop-shadow-lg"
              />
              <h1 className="text-3xl font-bold font-serif mb-2">Admin Portal</h1>
              <p className="text-muted-foreground">Access the Inayat Royale management dashboard</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="admin@inayatroyale.com" 
                          {...field}
                          className="text-foreground placeholder:text-muted-foreground bg-background/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          {...field}
                          className="text-foreground placeholder:text-muted-foreground bg-background/50"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base mt-4" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Authenticating...' : 'Secure Login'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;