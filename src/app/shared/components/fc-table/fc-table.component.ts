import { Component, EventEmitter, Input, Output } from '@angular/core';

interface TableColumn {
  label: string;
  field: string;
  type?: 'text' | 'icon' | 'custom';
  formatter?: (value: any, row?: any) => any;
}

@Component({
  selector: 'fc-table',
  templateUrl: './fc-table.component.html',
  styleUrl: './fc-table.component.css',
  standalone: false,
})
export class FcTableComponent {
  lottieOption = {
    path: `./assets/images/lotties/notFound.json`,
    loop: true,
    autoplay: true,
  };

  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() getPrimaryValue: ((row: any) => string) | null = null;
  // @Input() getSecondaryValue: ((row: any) => string | null) | null = null;
  @Input() getSecondaryValue:
    | ((row: any) => string | { label: string; colorClass: string } | null)
    | null = null;

  @Output() rowClick = new EventEmitter<any>();

  isPrimaryOrSecondary(field: string): boolean {
    const primaryField = this.columns?.[0]?.field;
    const secondaryField = this.columns?.[1]?.field;

    return field === primaryField || field === secondaryField;
  }

  getSecondaryLabel(row: any): string {
    const val = this.getSecondaryValue ? this.getSecondaryValue(row) : null;
    if (!val) return '';
    return typeof val === 'string' ? val : val.label;
  }

  getSecondaryClass(row: any): string {
    const val = this.getSecondaryValue ? this.getSecondaryValue(row) : null;
    if (!val) return 'bg-tertiary-200 text-gray-700';
    return typeof val === 'string'
      ? 'bg-tertiary-200 text-gray-700'
      : val.colorClass;
  }
}
