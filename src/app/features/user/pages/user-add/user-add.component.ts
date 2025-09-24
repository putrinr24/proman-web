import { Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FcDirtyStateService } from '@core/service/fc-dirty-state.service';
import { UserService } from '@features/user/services/user.service';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { SharedModule } from '@shared/shared.module';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-add',
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './user-add.component.html',
  styleUrl: './user-add.component.css',
})
export class UserAddComponent {
  private readonly destroy$ = new Subject<void>();

  userForm: FormGroup;
  userRoles: any[] = [];

  loading = false;

  constructor(
    private userService: UserService,
    private location: Location,
    private fcToastService: FcToastService,
    private fcDirtyStateService: FcDirtyStateService
  ) {
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      role: new FormControl(null, Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone_no: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      is_verified: new FormControl(true),
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterContentInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.userService.getUserRoles().subscribe({
      next: (res: any) => {
        this.userRoles = res.data;
      },
    });
  }

  submit() {
    let bodyReq = JSON.parse(JSON.stringify(this.userForm.value)); // deep copy

    if (this.userForm.invalid) {
      this.fcDirtyStateService.checkFormValidation(this.userForm);
      return;
    }

    this.loading = true;

    if (this.userForm.valid) {
      this.userService.addUser(bodyReq).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.fcToastService.add({
            severity: 'success',
            header: 'Success',
            message: res.message,
          });
          this.location.back();
        },
        error: (err) => {
          this.loading = false;
          this.fcToastService.clear();
          this.fcToastService.add({
            severity: 'error',
            header: 'Error',
            message: err.message,
          });
        },
      });
    }
  }

  back() {
    this.location.back();
  }
}
