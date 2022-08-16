import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  userName?: string = '';
  userSubs: Subscription = Subscription.EMPTY;

  constructor(private readonly _auth: AuthService,
              private readonly _router: Router,
              private readonly _store: Store<AppState>) { 
  }

  ngOnInit(): void {
    this.userSubs =  this._store.select('auth')
        .subscribe( ( { user }) => this.userName = user?.nombre)
  }

  ngOnDestroy(): void {
      this.userSubs?.unsubscribe();
  }

  logout() {
    this._auth.logout()
      .then(resp => {
        this._router.navigate(['/login']);
      });
  }

}
