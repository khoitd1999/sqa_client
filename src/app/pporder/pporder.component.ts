import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PPOrder } from '../model/pporder';
import { PporderService } from './pporder.service';

@Component({
  selector: 'app-pporder',
  templateUrl: './pporder.component.html',
  styleUrls: ['./pporder.component.css']
})
export class PporderComponent implements OnInit {
  page: number;
  previousPage: any;
  pageSize: number;
  selectRow: any;
  totalItems: any;
  maxSize: any;
  ngbModalRef: any;
  ppOrders: PPOrder[];

  constructor(
    private router: Router,
    private toaStr: ToastrService,
    private modalService: NgbModal,
    private ppOrderService: PporderService
  ) { }

  ngOnInit() {
    this.page = 1;
    this.previousPage = 1;
    this.maxSize = 5;
    this.pageSize = 15;
    this.ppOrders = [];
    this.loadAll();
  }

  loadAll() {
    this.ppOrderService.loadAll({
      page: this.page - 1,
      size: this.pageSize
    }).subscribe(res => {
      this.ppOrders = res.body;
      this.totalItems = this.ppOrders[0].total;
      this.selectRow = this.ppOrders[0];
    });
  }

  addNew() {
    this.router.navigate(['/don-hang/new']);
  }

  delete(template) {
    if (this.selectRow) {
      this.ngbModalRef = this.modalService.open(template, { size: 'lg', backdrop: 'static' });
    }
  }

  doDelete() {
    this.ppOrderService.delete(this.selectRow.id).subscribe(n => {
      this.toaStr.success('Xóa mặt hàng thành công');
      this.ngbModalRef.close();
      this.loadAll();
    });
  }

  selectElement(item) {
    this.selectRow = item;
  }

  doubleClick(item) {
    this.router.navigate(['/don-hang', item.id, 'edit']);
  }

  newRow(length: number): any[] {
    if (length > 0) {
      return new Array(length);
    } else {
      return new Array(0);
    }
  }

  selectedItemPerPage() {
    this.loadAll();
  }

  loadPage() {
    if (this.page !== this.previousPage) {
      this.previousPage = this.page;
      this.loadAll();
    }
  }

  logout() {
    this.router.navigate(['']);
  }

  formatDate(date) {
    if (date) {
      var strs = date.split('-');
      return strs[2] + '/' + strs[1] + '/' + strs[0];
    }
  }
}
