import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@features/auth/services/auth.service';
import { ProjectService } from '@features/project/services/project.service';
import { UserService } from '@features/user/services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, CommonModule, FontAwesomeModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private readonly destroy$ = new Subject<void>();

  // User counts
  pmCount = 0;
  devCount = 0;
  custCount = 0;

  // Project counts
  projectCount = 0;
  projectLastMonth = 0;

  // Feature counts
  totalFeatures = 0;
  draftFeatures = 0;
  progressFeatures = 0;
  completedFeatures = 0;
  cancelledFeatures = 0;

  // Feature status percentages
  draftPercent = 0;
  progressPercent = 0;
  completedPercent = 0;
  cancelledPercent = 0;

  draftFeatureList: { name: string; project: string }[] = [];
  progressFeatureList: { name: string; project: string }[] = [];
  completedFeatureList: { name: string; project: string }[] = [];
  cancelledFeatureList: { name: string; project: string }[] = [];

  authUser: any;

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUserData.subscribe((user) => {
      if (user) {
        this.authUser = user;
      }
    });
    this.loadData();
  }

  // ngOnInit(): void {
  //   this.authService.getCurrentUserData.subscribe((user) => {
  //     if (user && user.id) {
  //       this.authUser = user;
  //       this.loadData();
  //     } else {
  //       this.authUser = null;
  //     }
  //   });
  // }

  ngAfterContentInit(): void {}
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData() {
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(now.getMonth() - 1); // 1 month ago

    // If you want to get 7 days ago
    // const lastWeek = new Date();
    // lastWeek.setDate(now.getMonth() - 1); // 7 days ago

    if (this.authUser.role === 0) {
      this.userService.getUsers().subscribe((res: any) => {
        const users = res.data.users;

        this.pmCount = users.filter((u: any) => u.role === 1).length;
        this.devCount = users.filter((u: any) => u.role === 2).length;
        this.custCount = users.filter((u: any) => u.role === 3).length;
      });
    }

    this.projectService.getProjects().subscribe((res: any) => {
      const projects = res.data.projects.filter((p: any) => !p.is_template);

      this.projectCount = res.data.count;
      this.projectLastMonth = projects.filter(
        (p: any) => new Date(p.created_at) >= lastMonth
      ).length;

      this.totalFeatures = 0;
      this.draftFeatures = 0;
      this.progressFeatures = 0;
      this.completedFeatures = 0;
      this.cancelledFeatures = 0;

      this.draftFeatureList = [];
      this.progressFeatureList = [];
      this.completedFeatureList = [];
      this.cancelledFeatureList = [];

      projects.forEach((project: any) => {
        project.features.forEach((f: any) => {
          if (
            (this.authUser.role === 2 &&
              Number(f.assigned_to) !== Number(this.authUser.id)) ||
            (this.authUser.role === 1 &&
              Number(project.assigned_to) !== Number(this.authUser.id) &&
              Number(f.assigned_to) !== Number(this.authUser.id))
          ) {
            return;
          }

          this.totalFeatures++;

          const featureItem = { name: f.name, project: project.name };

          switch (f.status_name) {
            case 'Draft':
              this.draftFeatures++;
              this.draftFeatureList.push(featureItem);
              break;
            case 'Progress':
              this.progressFeatures++;
              this.progressFeatureList.push(featureItem);
              break;
            case 'Completed':
              this.completedFeatures++;
              this.completedFeatureList.push(featureItem);
              break;
            case 'Cancelled':
              this.cancelledFeatures++;
              this.cancelledFeatureList.push(featureItem);
              break;
          }
        });
      });

      this.draftPercent = this.totalFeatures
        ? Math.round((this.draftFeatures / this.totalFeatures) * 100)
        : 0;
      this.progressPercent = this.totalFeatures
        ? Math.round((this.progressFeatures / this.totalFeatures) * 100)
        : 0;
      this.completedPercent = this.totalFeatures
        ? Math.round((this.completedFeatures / this.totalFeatures) * 100)
        : 0;
      this.cancelledPercent = this.totalFeatures
        ? Math.round((this.cancelledFeatures / this.totalFeatures) * 100)
        : 0;
    });
  }
}
