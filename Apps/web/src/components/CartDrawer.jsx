import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Minus, Heart, MessageCircle } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { WHATSAPP_NUMBER } from '@/config/seo';
import { ScrollArea } from '@/components/ui/scroll-area';

const CartDrawer = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();
  const { formatPrice } = useCurrency();

  const handleCheckout = () => {
    const itemsList = cart.map(item => 
      `- ${item.name} (Qty: ${item.quantity}, Price: ${formatPrice(item.price * item.quantity)})`
    ).join('\n');
    
    const message = `Hi Inayat Royale, I'd like to inquire about the following items in my wishlist:\n\n${itemsList}\n\n*Total Estimate:* ${formatPrice(cartTotal)}\n\nPlease let me know the availability and next steps!`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="font-serif text-2xl flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-current" />
            My Wishlist
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col">
          {cart.length > 0 ? (
            <>
              <ScrollArea className="flex-1 p-6">
                <div className="space-y-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                        <img 
                          src={item.image ? pb.files.getUrl(item, Array.isArray(item.image) ? item.image[0] : item.image, { thumb: '100x100' }) : 'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cf4?w=100&h=100&fit=crop'} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm mb-1 truncate">{item.name}</h4>
                        <p className="text-primary font-bold text-sm mb-3">
                          {formatPrice(item.price)}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                            <button 
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-background rounded-md transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 flex items-center justify-center hover:bg-background rounded-md transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-6 border-t bg-muted/30 space-y-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold text-primary">{formatPrice(cartTotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  * Prices are estimates. Final quote will be shared on WhatsApp.
                </p>
                <Button 
                  onClick={handleCheckout}
                  className="w-full h-14 text-lg bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-xl shadow-[#25D366]/20 rounded-2xl"
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Inquire Wishlist on WhatsApp
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-xl font-bold font-serif mb-2">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-8">
                Build your royal collection by adding pieces you love.
              </p>
              <Button 
                onClick={() => setIsCartOpen(false)}
                variant="outline"
                className="rounded-xl px-8"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
