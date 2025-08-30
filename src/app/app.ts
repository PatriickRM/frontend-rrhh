import { Component, Inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AUTH_SERVICE } from './shared/tokens/di-tokens';
import { AuthService } from './features/auth/application/auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [RouterOutlet]
})
export class App {
  constructor(@Inject(AUTH_SERVICE) public auth: AuthService, private router: Router){}
  logout(){
    this.auth.logout();
    this.router.navigateByUrl('/login')
  }
}
