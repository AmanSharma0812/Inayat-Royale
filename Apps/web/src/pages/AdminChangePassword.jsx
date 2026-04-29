import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

const formSchema = z.object({
  oldPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Defined OUTSIDE the parent component to prevent re-creation on every render
// (inline component definitions break react-hook-form's FormField registration)
const PasswordInput = ({ control, fieldName, label, show, onToggle }) => (
  <FormField
    control={control}
    name={fieldName}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <div className="relative">
            <Input
              type={show ? 'text' : 'password'}
              placeholder="••••••••"
              {...field}
              className="pr-10 text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={onToggle}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

const AdminChangePassword = () => {
  const { currentAdmin, logout } = useAuth();
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logoutTimerRef = useRef(null);

  // Clean up logout timer if component unmounts before it fires
  useEffect(() => {
    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await pb.collection('_superusers').update(
        currentAdmin.id,
        {
          oldPassword:     data.oldPassword,
          password:        data.newPassword,
          passwordConfirm: data.confirmPassword,
        },
        { requestKey: null }
      );

      toast.success('Password changed successfully! Please log in again.');
      form.reset();

      // PocketBase invalidates the token after password change — log out
      logoutTimerRef.current = setTimeout(() => logout(), 1500);
    } catch (error) {
      const msg = error?.response?.message || error?.message || 'Unknown error';
      const fieldErrors = error?.response?.data;
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        Object.entries(fieldErrors).forEach(([field, err]) => {
          const formField = field === 'password' ? 'newPassword'
                          : field === 'passwordConfirm' ? 'confirmPassword'
                          : field;
          form.setError(formField, { message: err?.message || err });
        });
      } else {
        toast.error(`Failed to change password: ${msg}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Change Password - Admin Dashboard</title>
        <meta name="description" content="Change your admin account password." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-20 bg-muted">
          <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <KeyRound className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold font-serif">Change Password</h1>
                  <p className="text-muted-foreground text-sm">{currentAdmin?.email}</p>
                </div>
              </div>
              <p className="text-muted-foreground">
                Update your admin account password. You'll be logged out after a successful change.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                  <PasswordInput
                    control={form.control}
                    fieldName="oldPassword"
                    label="Current Password"
                    show={showOld}
                    onToggle={() => setShowOld((v) => !v)}
                  />

                  <div className="border-t border-border pt-4 space-y-6">
                    <PasswordInput
                      control={form.control}
                      fieldName="newPassword"
                      label="New Password"
                      show={showNew}
                      onToggle={() => setShowNew((v) => !v)}
                    />
                    <PasswordInput
                      control={form.control}
                      fieldName="confirmPassword"
                      label="Confirm New Password"
                      show={showConfirm}
                      onToggle={() => setShowConfirm((v) => !v)}
                    />
                  </div>

                  {/* Password strength hints */}
                  <ul className="text-xs text-muted-foreground space-y-1 bg-muted rounded-lg px-4 py-3">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-primary shrink-0" />
                      At least 8 characters long
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-3 h-3 text-primary shrink-0" />
                      Mix uppercase, lowercase and numbers for a stronger password
                    </li>
                  </ul>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Updating Password...
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4 mr-2" />
                        Update Password
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AdminChangePassword;
