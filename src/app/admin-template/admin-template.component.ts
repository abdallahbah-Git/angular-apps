import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-admin-template',
  templateUrl: './admin-template.component.html',
  styleUrls: ['./admin-template.component.css'],
})
export class AdminTemplateComponent implements OnInit {
  constructor(
    public authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  handleLogout() {
    this.authService.logout().subscribe({
      next: (data) => {
        this.router.navigateByUrl('/login');
      },
    });
  }
}
