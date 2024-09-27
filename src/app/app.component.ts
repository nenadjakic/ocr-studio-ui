import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { SidebarModule } from 'primeng/sidebar';
import { DrawerModule } from 'primeng/drawer';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { Aura } from 'primeng/themes/aura';
import { BaseStyle } from 'primeng/base';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ButtonModule,
    ToolbarModule,
    SidebarModule,
    DrawerModule,
    MenubarModule,
    AvatarModule,
    AvatarGroupModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ocr-studio-ui';
  sidebarVisible: boolean = false;
  items: MenuItem[] | undefined = [
    { label: 'Dashboard', routerLink: 'dashboard' },
    { label: 'Tasks', routerLink: 'tasks' },
    { label: 'OCR' },
  ];

  constructor(private config: PrimeNGConfig) {
    this.config.theme.set({ preset: Aura });
  }
}
