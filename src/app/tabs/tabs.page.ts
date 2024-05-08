import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { triangle, ellipse, square, trash, add, locate, storefrontOutline, pricetagOutline, mapOutline, addCircleOutline, bagAddOutline, checkmarkCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons({ checkmarkCircleOutline, bagAddOutline, addCircleOutline, mapOutline, pricetagOutline, storefrontOutline, triangle, ellipse, square, trash, add, locate });
  }
}
