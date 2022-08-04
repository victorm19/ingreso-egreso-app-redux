import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/shared/ui.actions';

import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  form: FormGroup = new FormGroup({});
  cargando: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(private readonly _fb: FormBuilder,
              private readonly _authService: AuthService,
              private readonly _router: Router,
              private readonly _store: Store<AppState>) { }
              
  ngOnInit(): void {
    this.form = this._fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    
    const uiSubscription = this._store
                                  .select('ui')
                                  .subscribe(ui => this.cargando = ui.isLoading);
    
    this.subscriptions.push(uiSubscription);
  }
              
  ngOnDestroy(): void {
    this.subscriptions.forEach(x => x.unsubscribe())
  }

  login() {
    if(this.form.invalid) { return }

    this._store.dispatch(ui.isLoading())

    // Swal.fire({
    //   title: 'Espere por favor',
    //   didOpen: () => {
    //     Swal.showLoading()
    //   }
    // });
    
    const { correo, password } = this.form.value;
    this._authService.login(correo, password)
      .then(resp => {
        // Swal.close();
        this._store.dispatch(ui.stopLoading());

        this._router.navigate(['/']);
      })
      .catch(err => {
        this._store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Opps...',
          text: err.message,
        });
      })
  }

}
