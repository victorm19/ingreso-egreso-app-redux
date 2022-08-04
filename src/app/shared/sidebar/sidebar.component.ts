import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  constructor(private readonly _auth: AuthService,
              private readonly _router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    this._auth.logout()
      .then(resp => {
        this._router.navigate(['/login']);
      });
  }

}
