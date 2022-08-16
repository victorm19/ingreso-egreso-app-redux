import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { IngresoEgreso } from '../modelos/ingreso-egreso.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private readonly _firestore: AngularFirestore,
              private readonly _authService: AuthService) { }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const uid = this._authService.usuario.uid;
    
    delete ingresoEgreso.uid;
    
    return this._firestore
      .doc(`${uid}/ingresos-egresos`)
      .collection('items')
      .add({... ingresoEgreso});
  }

  initIngresoEgresoListener(uid?: string) {
    return this._firestore
        .collection(`${uid}/ingresos-egresos/items`)
        .snapshotChanges()
        .pipe(
          map( snapshot => {
            return snapshot.map(x => ({
                uid: x.payload.doc.id,
                ...x.payload.doc.data() as any
              })
            )
          })
        );
  }

  borrarIngresoEgreso(uid: string){
    const uidUser = this._authService.usuario.uid; 
    return this._firestore.doc(`${uidUser}/ingresos-egresos/items/${uid}`).delete();
  }
}
