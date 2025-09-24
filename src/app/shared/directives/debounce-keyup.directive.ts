import { Directive, HostListener } from '@angular/core';
import { AbstractDebounceDirective } from './abstract-debounce.directive';

@Directive({
  selector: 'input[fcDebounceKeyup]',
  standalone: true,
})
export class DebounceKeyupDirective extends AbstractDebounceDirective {
  constructor() {
    super();
  }

  @HostListener('keyup', ['$event'])
  public onKeyUp(event: KeyboardEvent): void {
    if (
      event.key !== 'ArrowUp' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight' &&
      event.key !== 'Escape' &&
      event.key !== 'Tab'
    ) {
      event.preventDefault();
      this.emitEvent$.next(event);
    }
  }
}
