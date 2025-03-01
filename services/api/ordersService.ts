import api from './index';
import axios from 'axios';

interface OrderData {
  id: number;
  status?: string;
  comment?: string;
}

export const ordersService = {
  // Get all orders
  getAllOrders: async (): Promise<any> => {
    const response = await api.get(`/orders`);
    return response.data;
  },

  // Get information about a specific order
  getOrderById: async (number: number): Promise<any> => {
    const response = await api.get(`/orders/${number}`);
    return response.data;
  },

  // Get files related to the order
  getOrderFiles: async (number: number): Promise<any> => {
    const response = await api.get(`/orders/files/${number}`);
    return response.data;
  },

  // Upload files
  uploadFiles: async (formData: FormData): Promise<any> => {
    const response = await axios.post('/api/sales/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (data: {
    number: number;
    status: string;
  }): Promise<any> => {
    const response = await api.post('/orders/update/status', data);
    return response.data;
  },

  // Update order data
  updateOrder: async (data: OrderData): Promise<any> => {
    const response = await api.post('/orders/update', data);
    return response.data;
  },

  // Update comment
  updateComment: async (data: {
    id: number;
    comment: string;
  }): Promise<any> => {
    const response = await api.post('/orders/update/comment', data);
    return response.data;
  },
};
