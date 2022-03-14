import { Component, OnInit } from '@angular/core';
import {AuthService} from './auth.service';
import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoading = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;
    console.log('isLoading:' + this.isLoading);

    let autnhentication: Observable<any>;
    autnhentication = this.authService.login(email, password);
    autnhentication.subscribe(
      responseData => {
        this.isLoading = false;
        this.router.navigate(['/tickets']);
      }
    );

    form.reset();
  }

}
