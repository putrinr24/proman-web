import { Routes } from '@angular/router';
import { FeedbackComponent } from './feedback.component';

export const feedbackRoutes: Routes = [
  {
    path: 'feedback',
    component: FeedbackComponent,
  },
  // {
  //   path: 'feedback/attachment/:attachmentId',
  //   component: FeedbackComponent,
  // },
];
