import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MaterialGood } from '../model/material-good';
import { MaterialgoodService } from './materialgood.service';

@Component({
  selector: 'app-materialgood-update',
  templateUrl: './materialgood-update.component.html',
  styleUrls: ['./materialgood-update.component.css']
})
export class MaterialgoodUpdateComponent implements OnInit {
  materialGood: MaterialGood;

  constructor(
    private router: Router,
    private materialGoodService: MaterialgoodService,
    private toaStr: ToastrService,
    private route: ActivatedRoute
  ) {
    const id1 = this.route.snapshot.params['id'] ? this.route.snapshot.params['id'] : null;
    if (id1) {
      this.materialGoodService.find({
        id: id1
      }).subscribe(res => {
        this.materialGood = res.body;
      });
    }
  }

  ngOnInit() {
    if (!this.materialGood) {
      this.materialGood = new MaterialGood();
    }
  }

  logout() {
    this.router.navigate(['']);
  }

  back() {
    this.router.navigate(['/hang-hoa']);
  }

  checkError() {
    if (!this.materialGood.materialGoodCode || (this.materialGood.materialGoodCode && this.materialGood.materialGoodCode.length === 0)) {
      this.toaStr.error('Bạn chưa nhập mã hàng');
      return true;
    } else if (!this.materialGood.materialGoodName || (this.materialGood.materialGoodName && this.materialGood.materialGoodName.length === 0)) {
      this.toaStr.error('Bạn chưa nhập tên hàng');
      return true;
    } else if (!this.materialGood.unitPrice || this.materialGood.unitPrice === 0) {
      this.toaStr.error('Bạn chưa nhập đơn giá');
      return true;
    } else if (!this.materialGood.quantity || this.materialGood.quantity === 0) {
      this.toaStr.error('Bạn chưa nhập số lượng');
      return true;
    } else if (this.materialGood.unitPrice <= 0) {
      this.toaStr.error('Đơn giá phải lớn hơn 0');
      return true;
    } else if (this.materialGood.quantity <= 0) {
      this.toaStr.error('Số lượng phải lớn hơn 0');
      return true;
    }
    return false;
  }

  save() {
    if (this.checkError()) {
      return;
    }
    this.materialGoodService.save(this.materialGood).subscribe(res => {
      if (res.body === 0) {
        this.toaStr.success('Lưu mặt hàng thành công');
        this.back();
      } else if (res.body === 1) {
        this.toaStr.error('Lưu mã hàng đã tồn tại trong phần mềm');
      }
    }
    // ,
    // () => {
    //   this.toaStr.error('Lưu mặt hàng thất bại');
    // }
    );
  }
}
