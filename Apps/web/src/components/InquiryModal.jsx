import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useInquiry } from '@/contexts/InquiryContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { WHATSAPP_NUMBER } from '@/config/seo';
import { User, Phone, MapPin, Hash, MessageCircle, CheckCircle2, ArrowRight, Package } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import pb from '@/lib/pocketbaseClient';

const INITIAL_FORM = { name: '', phone: '', address: '', pincode: '' };

const InquiryModal = () => {
  const { isOpen, inquiryData, closeInquiry } = useInquiry();
  const { formatPrice } = useCurrency();

  const [step, setStep] = useState(1); // 1 = customer details form, 2 = QR code
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.phone.trim() || !/^[\d\s+\-()]{10,}$/.test(form.phone.trim()))
      newErrors.phone = 'Enter a valid phone number';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.pincode.trim() || !/^\d{6}$/.test(form.pincode.trim()))
      newErrors.pincode = 'Enter a valid 6-digit pincode';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        isOrder: true,
        address: form.address,
        pincode: form.pincode,
        items: inquiryData.type === 'product'
          ? [{
              id: inquiryData.product.id,
              name: inquiryData.product.name,
              price: inquiryData.product.price,
              quantity: 1
            }]
          : inquiryData.items.map(item => ({
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: item.quantity
            })),
        total: inquiryData.type === 'product'
          ? (inquiryData.product.price || 0)
          : inquiryData.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
      };

      await pb.collection('contacts').create({
        name: form.name,
        phone: form.phone,
        message: JSON.stringify(orderPayload),
        status: 'new'
      }, { requestKey: null });

      setStep(2);
    } catch (error) {
      console.error('Failed to save order details:', error);
      toast.error('Failed to save order details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const buildWhatsAppMessage = () => {
    const header = `🛍️ *New Order Inquiry – Inayat Royale*\n\n`;

    const customer =
      `*Customer Details:*\n` +
      `👤 Name: ${form.name}\n` +
      `📱 Phone: ${form.phone}\n` +
      `📍 Address: ${form.address}\n` +
      `📮 Pincode: ${form.pincode}\n\n`;

    let items = '';
    if (inquiryData?.type === 'product') {
      const p = inquiryData.product;
      const cat = inquiryData.category?.name || '';
      const price = p.price ? formatPrice(p.price) : 'Price on request';
      const link = `${window.location.origin}/product/${p.id}`;
      items =
        `*Item Ordered:*\n` +
        `💎 ${p.name}${cat ? ` (${cat})` : ''}\n` +
        `💰 Price: ${price}\n` +
        `🔗 ${link}\n\n`;
    } else if (inquiryData?.type === 'wishlist') {
      const list = inquiryData.items
        .map((item, i) => {
          const price = item.price ? formatPrice(item.price * item.quantity) : 'Price on request';
          return `${i + 1}. ${item.name} × ${item.quantity} — ${price}`;
        })
        .join('\n');
      const total = inquiryData.items.reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity,
        0
      );
      items =
        `*Wishlist Items:*\n${list}\n\n` +
        `💰 Total Estimate: ${formatPrice(total)}\n\n`;
    }

    return header + customer + items + `Please confirm this order. Thank you! 🙏`;
  };

  const handleComplete = () => {
    const message = buildWhatsAppMessage();
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
    toast.success('Order details sent on WhatsApp!');
    handleClose();
  };

  const handleClose = () => {
    closeInquiry();
    // reset after dialog close animation finishes
    setTimeout(() => {
      setStep(1);
      setForm(INITIAL_FORM);
      setErrors({});
      setIsSubmitting(false);
    }, 300);
  };

  if (!inquiryData) return null;

  // Summary pills shown at the top of the modal
  const itemSummary =
    inquiryData.type === 'product'
      ? [{ name: inquiryData.product.name, price: inquiryData.product.price }]
      : inquiryData.items;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-3xl gap-0">
        {/* Gradient header bar */}
        <div className="bg-gradient-to-r from-primary/90 to-primary px-6 pt-6 pb-5">
          <DialogHeader>
            <DialogTitle className="text-primary-foreground font-serif text-xl flex items-center gap-2">
              <Package className="w-5 h-5" />
              {step === 1 ? 'Order Details' : 'Scan & Pay'}
            </DialogTitle>
          </DialogHeader>

          {/* Item chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            {itemSummary.slice(0, 3).map((item, i) => (
              <span
                key={i}
                className="text-xs bg-primary-foreground/20 text-primary-foreground px-3 py-1 rounded-full font-medium truncate max-w-[180px]"
              >
                {item.name}
              </span>
            ))}
            {itemSummary.length > 3 && (
              <span className="text-xs bg-primary-foreground/20 text-primary-foreground px-3 py-1 rounded-full font-medium">
                +{itemSummary.length - 3} more
              </span>
            )}
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-4">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all duration-300 ${
                  step >= s
                    ? 'bg-primary-foreground text-primary'
                    : 'bg-primary-foreground/30 text-primary-foreground'
                }`}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                {s < 2 && (
                  <div className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${
                    step > s ? 'bg-primary-foreground' : 'bg-primary-foreground/30'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-primary-foreground/70">Your Details</span>
            <span className="text-[10px] text-primary-foreground/70">Scan QR & Pay</span>
          </div>
        </div>

        {/* Step content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleFormSubmit}
                className="space-y-4"
              >
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Priya Sharma"
                      className={`pl-9 h-11 rounded-xl ${errors.name ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      type="tel"
                      placeholder="+91 98765 43210"
                      className={`pl-9 h-11 rounded-xl ${errors.phone ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="House No., Street, City"
                      className={`pl-9 h-11 rounded-xl ${errors.address ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                </div>

                {/* Pincode */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold">Pincode</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      name="pincode"
                      value={form.pincode}
                      onChange={handleChange}
                      placeholder="110001"
                      maxLength={6}
                      className={`pl-9 h-11 rounded-xl ${errors.pincode ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.pincode && <p className="text-xs text-destructive">{errors.pincode}</p>}
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-2xl mt-2 shadow-lg shadow-primary/20">
                  {isSubmitting ? 'Saving Order...' : 'Continue to Payment'}
                  {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center text-center"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Scan the QR code below using <span className="font-semibold text-foreground">PhonePe, GPay, or any UPI app</span> to complete your payment.
                </p>

                {/* QR Code */}
                <div className="bg-white rounded-2xl p-3 shadow-xl border border-border mb-4">
                  <img
                    src="/Inayat royale payment.jpeg"
                    alt="PhonePe UPI QR Code - Inayat Royale"
                    className="w-52 h-52 object-contain rounded-xl"
                  />
                </div>

                <p className="text-xs text-muted-foreground mb-6">
                  After paying, tap the button below to send your order details to us on WhatsApp.
                </p>

                <Button
                  onClick={handleComplete}
                  className="w-full h-14 text-base rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-xl shadow-[#25D366]/20"
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Done! Send Order on WhatsApp
                </Button>

                <button
                  onClick={() => setStep(1)}
                  className="mt-4 text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                >
                  ← Go back to edit details
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryModal;
