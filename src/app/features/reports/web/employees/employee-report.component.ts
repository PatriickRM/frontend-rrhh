import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../../application/reports.service';
import { Employee } from '../../../employees/domain/model/employee';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ Importación correcta

@Component({
  selector: 'app-employee-report',
  templateUrl: './employee-report.component.html',
  styleUrls: ['./employee-report.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ]
})
export class EmployeeReportComponent {
  startDate: string = '';
  endDate: string = '';
  employees: Employee[] = [];

  constructor(private reportsService: ReportsService) {}

  // ================== Generar reporte en pantalla ==================
  generateReport() {
    if (!this.startDate || !this.endDate) {
      Swal.fire('Atención', 'Debe seleccionar ambas fechas', 'warning');
      return;
    }

    this.reportsService.getEmployeesByHireDate(this.startDate, this.endDate)
      .subscribe({
        next: (res) => {
          // Asignar fechas como string, asegurando que no sean undefined
          this.employees = res.map(emp => ({
            ...emp,
            hireDate: emp.hireDate ?? '',
            contractEndDate: emp.contractEndDate ?? ''
          }));

          if (res.length === 0) {
            Swal.fire('Información', 'No se encontraron empleados en ese rango de fechas', 'info');
          }
        },
        error: () => {
          Swal.fire('Error', 'Ocurrió un error al generar el reporte', 'error');
          this.employees = [];
        }
      });
  }

  // ================== Generar PDF ==================
  downloadPDF() {
    if (!this.employees || this.employees.length === 0) {
      Swal.fire('Atención', 'No hay datos para generar el PDF', 'warning');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Reporte de Empleados', 14, 20);
    doc.setFontSize(10);
    doc.text(`Rango: ${this.startDate} - ${this.endDate}`, 14, 28);

    const tableColumn = ["Nombre", "DNI", "Email", "Fecha ingreso", "Puesto", "Departamento", "Estado"];
    const tableRows: any[] = [];

    this.employees.forEach(emp => {
      tableRows.push([
        emp.fullName,
        emp.dni,
        emp.email,
        emp.hireDate || '-',
        emp.positionTitle,
        emp.departmentName,
        emp.status
      ]);
    });

    // ⚡ Función autoTable correctamente usada
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: 'grid',
      headStyles: { fillColor: [25, 118, 210], textColor: 255 }
    });

    doc.save(`Reporte_Empleados_${this.startDate}_a_${this.endDate}.pdf`);
  }
}
