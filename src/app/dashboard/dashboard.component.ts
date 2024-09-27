import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { AnalyticsControllerService } from '../core/modules/openapi';
import { Utils } from '../utils/utils';
import { isPlatformBrowser, NgIf } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartModule, CardModule, PanelModule, NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  platformId = inject(PLATFORM_ID);
  analyticsControllerService = inject(AnalyticsControllerService);
  data: any;
  options: any;

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');

      this.options = {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
              color: textColor,
            },
          },
        },
      };
    }

    this.analyticsControllerService.getCountByStatus().subscribe({
      next: (statusCountes) => {
        const statuses = statusCountes.map((item) =>
          Utils.getOcrStatusText(item.status)
        );
        const counts = statusCountes.map((item) => item.count);
        this.data = {
          labels: statuses,
          datasets: [
            {
              data: counts,
            },
          ],
        };
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {},
    });
  }
}
