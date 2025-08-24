import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../Services/User/user-service';
import { SignUpRequest } from '../../../Core/Models/User/SignupRequest';
import { SignInRequest } from '../../../Core/Models/User/SigninRequest';
import { Router, RouterModule } from '@angular/router';
import { Role } from '../../../Core/Models/User/Role';
import { Navbar2 } from "../../shared/navbar2/navbar2";

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule, RouterModule, Navbar2],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  isAgent: boolean = true;
  isClient: boolean = false;

  constructor(private readonly userService: UserService, private readonly router: Router) { }

  signupAgentForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  signupClientForm: FormGroup = new FormGroup({
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{8}$')]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  signup() {
    if (this.signupAgentForm.valid) {
      const signupRequest: SignUpRequest = this.signupAgentForm.value as SignUpRequest;
      signupRequest.roles = [Role.AGENT];
      this.userService.signup(signupRequest).subscribe((response) => {
        const signinRequest: SignInRequest = {
          username: signupRequest.username,
          phoneNumber: signupRequest.phoneNumber,
          password: signupRequest.password,
          email: signupRequest.email
        };
        this.userService.signin(signinRequest).subscribe(() => this.router.navigate(['/home']));
      });
    }
    else if (this.signupClientForm.valid) {
      const signupRequest: SignUpRequest = this.signupClientForm.value as SignUpRequest;
      signupRequest.roles = [Role.CLIENT];
      this.userService.signup(signupRequest).subscribe((response) => {
        const signinRequest: SignInRequest = {
          username: signupRequest.username,
          phoneNumber: signupRequest.phoneNumber,
          password: signupRequest.password,
          email: signupRequest.email
        };
        this.userService.signinClient(signinRequest).subscribe((signinResponse) => {

          this.userService.getUserById(signinResponse.id).subscribe((user) => {
            if(!user.firstname || !user.lastname || !user.email) {
              this.router.navigate(['/complete-signup']);
            }
          });
        });
      });
    }
  }
  switch() {
    if (this.isAgent) {
      this.isAgent = false;
      this.isClient = true;
    } else {
      this.isAgent = true;
      this.isClient = false;
    }
  }
}
