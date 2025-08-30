import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../../features/auth/application/auth.service';
import { Inject } from '@angular/core';
import { AUTH_SERVICE } from '../../tokens/di-tokens';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  constructor(@Inject(AUTH_SERVICE) public auth: AuthService) {}

  logout() {
    this.auth.logout();
  }

  toggleDarkMode() {
    document.body.classList.toggle('dark-mode-variables');
    document.querySelectorAll('.dark-mode span').forEach(span => span.classList.toggle('active'));
  }
}
