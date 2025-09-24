import { DOCUMENT } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, HostListener, Inject, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CoreModule } from '@core/core.module';
import { AuthService } from '@features/auth/services/auth.service';
import { User } from '@features/user/interfaces/user';
import { faClock, faTimes } from '@fortawesome/free-solid-svg-icons';
import { SharedModule } from './shared/shared.module';
import { PrimeNG } from 'primeng/config';
import { environment } from '@env';

const MIDTRANS_SNAP_URL = environment.midtransSnapApiUrl;
const MIDTRANS_CLIENT_KEY = environment.midtransClientKey;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SharedModule, HttpClientModule, CoreModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'promansys-web';
  dirtyState: boolean = false;
  faClock = faClock;
  user: User | null = null;
  faTimes = faTimes;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authService: AuthService,
    private primeng: PrimeNG,
    private renderer: Renderer2
    // private fcDirtyStateService: FcDirtyStateService,
    // private dialogService: DialogService,
  ) {
    // this.fcDirtyStateService.getCurrentState.subscribe(
    //   (state) => (this.dirtyState = state)
    // );
  }

  ngOnInit() {
    this.primeng.ripple.set(true);
    this.authService.currentUserDataSubject.subscribe((user: any) => {
      if (user.id) {
        this.user = user;
      } else {
        this.user = null;
      }
    });
    this.loadMidtransSnap();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    if (this.dirtyState) {
      event.preventDefault();

      // googlechrome need returnValue
      event.returnValue = true;
    }
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.stopPropagation();
    // Check if Cmd (Mac) or Ctrl (Windows/Linux) is pressed along with K
    if ((event.metaKey || event.ctrlKey) && event.key === 't') {
      event.preventDefault(); // Prevent default action if necessary
    }
  }

  loadMidtransSnap(): void {
    const script = this.renderer.createElement('script');
    script.src = MIDTRANS_SNAP_URL;
    script.type = 'text/javascript';
    script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY);
    this.renderer.appendChild(document.head, script);
  }
}
