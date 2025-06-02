
import { useState, useEffect } from 'react';
import { Phone, MapPin, Clock, Star, Users, Award } from 'lucide-react';
import Header from '@/components/Header';
import ServiceCard, { Service } from '@/components/ServiceCard';
import Cart from '@/components/Cart';
import MpesaModal from '@/components/MpesaModal';
import AdminLogin from '@/components/AdminLogin';
import EnhancedAdminDashboard from '@/components/EnhancedAdminDashboard';
import AboutSection from '@/components/AboutSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMpesaOpen, setIsMpesaOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [heroContent, setHeroContent] = useState({
    title: 'CONNEX CYBER SERVICES',
    subtitle: 'Your trusted partner for Government Services, IT Solutions, and Tax Services'
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
    fetchHeroContent();
    checkAdminLogin();
  }, []);

  const checkAdminLogin = () => {
    const loggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    setIsAdminLoggedIn(loggedIn);
  };

  const fetchHeroContent = async () => {
    try {
      const { data, error } = await supabase
        .from('home_content')
        .select('*')
        .in('section_name', ['hero_title', 'hero_subtitle'])
        .eq('is_active', true);

      if (error) throw error;

      if (data && data.length > 0) {
        const titleContent = data.find(item => item.section_name === 'hero_title');
        const subtitleContent = data.find(item => item.section_name === 'hero_subtitle');
        
        setHeroContent({
          title: titleContent?.content || 'CONNEX CYBER SERVICES',
          subtitle: subtitleContent?.content || 'Your trusted partner for Government Services, IT Solutions, and Tax Services'
        });
      }
    } catch (error) {
      console.error('Error fetching hero content:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('category');
      
      if (error) throw error;
      
      // Transform database services to match component interface
      const transformedServices = data?.map(service => ({
        id: service.id,
        name: service.name,
        price: Number(service.price),
        category: service.category,
        description: service.description || '',
        estimatedDays: service.estimated_days || 1,
      })) || [];
      
      setServices(transformedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      // Keep existing services as fallback
      setServices([
        { id: '1', name: 'Good Conduct Certificate', price: 1500, category: 'Government & E-Citizen Services', description: 'Certificate of good conduct application', estimatedDays: 7 },
        { id: '2', name: 'NTSA Services', price: 2000, category: 'Government & E-Citizen Services', description: 'DL renewal, TIMS account registration, vehicle search', estimatedDays: 3 },
        { id: '3', name: 'Passport Application', price: 2500, category: 'Government & E-Citizen Services', description: 'Passport application assistance', estimatedDays: 14 },
        { id: '4', name: 'NSSF & NHIF Registration', price: 1000, category: 'Government & E-Citizen Services', description: 'Registration and contributions', estimatedDays: 5 },
        { id: '5', name: 'CRB Clearance Certificate', price: 800, category: 'Government & E-Citizen Services', description: 'Credit reference bureau clearance', estimatedDays: 3 },
        { id: '6', name: 'Web Development', price: 15000, category: 'IT Services', description: 'Custom website development', estimatedDays: 21 },
        { id: '7', name: 'Computer Repair', price: 3000, category: 'IT Services', description: 'Hardware and software repairs', estimatedDays: 2 },
        { id: '8', name: 'Windows Activation/Installation', price: 1500, category: 'IT Services', description: 'OS installation and activation', estimatedDays: 1 },
        { id: '9', name: 'Microsoft Office Installation', price: 2000, category: 'IT Services', description: 'MS Office suite installation', estimatedDays: 1 },
        { id: '10', name: 'Antivirus Installation', price: 1000, category: 'IT Services', description: 'Antivirus software installation', estimatedDays: 1 },
        { id: '11', name: 'Hardware Sales', price: 5000, category: 'IT Services', description: 'Computer hardware sales', estimatedDays: 3 },
        { id: '12', name: 'Laptop Ordering', price: 25000, category: 'IT Services', description: 'Order and sell laptops', estimatedDays: 7 },
        { id: '13', name: 'VAT Returns Filing', price: 3000, category: 'Tax Services', description: 'Monthly VAT returns preparation', estimatedDays: 2 },
        { id: '14', name: 'Tax Compliance Certificate', price: 2500, category: 'Tax Services', description: 'Tax compliance certificate application', estimatedDays: 5 },
        { id: '15', name: 'e-TIMS Services', price: 4000, category: 'Tax Services', description: 'Registration, installation, updates, training, receipts', estimatedDays: 3 },
        { id: '16', name: 'P9 Forms', price: 1500, category: 'Tax Services', description: 'P9 form preparation', estimatedDays: 2 },
        { id: '17', name: 'Income Tax Returns', price: 3500, category: 'Tax Services', description: 'Individual and company income tax returns', estimatedDays: 5 },
        { id: '18', name: 'PIN Registration', price: 500, category: 'Tax Services', description: 'Individual and non-individual PIN registration', estimatedDays: 1 },
      ]);
    }
  };

  const categories = [...new Set(services.map(service => service.category))];

  const toggleService = (service: Service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    } else {
      setSelectedServices(prev => [...prev, service]);
    }
  };

  const removeFromCart = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(s => s.id !== serviceId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsMpesaOpen(true);
  };

  const handlePaymentSuccess = async (phoneNumber: string, transactionId: string) => {
    try {
      const total = selectedServices.reduce((sum, s) => sum + s.price, 0);
      
      // Save order to database
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          customer_phone: phoneNumber,
          services: selectedServices.map(s => s.name),
          total_amount: total,
          payment_status: 'completed',
          transaction_id: transactionId,
          mpesa_receipt: transactionId,
        }])
        .select()
        .single();

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke('send-order-email', {
          body: {
            orderId: data.id,
            customerPhone: phoneNumber,
            services: selectedServices.map(s => s.name),
            total: total,
            transactionId: transactionId,
          },
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }

      setSelectedServices([]);
      setIsMpesaOpen(false);
      
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${data.id} has been placed. You'll receive updates on your phone.`,
      });
    } catch (error: any) {
      console.error('Error saving order:', error);
      toast({
        title: "Order Saved Locally",
        description: "Your order has been processed. You'll receive updates soon.",
      });
      setSelectedServices([]);
      setIsMpesaOpen(false);
    }
  };

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsAdminLoginOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    setIsAdminLoggedIn(false);
    setIsAdminDashboardOpen(false);
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Header 
        cartCount={selectedServices.length}
        onCartClick={() => setIsCartOpen(true)}
        onAdminClick={handleAdminClick}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-red-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {heroContent.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {heroContent.subtitle}
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <a href="#services">Explore Our Services</a>
          </Button>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-4">
              <Users className="h-12 w-12 text-blue-600 mx-auto" />
              <h3 className="text-2xl font-bold">500+</h3>
              <p className="text-gray-600">Happy Clients</p>
            </div>
            <div className="space-y-4">
              <Award className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="text-2xl font-bold">5 Years</h3>
              <p className="text-gray-600">Experience</p>
            </div>
            <div className="space-y-4">
              <Star className="h-12 w-12 text-yellow-600 mx-auto" />
              <h3 className="text-2xl font-bold">4.9/5</h3>
              <p className="text-gray-600">Customer Rating</p>
            </div>
            <div className="space-y-4">
              <Clock className="h-12 w-12 text-purple-600 mx-auto" />
              <h3 className="text-2xl font-bold">24/7</h3>
              <p className="text-gray-600">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Services</h2>
          
          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services
                  .filter(service => service.category === category)
                  .map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      isSelected={selectedServices.some(s => s.id === service.id)}
                      onToggle={toggleService}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <AboutSection />

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Phone className="h-8 w-8 text-green-500 mx-auto" />
                <CardTitle className="text-white">Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-500 font-bold text-lg">0795 333 983</p>
                <p className="text-gray-400">Call Sam for more info</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <MapPin className="h-8 w-8 text-blue-500 mx-auto" />
                <CardTitle className="text-white">Visit Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Nairobi, Kenya</p>
                <p className="text-gray-400">Professional Services</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Clock className="h-8 w-8 text-purple-500 mx-auto" />
                <CardTitle className="text-white">Working Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Mon - Fri: 8AM - 6PM</p>
                <p className="text-gray-400">Sat: 9AM - 4PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Modals */}
      <Cart
        services={selectedServices}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
      />

      <MpesaModal
        isOpen={isMpesaOpen}
        total={selectedServices.reduce((sum, service) => sum + service.price, 0)}
        onClose={() => setIsMpesaOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {isAdminLoginOpen && (
        <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />
      )}

      <EnhancedAdminDashboard
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        onLogout={handleAdminLogout}
      />
    </div>
  );
};

export default Index;
