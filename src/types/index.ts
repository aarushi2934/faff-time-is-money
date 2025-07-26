import type { Task } from "../data/taskService";

export type { Task };

export interface CartItem {
  task: Task;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalTimeInMinutes: number;
}
