import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { filter, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  constructor(private readonly _store: Store<AppState>,
              private readonly _ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    const userSubs = this._store
        .select('auth')
        .pipe(
          filter(auth => auth.user !== null)
        )
        .subscribe(({ user }) => {
            const ingresoEgresoSubs = this._ingresoEgresoService
                .initIngresoEgresoListener(user?.uid)
                .subscribe(items => this._store.dispatch(ingresoEgresoActions.setItems({ items })) )

            this.subscriptions.push(ingresoEgresoSubs);
          }
        );
      
      this.subscriptions.push(userSubs);
  }

  ngOnDestroy(): void {
      this.subscriptions.forEach(x => x.unsubscribe())
  }

}
