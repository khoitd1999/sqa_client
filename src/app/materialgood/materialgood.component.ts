import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbPagination, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ToastrService } from 'ngx-toastr';
import { MaterialGood } from '../model/material-good';
import { MaterialgoodService } from './materialgood.service';

@Component({
  selector: 'app-materialgood',
  templateUrl: './materialgood.component.html',
  styleUrls: ['./materialgood.component.css']
})
export class MaterialgoodComponent implements OnInit {
  page: number;
  previousPage: any;
  pageSize: number;
  selectRow: any;
  totalItems: any;
  maxSize: any;
  materialGoods: MaterialGood[];
  ngbModalRef: any;

  constructor(
    private router: Router,
    private materialGoodService: MaterialgoodService,
    private toaStr: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.page = 1;
    this.previousPage = 1;
    this.maxSize = 5;
    this.pageSize = 15;
    this.materialGoods = [];
    this.loadAll();
  }

  loadAll() {
    this.materialGoodService.loadAll({
      page: this.page - 1,
      size: this.pageSize
    }).subscribe(res => {
      this.materialGoods = res.body;
      this.totalItems = this.materialGoods[0].total;
      this.selectRow = this.materialGoods[0];
    });
  }

  addNew() {
    this.router.navigate(['/hang-hoa/new']);
  }

  delete(template) {
    if (this.selectRow) {
      this.ngbModalRef = this.modalService.open(template, { size: 'lg', backdrop: 'static' });
    }
  }

  doDelete() {
    this.materialGoodService.delete(this.selectRow.id).subscribe(n => {
      if (n.body === 1) {
        this.toaStr.error('Mặt hàng này đã phát sinh chứng từ');
        this.ngbModalRef.close();
        return;
      } else {
        this.toaStr.success('Xóa mặt hàng thành công');
        this.ngbModalRef.close();
        this.loadAll();
      }
    });
  }

  selectElement(item) {
    this.selectRow = item;
  }

  doubleClick(item) {
    this.router.navigate(['/hang-hoa', item.id, 'edit']);
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
}
