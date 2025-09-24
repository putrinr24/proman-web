import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'fc-not-found',
  templateUrl: './fc-not-found.component.html',
  styleUrls: ['./fc-not-found.component.css'],
  standalone: false,
})
export class FcNotFoundComponent {
  @Input() text?: string;
  @Input() icon?: IconDefinition;
}
