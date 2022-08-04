import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(private _fb: FormBuilder,
              private readonly _authService: AuthService,
              private readonly _router: Router) {
    this.form = new FormGroup({});
   }

  ngOnInit(): void {
    this.form = this._fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  crear() {
    if(this.form.invalid) return;

    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    });
    
    const { nombre, correo, password } = this.form.value;
    this._authService.crearUsuario(nombre, correo, password)
      .then( credenciales => {
        Swal.close();
        this._router.navigate(['/']);
      })
      .catch( err => {
        Swal.fire({
          icon: 'error',
          title: 'Opps...',
          text: err.message,
        });
      });
  }
}
