import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ToastService } from '../services/toast.service';
import { environment } from '../../../environment/environment';

/**
 * Servicio para descargar reportes Excel generados por el backend (P4).
 *
 * El backend expone:
 *   GET /api/reports/leave-requests/export?from=YYYY-MM-DD&to=YYYY-MM-DD
 *   GET /api/reports/employees/export
 *
 * Angular descarga el blob binario y lo convierte en descarga de navegador.
 */
@Injectable({ providedIn: 'root' })
export class ReportDownloadService {
  private http  = inject(HttpClient);
  private toast = inject(ToastService);

  private readonly BASE = `${environment.apiBaseUrl}/api/reports`;

  downloadLeaveRequestsExcel(from: string, to: string): void {
    if (!from || !to) {
      this.toast.warning('Selecciona un rango de fechas para exportar.');
      return;
    }

    this.toast.info('Generando reporte Excel, espera un momento...');

    const params = new HttpParams().set('from', from).set('to', to);

    this.http
      .get(`${this.BASE}/leave-requests/export`, {
        params,
        responseType: 'blob'
      })
      .subscribe({
        next: (blob) => {
          this.triggerDownload(
            blob,
            `permisos_${from}_${to}.xlsx`,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
          this.toast.success('Reporte descargado correctamente.');
        },
        error: () => {
          this.toast.error('Error al generar el reporte. Intenta de nuevo.');
        }
      });
  }

  downloadEmployeesExcel(): void {
    this.toast.info('Generando reporte de empleados...');

    this.http
      .get(`${this.BASE}/employees/export`, { responseType: 'blob' })
      .subscribe({
        next: (blob) => {
          const today = new Date().toISOString().split('T')[0];
          this.triggerDownload(
            blob,
            `empleados_${today}.xlsx`,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
          this.toast.success('Reporte de empleados descargado.');
        },
        error: () => {
          this.toast.error('Error al generar el reporte de empleados.');
        }
      });
  }

  private triggerDownload(blob: Blob, filename: string, mimeType: string): void {
    const url  = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
    const link = document.createElement('a');
    link.href  = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}