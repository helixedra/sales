import api from "./index";

interface ItemData {
  id?: string;
  name: string;
  quantity: number;
  price: number;
}

export const itemsService = {
  // Create a new item
  createItem: async (itemData: ItemData) => {
    const response = await api.post("/items/create", itemData);
    return response.data;
  },

  // Update an item
  updateItem: async (itemData: ItemData) => {
    const response = await api.post("/items/update", itemData);
    return response.data;
  },

  // Delete an item
  deleteItem: async (itemId: string) => {
    const response = await api.delete(`/items/delete/${itemId}`);
    return response.data;
  },
};
