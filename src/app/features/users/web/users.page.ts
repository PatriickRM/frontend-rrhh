import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { USERS_SERVICE } from '../../../shared/tokens/di-tokens';
import { UsersService } from '../application/users.service';
import { User } from '../domain/model/users';
import { ROLES } from '../../../shared/constants/roles';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.css']
})
export class UsersPage implements OnInit {
  private usersService = inject<UsersService>(USERS_SERVICE);

  users: User[] = [];
  loading = true;
  error: string | null = null;

  // Roles disponibles
  roles = ROLES;

  // Estados para modales
  showFormModal = false;
  showConfirmModal = false;
  showDetailsModal = false;

  selectedUser: User | null = null;
  formMode: 'Agregar' | 'Editar' = 'Agregar';

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.usersService.list().subscribe({
      next: data => {
        this.users = data.filter(u => u.enabled);
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los usuarios.';
        this.loading = false;
      }
    });
  }

  abrirFormulario(modo: 'Agregar' | 'Editar', datos: User | null = null) {
    this.formMode = modo;
    this.selectedUser = datos;
    this.showFormModal = true;
  }

  abrirConfirmacion(datos: User) {
    this.selectedUser = datos;
    this.showConfirmModal = true;
  }

  abrirDetalles(datos: User) {
    this.selectedUser = datos;
    this.showDetailsModal = true;
  }

  cerrarModal() {
    this.showFormModal = false;
    this.showConfirmModal = false;
    this.showDetailsModal = false;
    this.selectedUser = null;
  }

  handleGuardar(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const user: any = {
      username: formData.get('username') as string,
      fullName: formData.get('fullName') as string,
      password: formData.get('password') as string,
      roleId: Number(formData.get('roleId')),
      enabled: true
    };

    if (this.formMode === 'Agregar') {
      this.usersService.add(user).subscribe({
        next: () => {
          this.fetchUsers();
          this.cerrarModal();
        },
        error: err => console.error('Error guardando usuario:', err)
      });
    } else if (this.selectedUser) {
      const updateUser = {
        username: user.username,
        fullName: user.fullName,
        roleId: user.roleId,
        enabled: this.selectedUser.enabled
      };

      this.usersService.changeStatus(this.selectedUser.id!, updateUser.enabled).subscribe({
        next: () => {
          this.fetchUsers();
          this.cerrarModal();
        },
        error: err => console.error('Error actualizando usuario:', err)
      });
    }
  }

  handleEliminar() {
    if (!this.selectedUser) return;

    this.usersService.remove(this.selectedUser.id!).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== this.selectedUser?.id);
        this.cerrarModal();
      },
      error: () => alert('Error al eliminar el usuario.')
    });
  }

  getRolesString(roles: string[] | undefined | null): string {
  return Array.isArray(roles) ? roles.join(', ') : '—';
}

}
