import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private readonly _auth: AuthService,
              private readonly _router: Router) {
    
  }

  canActivate(): Observable<boolean> {
    return this._auth.isAuth()
      .pipe(
        tap( estado => {
          if(!estado) this._router.navigate(['/login'])
        })
      );
  }
  
}
