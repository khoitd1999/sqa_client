import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../login/login.service';
import { MaterialgoodService } from '../materialgood/materialgood.service';
import { MaterialGood } from '../model/material-good';
import { PPOrder } from '../model/pporder';
import { PPOrderDetail } from '../model/pporder-detail';
import { Supplier } from '../model/supplier';
import { UserStore } from '../model/user-store';
import { PporderService } from './pporder.service';

@Component({
  selector: 'app-pporder-update',
  templateUrl: './pporder-update.component.html',
  styleUrls: ['./pporder-update.component.css']
})
export class PporderUpdateComponent implements OnInit {
  ppOrder: PPOrder;
  suppliers: Supplier[];
  ppOrderDetails: PPOrderDetail[];
  selectRow: PPOrderDetail;
  materialGoods: MaterialGood[];
  users: UserStore[];
  vatRates: any;
  supplier: Supplier;
  date: any;

  constructor(
    private router: Router,
    private toaStr: ToastrService,
    private modalService: NgbModal,
    private ppOrderService: PporderService,
    private materialGoodService: MaterialgoodService,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) {
    const id1 = this.route.snapshot.params['id'] ? this.route.snapshot.params['id'] : null;
    if (id1) {
      this.ppOrderService.find({
        id: id1
      }).subscribe(res => {
        this.ppOrder = res.body;
        this.ppOrderDetails = this.ppOrder.ppOrderDetails;
        this.formatDateFromServer();
      });
    }
  }

  ngOnInit() {
    this.supplier = new Supplier();
    this.selectRow = new PPOrderDetail();
    this.vatRates = [
      { code: '0%', value: 0 },
      { code: '5%', value: 0.05 },
      { code: '10%', value: 0.1 },
    ]
    if (!this.ppOrder) {
      this.ppOrder = new PPOrder();
      this.ppOrderDetails = [];
    }
    this.ppOrderService.loadAllSupplier().subscribe(res => {
      if (res.body) {
        this.suppliers = res.body;
        if (this.ppOrder.supplierID) {
          this.changeSupplier();
        }
      }
    });
    this.materialGoodService.findAll().subscribe(res => {
      this.materialGoods = res.body;
    });
    this.loginService.findAll().subscribe(res => {
      this.users = res.body;
    });
  }

  logout() {
    this.router.navigate(['']);
  }

  back() {
    this.router.navigate(['/don-hang']);
  }

  checkError() {
    if (!this.ppOrder.no || (this.ppOrder.no && this.ppOrder.no.trim().length === 0)) {
      this.toaStr.error('B???n ch??a nh???p s??? ????n h??ng');
      return false;
    }
    if (!this.date) {
      this.toaStr.error('B???n ch??a nh???p ng??y nh???n h??ng');
      return false;
    }
    if (this.date && !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(this.date)) {
      this.toaStr.error('B???n ch??a nh???p ????ng ?????nh d???ng ng??y');
      return false;
    }
    if (this.ppOrderDetails.length === 0) {
      this.toaStr.error('????n h??ng ??ang kh??ng c?? h??ng h??a n??o');
      return false;
    }
    for (let i = 0; i < this.ppOrderDetails.length; i++) {
      if (!this.ppOrderDetails[i].materialGoodID) {
        const j = i + 1;
        this.toaStr.error('H??ng ' + j + ' ch??a nh???p m?? h??ng h??a');
        return false;
      }
    }
    for (let i = 0; i < this.ppOrderDetails.length; i++) {
      if (!this.ppOrderDetails[i].quantity ||
          (this.ppOrderDetails[i].quantity && this.ppOrderDetails[i].quantity <= 0)
         ) {
        const j = i + 1;
        this.toaStr.error('H??ng ' + j + ' c?? s??? l?????ng nh??? h??n ho???c b???ng 0');
        return false;
      }
      if (!this.ppOrderDetails[i].unitPrice ||
        (this.ppOrderDetails[i].unitPrice &&this.ppOrderDetails[i].unitPrice <= 0)) {
        const j = i + 1;
        this.toaStr.error('H??ng ' + j + ' c?? ????n gi?? nh??? h??n ho???c b???ng 0');
        return false;
      }
      if (this.ppOrderDetails[i].discountRate && this.ppOrderDetails[i].discountRate <= 0) {
        const j = i + 1;
        this.toaStr.error('H??ng ' + j + ' c?? t??? l??? chi???t kh???u nh??? h??n 0');
        return false;
      }
      if (this.ppOrderDetails[i].discountRate && this.ppOrderDetails[i].discountRate > 100) {
        const j = i + 1;
        this.toaStr.error('H??ng ' + j + ' c?? t??? l??? chi???t kh???u l???n h??n 100');
        return false;
      }
    }
    return true;
  }

