import {Injectable} from '@angular/core'
import {RouterStateSnapshot, TitleStrategy} from '@angular/router'
import {Title} from '@angular/platform-browser'

export const siteName: string = 'Zona Sul Academy'

@Injectable()
export class TitleProvider extends TitleStrategy {
  constructor(private readonly title: Title) {
    super()
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title: string | undefined = this.buildTitle(routerState)
    if (title !== undefined) {
      this.title.setTitle(`${siteName} - ${title}`)
    } else {
      this.title.setTitle(siteName)
    }
  }
}
