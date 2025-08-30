import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee, EmployeeRequest, EmployeeUpdate, EmployeeStatus, Gender, Position } from '../domain/model/employee';
import { Department } from '../../departments/domain/model/departments';
import { EMPLOYEES_SERVICE, DEPARTMENTS_SERVICE, POSITIONS_SERVICE } from '../../../shared/tokens/di-tokens';
import { EmployeesService } from '../application/employee.service';
import { DepartmentsService } from '../../departments/application/departments.service';
import { PositionsService } from '../../positions/application/positions.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.page.html',
  styleUrl: './employees.page.css'
})
export class EmployeesPage implements OnInit {
  private employeesService = inject<EmployeesService>(EMPLOYEES_SERVICE);
  private departmentsService = inject<DepartmentsService>(DEPARTMENTS_SERVICE);
  private positionsService = inject<PositionsService>(POSITIONS_SERVICE);

  empleados: Employee[] = [];
  departamentos: Department[] = [];
  posiciones: Position[] = [];
  loading = true;
  error: string | null = null;

  // Estados para modales
  showFormModal = false;
  showConfirmModal = false;
  showDetailsModal = false;
  showFiltersModal = false;

  selectedEmpleado: Employee | null = null;
  formMode: 'Agregar' | 'Editar' = 'Agregar';

  // Enums para el template
  EmployeeStatus = EmployeeStatus;
  Gender = Gender;

  // Filtros
  searchName: string = '';
  statusFilter: EmployeeStatus | '' = '';
  departmentFilter: number | '' = '';
  positionFilter: number | '' = '';

  ngOnInit(): void {
    this.fetchEmpleados();
    this.fetchDepartamentos();
    this.fetchPositions();
  }

