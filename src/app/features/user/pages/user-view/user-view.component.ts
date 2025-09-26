import { CommonModule, Location } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { User } from '@features/user/interfaces/user';
import { UserService } from '@features/user/services/user.service';
import {
  faChevronDown,
  faPencil,
  faPlus,
  faTimes,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FcToastService } from '@shared/components/fc-toast/fc-toast.service';
import { SharedModule } from '@shared/shared.module';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-view',
  imports: [SharedModule, ReactiveFormsModule, CommonModule, TooltipModule],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css',
})
export class UserViewComponent {
  private readonly destroy$ = new Subject<void>();

  faPlus = faPlus;
  faPencil = faPencil;
  faTrash = faTrash;
  faTimes = faTimes;
  faChevronDown = faChevronDown;

  actionButtons: any[] = [
    {
      id: 1,
      label: 'Refresh',
      icon: '/assets/images/icons/refresh.svg',
      action: () => {
        this.refresh();
      },
    },
  ];

  userForm: FormGroup;
  userId!: string;
  users: any[] = [];
  userRoles: any[] = [];

  loading = false;

  @Input() user: User = {} as User;
  @Output() onDeleted = new EventEmitter();
  @Output() onUpdated = new EventEmitter();

  constructor(
    private userService: UserService,
    private fcToastService: FcToastService,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.user.id = String(this.route.snapshot.paramMap.get('id'));
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      role: new FormControl(null, Validators.required),
      email: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.email,
      ]),
      phone_no: new FormControl('', Validators.required),
      username: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
      password: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      is_verified: new FormControl(true),
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.loadData();
  }

  ngOnChanges(): void {
    this.refresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    this.loading = true;
    this.destroy$.next();
    this.userService
      .getUser(this.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        ((this.user = {
          ...res.data,
        }),
          this.userForm.patchValue({
            name: this.user.name,
            role: this.user.role,
            email: this.user.email,
            phone_no: this.user.phone_no,
            username: this.user.username,
            password: this.user.password,
            address: this.user.address,
            is_verified: this.user.is_verified,
          }));
        this.loading = false;
      });
    this.userService.getUserRoles().subscribe({
      next: (res: any) => {
        this.userRoles = res.data;
      },
    });
  }

  submit() {
    let bodyReq = {
      name: this.userForm.value.name,
      phone_no: this.userForm.value.phone_no,
      role: this.userForm.value.role,
      address: this.userForm.value.address,
    };

    this.loading = true;

    this.userService.updateUser(this.user.id, bodyReq).subscribe({
      next: (res: any) => {
        this.fcToastService.clear();
        this.fcToastService.add({
          severity: 'success',
          header: 'Success',
          message: res.message,
        });
        this.onUpdated.emit(res.data);
      },
      error: (err: any) => {
        console.error('Update failed:', err);
      },
    });
  }

  refresh() {
    this.userForm.reset();
    this.loadData();
  }

  back() {
    this.location.back();
  }
}
