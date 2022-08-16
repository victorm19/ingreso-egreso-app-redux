import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {

  form: FormGroup;
  cargando: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(private _fb: FormBuilder,
              private readonly _authService: AuthService,
              private readonly _router: Router,
              private readonly _store: Store<AppState>) {
    this.form = new FormGroup({});
   }

  ngOnInit(): void {
    this.form = this._fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    const uiSubscription = this._store.select('ui').subscribe(ui => this.cargando = ui.isLoading);
    
    this.subscriptions.push(uiSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe())
  }

  crear() {
    if(this.form.invalid) return;

    this._store.dispatch(ui.isLoading())
    
    const { nombre, correo, password } = this.form.value;
    this._authService.crearUsuario(nombre, correo, password)
      .then( () => {
        this._store.dispatch(ui.stopLoading())
        this._router.navigate(['/']);
      })
      .catch( err => {
        this._store.dispatch(ui.stopLoading())
        Swal.fire({
          icon: 'error',
          title: 'Opps...',
          text: err.message,
        });
      });
  }
}
