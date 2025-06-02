
import { useState } from 'react';
import { X, Download, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export interface Order {
  id: string;
  services: string[];
  total: number;
  customerPhone: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  transactionId: string;
  notes?: string;
}

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrder: (orderId: string, status: Order['status'], notes?: string) => void;
}

const AdminDashboard = ({ isOpen, onClose, orders, onUpdateOrder }: AdminDashboardProps) => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'in-progress': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    onUpdateOrder(orderId, newStatus, notes);
    setNotes('');
    setSelectedOrder(null);
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in-progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
    revenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0)
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Admin Dashboard</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">KSh {stats.revenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Revenue</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            {['all', 'pending', 'in-progress', 'completed'].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {orders
                  .filter(order => tab === 'all' || order.status === tab)
                  .map((order) => (
                    <Card key={order.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(order.status)}>
                              {getStatusIcon(order.status)}
                              {order.status.replace('-', ' ').toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-600">#{order.id}</span>
                          </div>
                          <p><strong>Phone:</strong> {order.customerPhone}</p>
                          <p><strong>Services:</strong> {order.services.join(', ')}</p>
                          <p><strong>Total:</strong> KSh {order.total.toLocaleString()}</p>
                          <p><strong>Date:</strong> {order.createdAt.toLocaleDateString()}</p>
                          <p><strong>Transaction ID:</strong> {order.transactionId}</p>
                          {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
                        </div>
                        <div className="space-y-2">
                          <Select
                            value={order.status}
                            onValueChange={(value) => handleUpdateStatus(order.id, value as Order['status'])}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="in-progress">In Progress</SelectItem>
                              <SelectItem value="completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Add Note
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
              </TabsContent>
            ))}
          </Tabs>

          {selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Add Note to Order #{selectedOrder.id}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Add notes about the order progress..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status)}
                      className="flex-1"
                    >
                      Update Note
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedOrder(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