  fetchEmpleados() {
    this.employeesService.list().subscribe({
      next: (data) => {
        // Solo mostramos empleados que NO están retirados
        this.empleados = data.filter(e => e.status !== EmployeeStatus.RETIRADO);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los empleados.';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  fetchDepartamentos() {
    this.departmentsService.list().subscribe({
      next: (data) => {
        this.departamentos = data.filter(d => d.enabled);
      },
      error: (err) => {
        console.error('Error al cargar departamentos:', err);
      }
    });
  }

  fetchPositions() {
    this.positionsService.list().subscribe({
      next: (data) => {
        this.posiciones = data;
      },
      error: (err) => {
        console.error('Error al cargar posiciones:', err);
      }
    });
  }

  abrirFormulario(modo: 'Agregar' | 'Editar', datos: Employee | null = null) {
    this.formMode = modo;
    this.selectedEmpleado = datos;
    this.showFormModal = true;
  }

  abrirConfirmacion(datos: Employee) {
    this.selectedEmpleado = datos;
    this.showConfirmModal = true;
  }

  abrirDetalles(datos: Employee) {
    this.selectedEmpleado = datos;
    this.showDetailsModal = true;
  }

  abrirFiltros() {
    this.showFiltersModal = true;
  }

  cerrarModal() {
    this.showFormModal = false;
    this.showConfirmModal = false;
    this.showDetailsModal = false;
    this.showFiltersModal = false;
    this.selectedEmpleado = null;
  }

  handleGuardar(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    if (this.formMode === 'Agregar') {
      const empleado: EmployeeRequest = {
        username: formData.get('username') as string,
        password: formData.get('password') as string,
        fullName: formData.get('fullName') as string,
        dni: formData.get('dni') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        dateOfBirth: formData.get('dateOfBirth') as string,
        hireDate: formData.get('hireDate') as string,
        contractEndDate: formData.get('contractEndDate') as string,
        positionId: Number(formData.get('positionId')),
        departmentId: Number(formData.get('departmentId')),
        salary: Number(formData.get('salary')),
        gender: formData.get('gender') as Gender,
      };

      this.employeesService.add(empleado).subscribe({
        next: () => {
          this.fetchEmpleados();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error guardando:', err);
          alert('Error al guardar el empleado: ' + (err.error?.message || 'Error desconocido'));
        },
      });
    } else if (this.selectedEmpleado) {
      const empleado: EmployeeUpdate = {
        fullName: formData.get('fullName') as string,
        dni: formData.get('dni') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        address: formData.get('address') as string,
        dateOfBirth: formData.get('dateOfBirth') as string,
        hireDate: formData.get('hireDate') as string,
        contractEndDate: formData.get('contractEndDate') as string,
        positionId: Number(formData.get('positionId')),
        departmentId: Number(formData.get('departmentId')),
        salary: Number(formData.get('salary')),
        status: formData.get('status') as EmployeeStatus,
        gender: formData.get('gender') as Gender,
      };

      this.employeesService.edit(this.selectedEmpleado.id!, empleado).subscribe({
        next: () => {
          this.fetchEmpleados();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error actualizando:', err);
          alert('Error al actualizar el empleado: ' + (err.error?.message || 'Error desconocido'));
        },
      });
    }
  }

  handleEliminar() {
    if (!this.selectedEmpleado) return;

    // Usar el endpoint de retiro
    this.employeesService.retire(this.selectedEmpleado.id!).subscribe({
      next: () => {
        this.fetchEmpleados(); // Recargar la lista
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al retirar el empleado.');
      }
    });
  }

  // Métodos de filtrado
  buscarPorNombre() {
    if (this.searchName.trim()) {
      this.employeesService.searchByName(this.searchName.trim()).subscribe({
        next: (data) => {
          this.empleados = data.filter(e => e.status !== EmployeeStatus.RETIRADO);
        },
        error: (err) => console.error('Error buscando:', err)
      });
    } else {
      this.fetchEmpleados();
    }
  }

    aplicarFiltros() {
    if (this.statusFilter) {
      this.employeesService.filterByStatus(this.statusFilter as EmployeeStatus).subscribe({
        next: (data) => {
          this.empleados = data;
        },
        error: (err) => console.error('Error filtrando por estado:', err)
      });
    } else if (this.departmentFilter) {
      this.employeesService.getByDepartment(this.departmentFilter as number).subscribe({
        next: (data) => {
          this.empleados = data.filter(e => e.status !== EmployeeStatus.RETIRADO);
        },
        error: (err) => console.error('Error filtrando por departamento:', err)
      });
    } else if (this.positionFilter) {
      this.employeesService.getByPosition(this.positionFilter as number).subscribe({
        next: (data) => {
          this.empleados = data.filter(e => e.status !== EmployeeStatus.RETIRADO);
        },
        error: (err) => console.error('Error filtrando por posición:', err)
      });
    } else {
      this.fetchEmpleados();
    }
    this.cerrarModal();
  }


  limpiarFiltros() {
    this.searchName = '';
    this.statusFilter = '';
    this.departmentFilter = '';
    this.positionFilter = '';
    this.fetchEmpleados();
    this.cerrarModal();
  }

  getDepartmentName(departmentName: string): string {
    return departmentName || 'Sin asignar';
  }

  getPositionName(positionTitle: string): string {
    return positionTitle || 'Sin asignar';
  }

  getStatusClass(status: EmployeeStatus): string {
    switch (status) {
      case EmployeeStatus.CONTRATADO:
        return 'status-active';
      case EmployeeStatus.FINALIZADO:
        return 'status-finalized';
      case EmployeeStatus.RETIRADO:
        return 'status-retired';
      default:
        return 'status-default';
    }
  }

  selectedDepartmentId: number | null = null;

  onDepartamentoChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const id = Number(select.value);
    this.selectedDepartmentId = id;
    this.posiciones = []; 

    if (id) {
      this.positionsService.getByDepartment(id).subscribe({
        next: (data) => {
          this.posiciones = data;
        },
        error: (err) => {
          console.error('Error cargando posiciones por departamento:', err);
        }
      });
    } 
  }

  getEmployeeInitials(fullName: string): string {
  return fullName.split(' ').map(name => name[0]).slice(0, 2).join('').toUpperCase();
}
}