import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from 'src/app/modelos/ingreso-egreso.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { AppStateWithIngreso } from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [
  ]
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresoEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription = Subscription.EMPTY;

  constructor(private readonly _store: Store<AppStateWithIngreso>,
              private readonly _ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    this.ingresosSubs = this._store
      .select('ingresoEgreso')
      .subscribe(({ items }) => this.ingresoEgresos = items)
  }

  ngOnDestroy(): void {
      this.ingresosSubs?.unsubscribe();
  }

  borrar(uid?: string) {
    this._ingresoEgresoService
      .borrarIngresoEgreso(`${uid}`)
      .then( () => Swal.fire('Borrado', 'Item borrado', 'success'))
      .catch( ({ message }) => Swal.fire('Error', message, 'error'))
  }
}
