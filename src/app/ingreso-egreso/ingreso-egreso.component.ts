import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from '../modelos/ingreso-egreso.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as ui from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [
  ]
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  form: FormGroup = new FormGroup({});
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubscription: Subscription = Subscription.EMPTY;

  constructor(private readonly _fb: FormBuilder,
              private readonly _ingresoEgresoService: IngresoEgresoService,
              private readonly _store: Store<AppState>) { }

  ngOnInit(): void {
    this.loadingSubscription = this._store
      .select('ui')
      .subscribe(({ isLoading }) => this.cargando = isLoading);

    this.form = this._fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
      this.loadingSubscription.unsubscribe();
  }

  guardar() {
    if(this.form.invalid) return;
    
    this._store.dispatch(ui.isLoading());

    const { descripcion, monto } = this.form.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this._ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then( () => {
        this.form.reset();
        Swal.fire('Registro Creado', descripcion, 'success')
      })
      .catch(err => { 
        Swal.fire('Error', err.message, 'error')
        this._store.dispatch(ui.stopLoading())
      })
      .finally(() => this._store.dispatch(ui.stopLoading()))
  }

}