  save() {
    this.ppOrder;
    this.ppOrderDetails;
    if (!this.checkError()) {
      return;
    }
    this.formatDate();
    // this.ppOrder.totalAmount = this.calculateAmount();
    this.ppOrder.ppOrderDetails = this.ppOrderDetails;
    this.ppOrderService.save(this.ppOrder).subscribe(res => {
      if (res.body === 0) {
        this.toaStr.success('L??u ????n h??ng th??nh c??ng');
        this.back();
      } else if (res.body === 1) {
        this.toaStr.error('M?? ????n h??ng ???? t???n t???i trong ph???n m???m');
      }
    });
  }

  changeSupplier() {
    this.supplier = this.suppliers.find(n => n.id === this.ppOrder.supplierID);
  }

  selectElement(item) {
    this.selectRow = item;
  }

  newRow(length: number): any[] {
    if (length > 0) {
      return new Array(length);
    } else {
      return new Array(0);
    }
  }

  addNewRow() {
    this.ppOrderDetails.push(new PPOrderDetail());
    if (this.ppOrderDetails.length === 1) {
      this.selectRow = this.ppOrderDetails[0];
    }
  }

  changeMaterialGood() {
    const tmp = this.materialGoods.find(n => n.id === this.selectRow.materialGoodID);
    this.selectRow.materialGoodName = tmp.materialGoodName;
    this.selectRow.unit = tmp.unit;
  }

  changeQuantity() {
    this.ppOrderDetails;
    if (this.selectRow.quantity <= 0) {
      this.toaStr.warning('Kh??ng nh???p s??? l?????ng nh??? h??n 0');
      return;
    }
    if (this.selectRow.quantity && this.selectRow.unitPrice) {
      this.selectRow.amount = this.selectRow.quantity * this.selectRow.unitPrice;
    }
  }

  changeUnitPrice() {
    this.ppOrderDetails;
    if (this.selectRow.unitPrice <= 0) {
      this.toaStr.warning('Kh??ng nh???p ????n gi?? nh??? h??n 0');
      return;
    }
    if (this.selectRow.quantity > 0 && this.selectRow.unitPrice > 0) {
      this.selectRow.amount = this.selectRow.quantity * this.selectRow.unitPrice;
    }
  }

  changeDiscountRate() {
    if (this.selectRow.discountRate <= 0) {
      this.toaStr.warning('Kh??ng nh???p t??? l??? chi???t kh???u nh??? h??n 0');
      return;
    }
    if (this.selectRow.discountRate > 100) {
      this.toaStr.warning('Kh??ng nh???p t??? l??? chi???t kh???u nh??? h??n 0');
      return;
    }
    if (this.selectRow.amount && this.selectRow.discountRate) {
      this.selectRow.discountAmount = this.selectRow.amount * (this.selectRow.discountRate / 100);
    }
  }

  changeVatRate() {
    if (this.selectRow.amount && this.selectRow.vatRate) {
      this.selectRow.vatAmount = this.selectRow.amount * this.selectRow.vatRate;
    }
  }

  calculateAmount() {
    let totalAmount = 0;
    for(let i = 0; i < this.ppOrderDetails.length; i++) {
      if (this.ppOrderDetails[i].amount) {
        totalAmount += this.ppOrderDetails[i].amount;
      }
      if (this.ppOrderDetails[i].discountAmount) {
        totalAmount -= this.ppOrderDetails[i].discountAmount;
      }
      if (this.ppOrderDetails[i].vatAmount) {
        totalAmount += this.ppOrderDetails[i].vatAmount;
      }
    }
    return totalAmount;
  }

  formatDate() {
    if (this.date) {
      const obj = this.date.split('/');
      this.ppOrder.date = obj[2] + '-' + obj[1] + '-' + obj[0];
    }
  }

  formatDateFromServer() {
    if (this.ppOrder.date) {
      const obj = this.ppOrder.date.split('-');
      this.date = obj[2] + '/' + obj[1] + '/' + obj[0];
    }
  }
}
