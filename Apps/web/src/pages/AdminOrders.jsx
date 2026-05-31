import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, ShoppingBag, Search, ExternalLink, Calendar, MapPin, Phone, User, Check, X, RefreshCw } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { useCurrency } from '@/contexts/CurrencyContext';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { formatPrice } = useCurrency();

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const result = await pb.collection('contacts').getList(1, 500, {
        sort: '-created',
        requestKey: null
      });

      // Filter and parse orders
      const parsedOrders = result.items
        .map(item => {
          try {
            const payload = JSON.parse(item.message);
            if (payload && payload.isOrder) {
              return {
                id: item.id,
                created: item.created,
                customerName: item.name,
                customerPhone: item.phone,
                address: payload.address,
                pincode: payload.pincode,
                items: payload.items || [],
                total: payload.total || 0,
                status: payload.status || 'pending',
                originalItem: item // hold original record to modify if needed
              };
            }
          } catch (e) {
            // Not a JSON order, skip
          }
          return null;
        })
        .filter(Boolean);

      setOrders(parsedOrders);
      setFilteredOrders(parsedOrders);
    } catch (error) {
      if (!pb.isAbort(error)) {
        toast.error('Failed to fetch order history');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders by search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOrders(orders);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = orders.filter(order => 
      order.customerName.toLowerCase().includes(query) ||
      order.customerPhone.includes(query) ||
      order.address.toLowerCase().includes(query) ||
      order.pincode.includes(query) ||
      order.items.some(item => item.name.toLowerCase().includes(query))
    );
    setFilteredOrders(filtered);
  }, [searchQuery, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const orderToUpdate = orders.find(o => o.id === orderId);
      if (!orderToUpdate) return;

      // Reconstruct payload and update message
      const updatedPayload = {
        isOrder: true,
        address: orderToUpdate.address,
        pincode: orderToUpdate.pincode,
        items: orderToUpdate.items,
        total: orderToUpdate.total,
        status: newStatus
      };

      await pb.collection('contacts').update(orderId, {
        message: JSON.stringify(updatedPayload)
      }, { requestKey: null });

      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error(error);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await pb.collection('contacts').delete(deleteId, { requestKey: null });
      toast.success('Order deleted successfully');
      setDeleteId(null);
      setIsDeleteDialogOpen(false);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to delete order');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium px-2 py-0.5 rounded-full text-xs">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-rose-500 hover:bg-rose-600 text-white font-medium px-2 py-0.5 rounded-full text-xs">Cancelled</Badge>;
      default:
        return <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-2 py-0.5 rounded-full text-xs">Pending</Badge>;
    }
  };

  return (
    <>
      <Helmet>
        <title>Order History - Admin | Inayat Royale</title>
        <meta name="description" content="View and manage customer order history and statuses." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-1 py-20 container mx-auto px-4 pt-8">
          <BackButton className="mb-8" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold font-serif mb-2 flex items-center gap-3">
                <ShoppingBag className="w-9 h-9 text-rose-500" />
                Customer Order History
              </h1>
              <p className="text-muted-foreground">Monitor client detail profiles and date-wise payment/order invoices</p>
            </div>
            
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search name, phone, items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-11 rounded-xl bg-card border-border"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Fetching orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-card hover:shadow-md transition-all duration-300 rounded-2xl border border-border p-6 flex flex-col lg:flex-row gap-6">
                  {/* Left Side: Customer & Invoice Details */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {order.created ? new Date(order.created).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {getStatusBadge(order.status)}
                        
                        <Select
                          value={order.status}
                          onValueChange={(val) => handleStatusChange(order.id, val)}
                        >
                          <SelectTrigger className="w-[120px] h-8 text-xs rounded-lg">
                            <SelectValue placeholder="Update Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Customer Details */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</h4>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" />
                            {order.customerName}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            {order.customerPhone}
                          </p>
                        </div>
                      </div>

                      {/* Delivery Profile */}
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Delivery Address</h4>
                        <div className="space-y-1">
                          <p className="text-sm text-foreground flex items-start gap-2 leading-relaxed">
                            <MapPin className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                            <span>
                              {order.address} <span className="font-semibold">({order.pincode})</span>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Order Items and Summary */}
                  <div className="lg:w-[400px] bg-muted/30 p-4 rounded-xl border border-border/40 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Order Items</h4>
                      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between items-start text-sm gap-2">
                            <span className="font-medium text-foreground truncate flex-1">
                              {item.name} <span className="text-muted-foreground text-xs font-normal">×{item.quantity}</span>
                            </span>
                            <span className="font-semibold text-foreground/90 whitespace-nowrap">
                              {item.price ? formatPrice(item.price * item.quantity) : 'Price on request'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border/50 pt-3 mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Estimate</p>
                        <p className="text-xl font-bold font-serif text-primary">{formatPrice(order.total)}</p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => handleDeleteClick(order.id)}
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border flex flex-col items-center justify-center p-8">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-2xl font-serif font-bold mb-2">No orders found</h3>
              <p className="text-muted-foreground max-w-sm">
                {searchQuery ? "No orders match your search criteria. Try a different query." : "Customer orders and inquiries will show up here once submitted."}
              </p>
            </div>
          )}
        </main>

        <Footer />
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Order History"
        description="Are you sure you want to permanently delete this order invoice from database history? This action cannot be undone."
        confirmText="Delete permanently"
        variant="destructive"
      />
    </>
  );
};

export default AdminOrders;
