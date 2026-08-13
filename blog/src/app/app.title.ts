import { Service, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

export const SITE_NAME = 'Zona Sul Academy';

/** Prefixes every route title with the site name. */
@Service({ autoProvided: false })
export class AppTitle extends TitleStrategy {
  private readonly title = inject(Title);

  override updateTitle(routerState: RouterStateSnapshot): void {
    const routeTitle = this.buildTitle(routerState);

    this.title.setTitle(routeTitle ? `${SITE_NAME} - ${routeTitle}` : SITE_NAME);
  }
}
