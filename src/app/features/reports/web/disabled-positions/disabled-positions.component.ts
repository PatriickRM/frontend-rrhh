import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Position } from '../../../positions/domain/model/positions';
import { ReportsService } from '../../application/reports.service';

@Component({
  selector: 'app-disabled-positions',
  templateUrl: './disabled-positions.component.html',
  styleUrls: ['./disabled-positions.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class DisabledPositionsComponent implements OnInit {
  positions: Position[] = [];
  departamentos: { id: number; name: string }[] = [];

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.loadDepartments();
    this.loadDisabledPositions();
  }

  loadDepartments() {
    this.reportsService.getDepartments().subscribe(depts => {
      this.departamentos = depts;
    });
  }

  loadDisabledPositions() {
    this.reportsService.getDisabledPositions().subscribe(data => {
      this.positions = data;
    });
  }

  getDepartmentName(departmentId?: number): string {
    const dep = this.departamentos.find(d => d.id === departmentId);
    return dep ? dep.name : 'Desconocido';
  }

  exportToPDF() {
    const doc = new jsPDF();
    doc.text('Reporte de Posiciones Deshabilitadas', 14, 20);

    const rows = this.positions.map((pos, index) => [
      index + 1,
      pos.title,
      pos.baseSalary,
      this.getDepartmentName(pos.departmentId),
      pos.enabled ? 'Activo' : 'Inactivo'
    ]);

    autoTable(doc, {
      head: [['#', 'Título', 'Salario Base', 'Departamento', 'Estado']],
      body: rows,
      startY: 30,
    });

    doc.save('posiciones-deshabilitadas.pdf');
  }
}
