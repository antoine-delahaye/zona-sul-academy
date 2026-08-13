import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';
import { MediaService } from '../data/services/media.service';
import { routes } from './app.routes';

/** Stands in for `MediaService` so the layout renders without hitting Sanity. */
class MediaServiceStub {
  readonly all = { value: () => [] };
}

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes), { provide: MediaService, useClass: MediaServiceStub }],
    }).compileComponents();
  });

  it('creates the app', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('splits the primary navigation across both sides of the header', () => {
    const app = TestBed.createComponent(App).componentInstance;

    expect(app.leadingLinks.length + app.trailingLinks.length).toBe(app.navigationLinks.length);
    expect(app.leadingLinks[0].title).toBe('Le club');
  });

  it('renders every navigation entry in the mobile dock with an icon', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const dockLinks = host.querySelectorAll('nav.dock a');
    const icons = host.querySelectorAll('nav.dock svg path[d]');

    expect(dockLinks.length).toBe(fixture.componentInstance.navigationLinks.length);
    expect(icons.length).toBe(fixture.componentInstance.navigationLinks.length);
  });

  it('keeps the dock visible until the footer comes into view', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const host = fixture.nativeElement as HTMLElement;
    const dock = host.querySelector('nav.dock');

    expect(dock?.classList.contains('dock-hidden')).toBe(false);

    fixture.componentInstance.siteFooterVisible.set(true);
    fixture.detectChanges();

    expect(dock?.classList.contains('dock-hidden')).toBe(true);
  });
});
