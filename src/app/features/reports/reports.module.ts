import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EmployeeReportComponent } from './web/employees/employee-report.component';
import { DisabledPositionsComponent } from './web/disabled-positions/disabled-positions.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EmployeeReportComponent,     
    DisabledPositionsComponent    
  ],
  exports: [
    EmployeeReportComponent,
    DisabledPositionsComponent
  ]
})
export class ReportsModule { }
