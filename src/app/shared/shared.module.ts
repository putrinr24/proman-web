import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FcToastComponent } from './components/fc-toast/fc-toast.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastItemComponent } from './components/fc-toast/components/toast-items/toast-item.component';
import { LottieComponent, provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { NgxCurrencyDirective } from 'ngx-currency';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { FcCalculatorComponent } from './components/fc-calculator/fc-calculator.component';
import { FcDialogComponent } from './components/fc-dialog/fc-dialog.component';
import { FcInputNumberComponent } from './components/fc-input-number/fc-input-number.component';
import { FcInputTextComponent } from './components/fc-input-text/fc-input-text.component';
import { FcTextareaComponent } from './components/fc-textarea/fc-textarea.component';
import { FcPaginationComponent } from './components/fc-pagination/fc-pagination.component';
import { FcPaginationDialogComponent } from './components/fc-pagination/components/fc-pagination-dialog/fc-pagination-dialog.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FcFilterDialogComponent } from './components/fc-filter-dialog/fc-filter-dialog.component';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { FcLoadingComponent } from './components/fc-loading/fc-loading.component';
import { FcSelectOptionComponent } from './components/fc-select-option/fc-select-option.component';
import { AbstractDebounceDirective } from './directives/abstract-debounce.directive';
import { DebounceKeyupDirective } from './directives/debounce-keyup.directive';
import { FcDrawerComponent } from './components/fc-drawer/fc-drawer.component';
import { FcImagePreviewComponent } from './components/fc-image-preview/fc-image-preview.component';
import { FcSvgLoaderComponent } from './components/fc-svg-loader/fc-svg-loader.component';
import { FcTableComponent } from './components/fc-table/fc-table.component';
import { FcConfirmComponent } from './components/fc-confirm/fc-confirm.component';
import { FcCurrencyPipe } from './pipes/fc-currency.pipe';
import { FcDatepickerComponent } from './components/fc-datepicker/fc-datepicker.component';
import { FcFilterDateComponent } from './components/fc-filter-date/fc-filter-date.component';
import { FcInputTelComponent } from './components/fc-input-tel/fc-input-tel.component';
import { DatePickerModule } from 'primeng/datepicker';
import { FcNotFoundComponent } from './components/fc-not-found/fc-not-found.component';

@NgModule({
  declarations: [
    FcInputTextComponent,
    FcToastComponent,
    ToastItemComponent,
    FcTextareaComponent,
    FcInputNumberComponent,
    FcCalculatorComponent,
    FcDialogComponent,
    FcPaginationComponent,
    FcPaginationDialogComponent,
    FcFilterDialogComponent,
    FcLoadingComponent,
    FcSelectOptionComponent,
    AbstractDebounceDirective,
    FcToastComponent,
    FcDrawerComponent,
    FcImagePreviewComponent,
    FcSvgLoaderComponent,
    FcTableComponent,
    FcConfirmComponent,
    FcCurrencyPipe,
    FcDatepickerComponent,
    FcFilterDateComponent,
    FcInputTelComponent,
    FcNotFoundComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    LottieComponent,
    NgxCurrencyDirective,
    OverlayPanelModule,
    DialogModule,
    InputNumberModule,
    CalendarModule,
    ReactiveFormsModule,
    InputTextModule,
    FormsModule,
    FontAwesomeModule,
    DebounceKeyupDirective,
    DatePickerModule,
  ],
  exports: [
    FcPaginationComponent,
    FcLoadingComponent,
    FcSelectOptionComponent,
    DebounceKeyupDirective,
    FcToastComponent,
    FcDrawerComponent,
    FcImagePreviewComponent,
    FcSvgLoaderComponent,
    FcTableComponent,
    FcInputTextComponent,
    FcTextareaComponent,
    FcConfirmComponent,
    FcInputNumberComponent,
    FcCurrencyPipe,
    FcDatepickerComponent,
    FcFilterDateComponent,
    FcInputTelComponent,
    FcNotFoundComponent,
  ],
  providers: [
    provideLottieOptions({
      player: () => player,
    }),
  ],
})
export class SharedModule {}
