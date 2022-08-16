import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { Usuario } from '../modelos/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription = Subscription.EMPTY;
  private user: Usuario = new Usuario();

  constructor(public readonly _auth: AngularFireAuth,
              public readonly _firestore: AngularFirestore,
              private readonly _store: Store<AppState>) { }

  initAuthListener() {
    this._auth.authState.subscribe(fuser => {
      if(fuser) {
        this.userSubscription = this._firestore
              .doc(`${fuser.uid}/usuario`)
              .valueChanges()
              .subscribe(fireStoreUser => {
    
                const user = Usuario.fromFirebase(fireStoreUser);
                this.user = user;
                this._store.dispatch(authActions.setUser({ user }));
          
              });
      }
      else
      {
        this.userSubscription.unsubscribe();
        this._store.dispatch(authActions.unSetUser());
        this._store.dispatch(ingresoEgresoActions.unSetItems());
      }
      
    });
  }

  async crearUsuario(nombre: string, email: string, password: string) {
    return await this._auth.createUserWithEmailAndPassword(email, password)
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

  get usuario() {
    return this.user;
  }
}
