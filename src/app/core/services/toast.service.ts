import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  readonly toasts = signal<Toast[]>([]);

  success(message: string, duration = 3500): void {
    this.add(message, 'success', duration);
  }

  error(message: string, duration = 5000): void {
    this.add(message, 'error', duration);
  }

  warning(message: string, duration = 4000): void {
    this.add(message, 'warning', duration);
  }

  info(message: string, duration = 3500): void {
    this.add(message, 'info', duration);
  }

  dismiss(id: number): void {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  private add(message: string, type: ToastType, duration: number): void {
    const id = ++this.counter;
    this.toasts.update(list => [...list, { id, message, type }]);
    setTimeout(() => this.dismiss(id), duration);
  }
}