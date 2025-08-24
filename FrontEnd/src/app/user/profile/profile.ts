import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Sidebar } from "../../shared/sidebar/sidebar";
import { Navbar } from "../../shared/navbar/navbar";
import { CommonModule } from '@angular/common';
import { UserService } from '../../../Services/User/user-service';
import { User } from '../../../Core/Models/User/User';
import { RouterModule } from '@angular/router';
import { Navbar2 } from '../../shared/navbar2/navbar2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [Sidebar, CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  client?: User;
  isLoading: boolean = true;
  private subscription?: Subscription;

  constructor(
    public readonly userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.subscription = this.userService.authState$.subscribe(authState => {
      console.log('Auth state:', authState);
      this.isLoading = authState.isLoading;
      
      // Trigger change detection when loading state changes
      this.cdr.detectChanges();
      
      if (!authState.isLoading) {
        this.isLoggedIn = authState.isLoggedIn;
        
        if (authState.isLoggedIn) {
          // Get user data from localStorage
          const localUser = this.userService.getUser();
          console.log('User from localStorage:', localUser);
          
          if (localUser) {
            // Always use localStorage data immediately
            this.client = localUser;
            console.log('Setting client data:', this.client);
            
            // Force change detection after setting client data
            this.cdr.detectChanges();
            
            // Try to fetch fresh data from API if we have an ID
            if (localUser.id) {
              console.log('Fetching fresh user data for ID:', localUser.id);
              this.userService.getUserById(localUser.id).subscribe({
                next: (freshUser) => {
                  console.log("Fresh user data received from API:", freshUser);
                  this.client = freshUser;
                  
                  // Force change detection after API data is received
                  this.cdr.detectChanges();
                  console.log("Client data updated and change detection triggered");
                },
                error: (error) => {
                  console.error("Error fetching fresh user data:", error);
                  console.log("Keeping localStorage data:", this.client);
                  
                  // Ensure change detection even on error
                  this.cdr.detectChanges();
                }
              });
            }
          } else {
            console.log('No user data in localStorage');
            this.client = undefined;
            this.cdr.detectChanges();
          }
        } else {
          this.client = undefined;
          console.log('User not logged in');
          this.cdr.detectChanges();
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
