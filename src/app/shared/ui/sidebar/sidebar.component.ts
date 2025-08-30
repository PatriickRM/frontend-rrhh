import { Component, Inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/application/auth.service';
import { AUTH_SERVICE } from '../../tokens/di-tokens';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  constructor(@Inject(AUTH_SERVICE) public auth: AuthService, private router: Router) {}

  handleLogout(event: Event) {
  event.preventDefault(); 
  this.auth.logout(); 
  this.router.navigate(['/login']); 
}
}
