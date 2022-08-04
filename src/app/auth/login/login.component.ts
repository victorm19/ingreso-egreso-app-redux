import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({});

  constructor(private readonly _fb: FormBuilder,
              private readonly _authService: AuthService,
              private readonly _router: Router) { }

  ngOnInit(): void {
    this.form = this._fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if(this.form.invalid) { return }

    Swal.fire({
      title: 'Espere por favor',
      didOpen: () => {
        Swal.showLoading()
      }
    });
    
    const { correo, password } = this.form.value;
    this._authService.login(correo, password)
      .then(resp => {
        Swal.close();
        this._router.navigate(['/']);
      })
      .catch(err => {
        Swal.fire({
          icon: 'error',
          title: 'Opps...',
          text: err.message,
        });
      })
  }

}
