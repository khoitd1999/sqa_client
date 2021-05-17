import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserStore } from '../model/user-store';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: UserStore;

  constructor(
    private toaStr: ToastrService,
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit() {
    this.user = new UserStore();

  }

  checkUser() {
    if (this.user.username && this.user.password) {
      this.loginService.checkUser(this.user).subscribe(res => {
        if (res.body) {
          if (res.body.role === 'NV') {
            this.router.navigate(['/hang-hoa']);
          } else {
            this.router.navigate(['/don-hang']);
          }
        } else {
          this.toaStr.error('Tài khoản hoặc mật khẩu nhập sai');
        }
      });
    } else {
      this.toaStr.error('Bạn chưa nhập đủ các trường bắt buộc');
    }
  }
}
