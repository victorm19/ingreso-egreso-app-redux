import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../modelos/ingreso-egreso.model';

export const setItems = createAction(
    '[IngresoEgreso] setItems',
    props<{items: IngresoEgreso []}>()
);

export const unSetItems = createAction('[IngresoEgreso] unSetItems');