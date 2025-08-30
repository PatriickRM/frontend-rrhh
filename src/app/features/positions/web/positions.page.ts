import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Position } from '../domain/model/positions';
import { POSITIONS_SERVICE, DEPARTMENTS_SERVICE } from '../../../shared/tokens/di-tokens';
import { PositionsService } from '../application/positions.service';
import { DepartmentsService } from '../../departments/application/departments.service';
import { Department } from '../../departments/domain/model/departments';

// 📦 librerías para exportar PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-positions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './positions.page.html',
  styleUrls: ['./positions.page.css']
})
export class PositionsPage implements OnInit {
  private positionsService = inject<PositionsService>(POSITIONS_SERVICE);
  private departmentsService = inject<DepartmentsService>(DEPARTMENTS_SERVICE);

  posiciones: Position[] = [];
  allPosiciones: Position[] = [];
  departamentos: Department[] = [];

  loading = true;
  error: string | null = null;

  // Estados para modales
  showFormModal = false;
  showConfirmModal = false;
  showDetailsModal = false;

  selectedPosition: Position | null = null;
  formMode: 'Agregar' | 'Editar' = 'Agregar';

  mostrarSoloDeshabilitados = false;

  ngOnInit(): void {
    this.fetchPositions();
    this.fetchDepartamentos();
  }

  fetchPositions() {
    this.positionsService.list().subscribe({
      next: data => {
        this.allPosiciones = data;
        this.aplicarFiltro();
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar las posiciones.';
        this.loading = false;
      }
    });
  }

  fetchDepartamentos() {
    this.departmentsService.list().subscribe({
      next: data => this.departamentos = data.filter(d => d.enabled),
      error: () => console.error('Error al cargar departamentos')
    });
  }

  aplicarFiltro() {
    this.posiciones = this.allPosiciones.filter(p =>
      this.mostrarSoloDeshabilitados ? !p.enabled : p.enabled
    );
  }

  toggleFiltro() {
    this.mostrarSoloDeshabilitados = !this.mostrarSoloDeshabilitados;
    this.aplicarFiltro();
  }

  abrirFormulario(modo: 'Agregar' | 'Editar', datos: Position | null = null) {
    this.formMode = modo;
    this.selectedPosition = datos;
    this.showFormModal = true;
  }

  abrirConfirmacion(datos: Position) {
    this.selectedPosition = datos;
    this.showConfirmModal = true;
  }

  abrirDetalles(datos: Position) {
    this.selectedPosition = datos;
    this.showDetailsModal = true;
  }

  cerrarModal() {
    this.showFormModal = false;
    this.showConfirmModal = false;
    this.showDetailsModal = false;
    this.selectedPosition = null;
  }

  handleGuardar(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const position: Partial<Position> = {
      title: formData.get('title') as string,
      baseSalary: Number(formData.get('baseSalary')),
      enabled: true,
      departmentId: Number(formData.get('departmentId'))
    };

    if (this.formMode === 'Agregar') {
      this.positionsService.add(position).subscribe({
        next: () => {
          this.fetchPositions();
          this.cerrarModal();
        },
        error: err => console.error('Error guardando:', err)
      });
    } else if (this.selectedPosition) {
      this.positionsService.edit(this.selectedPosition.id!, position).subscribe({
        next: () => {
          this.fetchPositions();
          this.cerrarModal();
        },
        error: err => console.error('Error actualizando:', err)
      });
    }
  }

  handleEliminar() {
    if (!this.selectedPosition) return;

    this.positionsService.changeStatus(this.selectedPosition.id!, false).subscribe({
      next: () => {
        this.allPosiciones = this.allPosiciones.map(p =>
          p.id === this.selectedPosition?.id ? { ...p, enabled: false } : p
        );
        this.aplicarFiltro();
        this.cerrarModal();
      },
      error: () => alert('Error al deshabilitar la posición.')
    });
  }

  getDepartmentName(departmentId: number | undefined): string {
    const dept = this.departamentos.find(d => d.id === departmentId);
    return dept ? dept.name : 'Desconocido';
  }

  // 📄 Exportar la tabla a PDF
  exportarPDF() {
    const doc = new jsPDF();

    const titulo = this.mostrarSoloDeshabilitados
      ? 'Reporte de Posiciones Deshabilitadas'
      : 'Reporte de Posiciones Habilitadas';

    doc.setFontSize(16);
    doc.text(titulo, 14, 15);

    const fecha = new Date();
    doc.setFontSize(10);
    doc.text(`Generado el: ${fecha.toLocaleString()}`, 14, 22);

    const columns = ['Título', 'Salario Base', 'Departamento', 'Estado'];
    const rows = this.posiciones.map(pos => [
      pos.title,
      pos.baseSalary.toLocaleString('es-ES', { style: 'currency', currency: 'USD' }),
      this.getDepartmentName(pos.departmentId),
      pos.enabled ? 'Habilitada' : 'Deshabilitada'
    ]);

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
    });

    const fileName = this.mostrarSoloDeshabilitados
      ? 'posiciones_deshabilitadas.pdf'
      : 'posiciones_habilitadas.pdf';

    doc.save(fileName);
  }
}
