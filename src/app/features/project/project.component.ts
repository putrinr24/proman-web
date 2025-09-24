import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
  imports: [RouterOutlet, RouterModule],
})
export class ProjectsComponent {}
