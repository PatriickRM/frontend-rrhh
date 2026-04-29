import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorage } from '../../../core/storage/token.storage';

@Component({
  selector: 'app-not-found',
  standalone: true,
  template: `
    <div class="not-found">
      <div class="not-found-card">
        <span class="material-icons-sharp icon">search_off</span>
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>La sección que buscas no existe o no tienes permisos para acceder.</p>
        <button (click)="goHome()" class="btn-primary">
          <span class="material-icons-sharp">home</span>
          Volver al inicio
        </button>
      </div>
    </div>
  `,
  styles: [`
    .not-found {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: var(--color-background);
    }
    .not-found-card {
      text-align: center;
      padding: 3rem 2rem;
      background: var(--color-white);
      border-radius: 16px;
      box-shadow: var(--box-shadow);
      max-width: 400px;
    }
    .icon {
      font-size: 64px;
      color: var(--color-primary);
      margin-bottom: 1rem;
    }
    h1 { font-size: 4rem; font-weight: 800; color: var(--color-primary); margin: 0; }
    h2 { font-size: 1.4rem; margin: .5rem 0 1rem; }
    p  { color: var(--color-dark-variant); margin-bottom: 2rem; }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: .5rem;
      background: var(--color-primary);
      color: white;
      border: none;
      padding: .75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
    }
    .btn-primary:hover { background: #5a85be; }
  `]
})
export class NotFoundPage {
  private router = inject(Router);
  private tokenStorage = inject(TokenStorage);

  goHome(): void {
    const user = this.tokenStorage.getUser();
    if (!user) { this.router.navigate(['/login']); return; }

    const route = user.rol === 'ROLE_CHRO'
      ? '/dashboard'
      : '/employee/dashboard';
    this.router.navigate([route]);
  }
}