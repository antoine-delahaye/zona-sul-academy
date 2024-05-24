import {ActivatedRouteSnapshot, CanActivateFn, Router} from '@angular/router'
import {inject} from '@angular/core'

export const newsGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
): Promise<boolean> | boolean => {
  const router: Router = inject(Router)

  const page: string | undefined = route.queryParams['page']
  if (page && parseInt(page) < 1) {
    return router.navigateByUrl('/actualites').then((): boolean => false)
  }
  return true
}
