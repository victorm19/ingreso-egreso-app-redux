import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/modelos/ingreso-egreso.model';

import { ChartData } from 'chart.js';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [
  ]
})
export class EstadisticaComponent implements OnInit {

  ingresos: number = 0;
  egresos: number = 0;

  totalEgresos: number = 0;
  totalIngresos: number = 0;

  public doughnutChartLabels: string[] = [ 'Ingresos', 'Egresos' ];
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [
      { data: [  ] },
    ]
  };

  constructor(private _store: Store<AppState>) { }

  ngOnInit(): void {
    this._store.select('ingresoEgreso')
      .subscribe( ({ items }) => this.generarEstadistica(items) );
  }

  generarEstadistica(items: IngresoEgreso[]) {

    this.totalEgresos = 0;
    this.totalIngresos = 0;
    this.egresos = 0;
    this.ingresos = 0;

    for (const item of items) {
      if( item.tipo === 'ingreso') {
        this.totalIngresos += item.monto;
        this.ingresos ++;
      } else {
        this.totalEgresos += item.monto;
        this.egresos ++;
      }
    }

    this.doughnutChartData.datasets = [
        { data: [  this.totalIngresos, this.totalEgresos ] },
      ];
  }

}
