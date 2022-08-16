import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { Observable, take, tap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private readonly _auth: AuthService,
              private readonly _router: Router) {
    
  }
  canLoad(): Observable<boolean> {
    return this._auth.isAuth()
      .pipe(
        tap( estado => {
          if(!estado) this._router.navigate(['/login'])
        }),
        take(1)
      );
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
