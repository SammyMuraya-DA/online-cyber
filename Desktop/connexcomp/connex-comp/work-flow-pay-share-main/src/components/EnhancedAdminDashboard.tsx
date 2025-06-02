
import { useState, useEffect } from 'react';
import { X, LogOut, Package, Home, Users, Settings, MessageCircle, Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  estimated_days: number;
  is_active: boolean;
}

interface Order {
  id: string;
  customer_phone: string;
  services: any;
  total_amount: number;
  payment_status: string;
  transaction_id: string;
  created_at: string;
}

interface HomeContent {
  id: string;
  section_name: string;
  title: string;
  content: string;
  is_active: boolean;
}

interface EnhancedAdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const EnhancedAdminDashboard = ({ isOpen, onClose, onLogout }: EnhancedAdminDashboardProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [homeContent, setHomeContent] = useState<HomeContent[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingContent, setEditingContent] = useState<HomeContent | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      fetchOrders();
      fetchHomeContent();
    }
  }, [isOpen]);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('category');
      
      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    }
  };

  const fetchHomeContent = async () => {
    try {
      const { data, error } = await supabase
        .from('home_content')
        .select('*')
        .order('section_name');
      
      if (error) throw error;
      setHomeContent(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch home content",
        variant: "destructive",
      });
    }
  };

  const handleSaveService = async (serviceData: Partial<Service>) => {
    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Service updated successfully" });
      } else {
        // Ensure all required fields are present for insert
        const insertData = {
          name: serviceData.name || '',
          description: serviceData.description || '',
          price: serviceData.price || 0,
          category: serviceData.category || 'IT Services',
          estimated_days: serviceData.estimated_days || 1,
          is_active: serviceData.is_active ?? true,
        };
        
        const { error } = await supabase
          .from('services')
          .insert([insertData]);
        
        if (error) throw error;
        toast({ title: "Success", description: "Service added successfully" });
      }
      
      setEditingService(null);
      setIsAddingService(false);
      fetchServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveContent = async (contentData: Partial<HomeContent>) => {
    try {
      if (editingContent) {
        const { error } = await supabase
          .from('home_content')
          .update({
            title: contentData.title,
            content: contentData.content,
            is_active: contentData.is_active ?? true,
          })
          .eq('id', editingContent.id);
        
        if (error) throw error;
        toast({ title: "Success", description: "Content updated successfully" });
      }
      
      setEditingContent(null);
      fetchHomeContent();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: "Success", description: "Service deleted successfully" });
      fetchServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const openWhatsApp = (phoneNumber: string, orderId: string) => {
    const message = encodeURIComponent(`Hello! Your order #${orderId} is being processed. We will notify you once it's ready. Thank you for choosing CONNEX CYBER SERVICES!`);
    window.open(`https://wa.me/${phoneNumber.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-7xl max-h-[95vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin Dashboard
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="orders" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Services
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Homepage Content
              </TabsTrigger>
            </TabsList>

            <div className="max-h-[70vh] overflow-y-auto p-6">
              <TabsContent value="orders" className="space-y-4">
                <div className="grid gap-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <p><strong>Order:</strong> #{order.id}</p>
                            <p><strong>Phone:</strong> {order.customer_phone}</p>
                            <p><strong>Services:</strong> {Array.isArray(order.services) ? order.services.join(', ') : 'N/A'}</p>
                            <p><strong>Total:</strong> KSh {order.total_amount?.toLocaleString()}</p>
                            <p><strong>Status:</strong> {order.payment_status}</p>
                            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <Button
                            onClick={() => openWhatsApp(order.customer_phone, order.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Notify Customer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="services" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Manage Services</h3>
                  <Button onClick={() => setIsAddingService(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {services.map((service) => (
                    <Card key={service.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-gray-600">{service.description}</p>
                            <p className="text-sm"><strong>Price:</strong> KSh {service.price}</p>
                            <p className="text-sm"><strong>Category:</strong> {service.category}</p>
                            <p className="text-sm"><strong>Days:</strong> {service.estimated_days}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingService(service)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteService(service.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Manage Homepage Content</h3>
                </div>
                
                <div className="grid gap-4">
                  {homeContent.map((content) => (
                    <Card key={content.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium capitalize">{content.section_name.replace('_', ' ')}</h4>
                            <p className="text-sm text-gray-600 mt-1">{content.title}</p>
                            <p className="text-sm mt-2">{content.content}</p>
                            <p className="text-xs text-gray-500 mt-2">
                              Status: {content.is_active ? 'Active' : 'Inactive'}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingContent(content)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Service Edit/Add Modal */}
      {(editingService || isAddingService) && (
        <ServiceEditModal
          service={editingService}
          onSave={handleSaveService}
          onClose={() => {
            setEditingService(null);
            setIsAddingService(false);
          }}
        />
      )}

      {/* Content Edit Modal */}
      {editingContent && (
        <ContentEditModal
          content={editingContent}
          onSave={handleSaveContent}
          onClose={() => setEditingContent(null)}
        />
      )}
    </div>
  );
};

// Service Edit Modal Component
const ServiceEditModal = ({ service, onSave, onClose }: any) => {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    price: service?.price || 0,
    category: service?.category || 'IT Services',
    estimated_days: service?.estimated_days || 1,
    is_active: service?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{service ? 'Edit Service' : 'Add Service'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="price">Price (KSh)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Government & E-Citizen Services">Government & E-Citizen Services</SelectItem>
                  <SelectItem value="IT Services">IT Services</SelectItem>
                  <SelectItem value="Tax Services">Tax Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="days">Estimated Days</Label>
              <Input
                id="days"
                type="number"
                value={formData.estimated_days}
                onChange={(e) => setFormData({...formData, estimated_days: Number(e.target.value)})}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Save</Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Content Edit Modal Component
const ContentEditModal = ({ content, onSave, onClose }: any) => {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    content: content?.content || '',
    is_active: content?.is_active ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Edit {content.section_name.replace('_', ' ')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={4}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Save</Button>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAdminDashboard;
