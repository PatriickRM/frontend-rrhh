import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Department } from '../domain/model/departments';
import { DEPARTMENTS_SERVICE } from '../../../shared/tokens/di-tokens';
import { DepartmentsService } from '../application/departments.service';

// 📦 librerías para exportar PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './departments.page.html',
  styleUrl: './departments.page.css'
})
export class DepartmentsPage implements OnInit {
  private departmentsService = inject<DepartmentsService>(DEPARTMENTS_SERVICE);

  departamentos: Department[] = [];
  allDepartamentos: Department[] = [];
  loading = true;
  error: string | null = null;

  showFormModal = false;
  showConfirmModal = false;
  showDetailsModal = false;

  selectedDepartamento: Department | null = null;
  formMode: 'Agregar' | 'Editar' = 'Agregar';

  mostrarSoloDeshabilitados = false;

  ngOnInit(): void {
    this.fetchDepartamentos();
  }

  fetchDepartamentos() {
    this.departmentsService.list().subscribe({
      next: (data) => {
        this.allDepartamentos = data;
        this.aplicarFiltro();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los departamentos.';
        this.loading = false;
      }
    });
  }

  aplicarFiltro() {
    this.departamentos = this.allDepartamentos.filter(d =>
      this.mostrarSoloDeshabilitados ? !d.enabled : d.enabled
    );
  }

  toggleFiltro() {
    this.mostrarSoloDeshabilitados = !this.mostrarSoloDeshabilitados;
    this.aplicarFiltro();
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
    this.showFormModal = false;
    this.showConfirmModal = false;
    this.showDetailsModal = false;
    this.selectedDepartamento = null;
  }

  handleGuardar(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const departamento: Partial<Department> = {
      code: formData.get('codigo') as string,
      name: formData.get('nombre') as string,
      description: formData.get('descripcion') as string,
      enabled: true,
    };

    if (this.formMode === 'Agregar') {
      this.departmentsService.add(departamento).subscribe({
        next: () => {
          this.fetchDepartamentos();
          this.cerrarModal();
        },
        error: (err) => console.error('Error guardando:', err),
      });
    } else if (this.selectedDepartamento) {
      this.departmentsService.edit(this.selectedDepartamento.id!, departamento).subscribe({
        next: () => {
          this.fetchDepartamentos();
          this.cerrarModal();
        },
        error: (err) => console.error('Error actualizando:', err),
      });
    }
  }

  handleEliminar() {
    if (!this.selectedDepartamento) return;

    this.departmentsService.changeStatus(this.selectedDepartamento.id!, false).subscribe({
      next: () => {
        this.allDepartamentos = this.allDepartamentos.map(d =>
          d.id === this.selectedDepartamento?.id ? { ...d, enabled: false } : d
        );
        this.aplicarFiltro();
        this.cerrarModal();
      },
      error: () => alert('Error al eliminar el departamento.')
    });
  }

  // 📄 Exportar la tabla a PDF
  exportarPDF() {
    const doc = new jsPDF();

    // Título dinámico
    const titulo = this.mostrarSoloDeshabilitados
      ? 'Reporte de Departamentos Deshabilitados'
      : 'Reporte de Departamentos Habilitados';

    doc.setFontSize(16);
    doc.text(titulo, 14, 15);

    // Fecha y hora de generación
    const fecha = new Date();
    doc.setFontSize(10);
    doc.text(`Generado el: ${fecha.toLocaleString()}`, 14, 22);

    // Columnas y filas
    const columns = ['Código', 'Nombre', 'Descripción', 'Estado'];
    const rows = this.departamentos.map(dep => [
      dep.code,
      dep.name,
      dep.description || '',
      dep.enabled ? 'Habilitado' : 'Deshabilitado'
    ]);

    // Generar tabla
    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    // Nombre del archivo dinámico
    const fileName = this.mostrarSoloDeshabilitados
      ? 'departamentos_deshabilitados.pdf'
      : 'departamentos_habilitados.pdf';

    doc.save(fileName);
  }
}
