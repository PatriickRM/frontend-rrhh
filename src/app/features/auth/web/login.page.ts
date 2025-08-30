import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AUTH_SERVICE } from '../../../shared/tokens/di-tokens';
import { AuthService } from '../application/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login.page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.page.html',
  styleUrl: './login.page.css'
})
export class LoginPage {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(AUTH_SERVICE) public auth: AuthService
  ){
    this.form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  }



  submit(){
    if (this.form.invalid || this.loading){
      return;
    }
    this.loading = true;
    this.error = null;

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.loading = false;
        this.error = 'Credenciales incorrectas o error de red';
      }
    });
  }
}
