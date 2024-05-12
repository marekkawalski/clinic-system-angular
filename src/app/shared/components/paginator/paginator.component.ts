import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { NgIf } from '@angular/common';
import { PageRequestParams } from '../../models/PageRequestParams';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [MatPaginator, NgIf],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss',
})
export class PaginatorComponent {
  @Input() data?: any;
  @Input() requestParams?: PageRequestParams;
  @Output() load: EventEmitter<PageRequestParams> =
    new EventEmitter<PageRequestParams>();
  pageSizeOptions: number[] = [1, 5, 10, 15, 50, 100, 1000];

  onPageChange(event: PageEvent): void {
    if (!this.requestParams) return;
    this.requestParams['page-num'] = event.pageIndex;
    this.requestParams['page-size'] = event.pageSize;
    this.load.emit(this.requestParams);
  }
}
