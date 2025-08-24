import { Component } from '@angular/core';
import { UserService } from '../../../Services/User/user-service';
import { Router, RouterModule } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SignInRequest } from '../../../Core/Models/User/SigninRequest';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css'
})
export class Signin {

  isAgent: boolean = true;
  isClient: boolean = false;
  agentSigninForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  clientSigninForm: FormGroup = new FormGroup({
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{8}$')]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private readonly userService: UserService, private readonly router: Router) { }


  SigninAgent() {
    if (this.agentSigninForm.valid) {
      const signinRequest: SignInRequest = this.agentSigninForm.value as SignInRequest;
      this.userService.signin(signinRequest).subscribe((SigninResponse) => {
        this.userService.getUserById(SigninResponse.id).subscribe((user) => {
          if (!user.firstname || !user.lastname || !user.email) {
            this.router.navigate(['/complete-signup']);
          } else {
            this.router.navigate(['/home']);
          }
        });
      });
    }
  }
  SigninClient() {
    if (this.clientSigninForm.valid) {
      const signinRequest: SignInRequest = this.clientSigninForm.value as SignInRequest;
      this.userService.signinClient(signinRequest).subscribe((SigninResponse) => {
        this.userService.getUserById(SigninResponse.id).subscribe((user) => {
          console.log("User data fetched:", user);
          // this.router.navigate(['/complete-signup']);
          if (user.firstname === null || user.lastname === null || user.email === null) {
            this.router.navigate(['/complete-signup']);
          } else {
            this.router.navigate(['/profile']);
          }
        });
      });
    }
  }

  Switch() {
    if (this.isAgent) {
      this.isAgent = false;
      this.isClient = true;
    } else {
      this.isAgent = true;
      this.isClient = false;
    }
  }
}
