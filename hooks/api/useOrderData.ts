import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersService } from "@/services";

// Fetching sales data
export function useOrderData(slug: number) {
  return useQuery({
    queryKey: ["orders", slug],
    queryFn: () => ordersService.getOrderById(slug),
    enabled: !!slug, // Query runs only if slug exists
  });
}

// Fetching sale files
export function useOrderFiles(slug: number) {
  return useQuery({
    queryKey: ["files", slug],
    queryFn: () => ordersService.getOrderFiles(slug),
    enabled: !!slug,
  });
}

// Updating order status
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { number: number; status: string }) => ordersService.updateOrderStatus(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders", variables.number] });
    },
  });
}

// Updating comment
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: number; comment: string }) => ordersService.updateComment(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders", variables.id] });
    },
  });
}
