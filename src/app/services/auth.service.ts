import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { Usuario } from '../modelos/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public readonly _auth: AngularFireAuth,
              public readonly _firestore: AngularFirestore) { }

  initAuthListener() {
    this._auth.authState.subscribe(resp => {
      console.log(resp)
    })
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this._auth.createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        const newUser = new Usuario(user?.uid, nombre, email);

        return this._firestore.doc(`${user?.uid}/usuario`)
          .set({...newUser});
      })
  }

  login(email: string, password: string) {
    return this._auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this._auth.signOut();
  }

  isAuth() {
    return this._auth.authState.pipe(
      map(resp => resp != null)
    );
  }
}
