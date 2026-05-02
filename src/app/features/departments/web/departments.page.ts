import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Department } from '../domain/model/departments';
import { DEPARTMENTS_SERVICE } from '../../../shared/tokens/di-tokens';
import { DepartmentsService } from '../application/departments.service';
import { ToastService } from '../../../core/services/toast.service';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departments.page.html',
  styleUrl: './departments.page.css'
})
export class DepartmentsPage implements OnInit {
  private departmentsService = inject<DepartmentsService>(DEPARTMENTS_SERVICE);
  private toast = inject(ToastService);

  departamentos: Department[] = [];
  allDepartamentos: Department[] = [];
  loading = true;
  error: string | null = null;

  showFormModal    = false;
  showConfirmModal = false;
  showDetailsModal = false;

  selectedDepartamento: Department | null = null;
  formMode: 'Agregar' | 'Editar' = 'Agregar';

  mostrarSoloDeshabilitados = false;
  searchTerm = '';

  ngOnInit(): void {
    this.fetchDepartamentos();
  }

  fetchDepartamentos() {
    this.loading = true;
    this.departmentsService.list().subscribe({
      next: (data) => {
        this.allDepartamentos = data;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los departamentos.';
        this.loading = false;
      }
    });
  }

  aplicarFiltros() {
    let result = this.allDepartamentos.filter(d =>
      this.mostrarSoloDeshabilitados ? !d.enabled : d.enabled
    );
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(term) ||
        d.code.toLowerCase().includes(term) ||
        (d.description ?? '').toLowerCase().includes(term)
      );
    }
    this.departamentos = result;
  }

  onSearch() { this.aplicarFiltros(); }

  setFiltro(disabled: boolean) {
    this.mostrarSoloDeshabilitados = disabled;
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.searchTerm = '';
    this.mostrarSoloDeshabilitados = false;
    this.aplicarFiltros();
  }

  abrirFormulario(modo: 'Agregar' | 'Editar', datos: Department | null = null) {
    this.formMode = modo;
    this.selectedDepartamento = datos;
    this.showFormModal = true;
  }

  abrirConfirmacion(datos: Department) {
    this.selectedDepartamento = datos;
    this.showConfirmModal = true;
  }

  abrirDetalles(datos: Department) {
    this.selectedDepartamento = datos;
    this.showDetailsModal = true;
  }

  cerrarModal() {
    this.showFormModal    = false;
    this.showConfirmModal = false;
    this.showDetailsModal = false;
    this.selectedDepartamento = null;
  }

  handleGuardar(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const departamento: Partial<Department> = {
      code:        formData.get('codigo')      as string,
      name:        formData.get('nombre')      as string,
      description: formData.get('descripcion') as string,
      enabled:     true,
    };

    if (this.formMode === 'Agregar') {
      this.departmentsService.add(departamento).subscribe({
        next: () => {
          this.toast.success('Departamento creado correctamente');
          this.fetchDepartamentos();
          this.cerrarModal();
        },
        error: () => this.toast.error('Error al crear el departamento'),
      });
    } else if (this.selectedDepartamento) {
      this.departmentsService.edit(this.selectedDepartamento.id!, departamento).subscribe({
        next: () => {
          this.toast.success('Departamento actualizado');
          this.fetchDepartamentos();
          this.cerrarModal();
        },
        error: () => this.toast.error('Error al actualizar el departamento'),
      });
    }
  }

  handleEliminar() {
    if (!this.selectedDepartamento) return;
    this.departmentsService.changeStatus(this.selectedDepartamento.id!, false).subscribe({
      next: () => {
        this.toast.success('Departamento deshabilitado');
        this.allDepartamentos = this.allDepartamentos.map(d =>
          d.id === this.selectedDepartamento?.id ? { ...d, enabled: false } : d
        );
        this.aplicarFiltros();
        this.cerrarModal();
      },
      error: () => this.toast.error('Error al deshabilitar el departamento'),
    });
  }

  getInitials(name: string): string {
    return (name ?? '').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  }

  exportarPDF() {
    const doc = new jsPDF();
    const titulo = this.mostrarSoloDeshabilitados
      ? 'Reporte de Departamentos Deshabilitados'
      : 'Reporte de Departamentos Habilitados';

    doc.setFontSize(16);
    doc.text(titulo, 14, 15);
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
      head: [['Código', 'Nombre', 'Descripción', 'Estado']],
      body: this.departamentos.map(dep => [
        dep.code,
        dep.name,
        dep.description || '',
        dep.enabled ? 'Habilitado' : 'Deshabilitado',
      ]),
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] },
    });

    doc.save(this.mostrarSoloDeshabilitados
      ? 'departamentos_deshabilitados.pdf'
      : 'departamentos_habilitados.pdf');
  }
}