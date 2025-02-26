"use client";
// pages/inventory.tsx
import { useState, useRef } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { RiAddFill, RiSearchLine } from "react-icons/ri";
import ui from "@/app/data/ui.json";

// Тип для елементу інвентарю
type InventoryItem = {
  id: number | null;
  category: string | null;
  name: string | null;
  thickness: string | null;
  length: string | null;
  width: string | null;
  note: string | null;
};

// Функція для отримання даних з API
const fetchInventory = async (): Promise<InventoryItem[]> => {
  const { data } = await axios.get("/api/inventory");
  return data;
};

export default function InventoryPage() {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Запит даних з використанням react-query
  const {
    data: inventory,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
  });

  // Фільтрація даних
  const filteredInventory = inventory?.filter((item) => {
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    const matchesSearch = searchTerm ? item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || (item.note && item.note.toLowerCase().includes(searchTerm.toLowerCase())) : true;
    return matchesCategory && matchesSearch;
  });

  // Отримання унікальних категорій для фільтра
  const categories = inventory ? [...new Set(inventory.map((item) => item.category))] : [];

  // Функція для обробки редагування товару
  const handleEditItem = (item: InventoryItem) => {
    setEditingItem({ ...item });
    setIsDialogOpen(true);
  };

  const handleNewItem = () => {
    setEditingItem({ id: null, category: "", name: "", thickness: "", length: "", width: "", note: "" });
    setIsDialogOpen(true);
  };

  // Функція для збереження змін
  const handleSaveChanges = async () => {
    if (!editingItem) return;

    if (editingItem.id === null) {
      try {
        await axios.post(`/api/inventory/add`, editingItem);
        refetch(); // Оновлюємо дані після додавання
        setIsDialogOpen(false);
        setEditingItem(null);
      } catch (error) {
        console.error("Error creating item:", error);
        // Тут можна додати повідомлення про помилку
      }
      return;
    } else {
      try {
        await axios.put(`/api/inventory/update/${editingItem.id}`, editingItem);
        refetch(); // Оновлюємо дані після редагування
        setIsDialogOpen(false);
        setEditingItem(null);
      } catch (error) {
        console.error("Error updating item:", error);
        // Тут можна додати повідомлення про помилку
      }
    }
  };

  // Функція для обробки чекбоксів
  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    }
  };

  // Функція для вибору/скасування вибору всіх елементів
  const handleSelectAll = (checked: boolean) => {
    if (checked && filteredInventory) {
      setSelectedItems(filteredInventory.map((item) => item.id).filter((id): id is number => id !== null));
    } else {
      setSelectedItems([]);
    }
  };

  // Функція для видалення вибраних елементів
  const handleDeleteSelected = async () => {
    try {
      // Послідовно видаляємо всі вибрані елементи
      await Promise.all(selectedItems.map((id) => axios.delete(`/api/inventory/delete/${id}`)));

      // Оновлюємо дані та скидаємо вибір
      refetch();
      setSelectedItems([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting items:", error);
      // Тут можна додати повідомлення про помилку
    }
  };

  return (
    <>
      <div className="topBar flex items-center p-6">
        <Button variant="default" onClick={handleNewItem}>
          <RiAddFill style={{ width: "24px", height: "24px" }} />
          {ui.global.add_line}
        </Button>
      </div>

      <div className="py-8">
        <div className=" p-6">
          <div>
            {/* Фільтри */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/3">
                <Select value={categoryFilter === null ? "null" : categoryFilter} onValueChange={(value) => setCategoryFilter(value === "null" ? null : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={ui.global.all_categories} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="none" value="null">
                      Всі категорії
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category || "null"}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full md:w-2/3 relative">
                <RiSearchLine className="absolute opacity-50 top-3 left-3" style={{ width: "16px", height: "16px" }} />
                <Input className="pl-9" placeholder={ui.global.search_placeholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>

            {/* Панель з кнопкою видалення */}
            {selectedItems.length > 0 && (
              <div className="flex items-center justify-between gap-2 mt-4 mb-4 sm:mt-0 bg-muted p-2 rounded-md">
                <span className="text-sm font-medium">
                  {ui.global.selected}: {selectedItems.length}
                </span>
                <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  {ui.global.delete}
                </Button>
              </div>
            )}

            {/* Таблиця з даними */}
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isError ? (
              <div className="text-center text-red-500 py-8">Помилка завантаження даних. Спробуйте оновити сторінку.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>{filteredInventory?.length || 0} найменувань</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">{filteredInventory && filteredInventory.length > 0 && <Checkbox checked={filteredInventory.length > 0 && selectedItems.length === filteredInventory.length} onCheckedChange={handleSelectAll} aria-label={ui.global.select_all} />}</TableHead>
                      <TableHead>{ui.global.category}</TableHead>
                      <TableHead>{ui.global.name}</TableHead>
                      <TableHead className="text-right">{ui.global.thickness_mm}</TableHead>
                      <TableHead className="text-right">{ui.global.length_mm}</TableHead>
                      <TableHead className="text-right">{ui.global.width_mm}</TableHead>
                      <TableHead>{ui.global.note}</TableHead>
                      <TableHead className="text-right">{ui.global.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory && filteredInventory.length > 0 ? (
                      filteredInventory.map((item) => (
                        <TableRow key={item.id ?? undefined} className={item.id !== null && selectedItems.includes(item.id) ? "bg-zinc-100 dark:bg-zinc-900" : ""}>
                          <TableCell>
                            <Checkbox checked={item.id !== null && selectedItems.includes(item.id)} onCheckedChange={(checked) => item.id !== null && handleCheckboxChange(item.id, checked === true)} aria-label={`${ui.global.select} ${item.name}`} />
                          </TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell className="font-medium">{item.name || "-"}</TableCell>
                          <TableCell className="text-right">{item.thickness || "-"}</TableCell>
                          <TableCell className="text-right">{item.length || "-"}</TableCell>
                          <TableCell className="text-right">{item.width || "-"}</TableCell>
                          <TableCell>{item.note || "-"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleEditItem(item)} title="Редагувати">
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-24">
                          {ui.global.items_not_found}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>

        {/* Діалогове вікно для редагування */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{ui.global.edit_item}</DialogTitle>
              <DialogDescription>{ui.global.edit_item_description}</DialogDescription>
            </DialogHeader>

            {editingItem && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    {ui.global.category}
                  </Label>
                  <Input id="category" value={editingItem.category || ""} onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })} className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    {ui.global.name}
                  </Label>
                  <Input id="name" value={editingItem.name || ""} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="thickness" className="text-right">
                    {ui.global.thickness_mm}
                  </Label>
                  <Input id="thickness" value={editingItem.thickness || ""} onChange={(e) => setEditingItem({ ...editingItem, thickness: e.target.value })} className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="length" className="text-right">
                    {ui.global.length_mm}
                  </Label>
                  <Input id="length" value={editingItem.length || ""} onChange={(e) => setEditingItem({ ...editingItem, length: e.target.value })} className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="width" className="text-right">
                    {ui.global.width_mm}
                  </Label>
                  <Input id="width" value={editingItem.width || ""} onChange={(e) => setEditingItem({ ...editingItem, width: e.target.value })} className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="note" className="text-right">
                    {ui.global.note}
                  </Label>
                  <Input id="note" value={editingItem.note || ""} onChange={(e) => setEditingItem({ ...editingItem, note: e.target.value || null })} className="col-span-3" />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                {ui.global.cancel}
              </Button>
              <Button onClick={handleSaveChanges}>{ui.global.save}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Діалогове вікно для підтвердження видалення */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{ui.global.delete_items}</AlertDialogTitle>
              <AlertDialogDescription>{ui.global.delete_items_description.replace("{count}", selectedItems.length.toString())}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Скасувати</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteSelected} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Видалити
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
}
