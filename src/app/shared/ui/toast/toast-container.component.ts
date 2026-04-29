import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite">
      <div
        *ngFor="let toast of toastService.toasts()"
        class="toast toast-{{ toast.type }}"
        (click)="toastService.dismiss(toast.id)">
        <span class="toast-icon material-icons-sharp">{{ getIcon(toast.type) }}</span>
        <span class="toast-message">{{ toast.message }}</span>
        <button class="toast-close" (click)="toastService.dismiss(toast.id)">
          <span class="material-icons-sharp">close</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: .6rem;
      max-width: 380px;
    }
    .toast {
      display: flex;
      align-items: center;
      gap: .75rem;
      padding: .85rem 1rem;
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0,0,0,.14);
      cursor: pointer;
      animation: slideIn .25s ease-out;
      font-size: .9rem;
      font-family: var(--font-sans, inherit);
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0);   opacity: 1; }
    }
    .toast-success  { background: #ecfdf5; color: #065f46; border-left: 4px solid #059669; }
    .toast-error    { background: #fef2f2; color: #991b1b; border-left: 4px solid #dc2626; }
    .toast-warning  { background: #fffbeb; color: #92400e; border-left: 4px solid #d97706; }
    .toast-info     { background: #eff6ff; color: #1e40af; border-left: 4px solid #3b82f6; }
    .toast-message  { flex: 1; }
    .toast-icon     { font-size: 18px; flex-shrink: 0; }
    .toast-close    { background: none; border: none; cursor: pointer; color: inherit; opacity: .6; padding: 0; }
    .toast-close:hover { opacity: 1; }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'check_circle',
      error:   'error',
      warning: 'warning',
      info:    'info'
    };
    return icons[type] ?? 'notifications';
  }
}