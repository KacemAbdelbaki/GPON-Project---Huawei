import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { SignInRequest } from '../../Core/Models/User/SigninRequest';
import { environment } from '../../environment/environment';
import { SigninResponse } from '../../Core/Models/User/SigninResponse';
import { User } from '../../Core/Models/User/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseurl: string = `${environment.BASE_URL}/user/api/auth`;
  private readonly USER_DATA = 'user_data';

  // Define a proper auth state with loading status
  private readonly authStateSubject = new BehaviorSubject<{isLoggedIn: boolean, isLoading: boolean}>({
    isLoggedIn: false,
    isLoading: true
  });
  
  // Expose the full auth state
  public authState$ = this.authStateSubject.asObservable();
  
  // For backward compatibility, still provide isLoggedIn$
  public isLoggedIn$ = this.authStateSubject.pipe(
    tap(state => console.log('Auth state updated:', state)),
    map(state => state.isLoggedIn)
  );

  constructor(private readonly http: HttpClient, private readonly router: Router) {
    this.checkAuthState();
  }

  checkAuthState(): void {
    this.http.get(this.baseurl + "/check-auth", { withCredentials: true }).subscribe({
      next: () => {
        this.authStateSubject.next({isLoggedIn: true, isLoading: false});
      },
      error: (error) => {
        console.error("Authentication check failed:", error);
        this.authStateSubject.next({isLoggedIn: false, isLoading: false});
        this.clearUser();
      }
    });
  }

  signin(signInRequest: SignInRequest): Observable<SigninResponse> {
    return this.http.post<SigninResponse>(this.baseurl + "/signin", signInRequest, { withCredentials: true }).pipe(
      tap((signinResponse) => {
        this.authStateSubject.next({isLoggedIn: true, isLoading: false});
        this.saveUser(signinResponse);
      })
    );
  }

  signinClient(signInRequest: SignInRequest): Observable<SigninResponse> {
    return this.http.post<SigninResponse>(this.baseurl + "/signin-client", signInRequest, { withCredentials: true }).pipe(
      tap((signinResponse) => {
        this.authStateSubject.next({isLoggedIn: true, isLoading: false});
        this.saveUser(signinResponse);
      })
    );
  }

  signup(signUpRequest: SignInRequest): Observable<SigninResponse> {
    return this.http.post<SigninResponse>(this.baseurl + "/signup", signUpRequest)
  }

  logout(): void {
    this.http.post(this.baseurl + "/logout", {}).subscribe(() => {
      this.clearUser();
      this.authStateSubject.next({isLoggedIn: false, isLoading: false});
      this.router.navigate(['/signup']);
    });
  }

  getUser(): any {
    const userStr = localStorage.getItem(this.USER_DATA);
    if (!userStr || userStr === "undefined")
      return null;

    const userData = JSON.parse(userStr);
    if (userData && typeof userData === 'object')
      return userData;

    return null;
  }

  saveUser(signinResponse: SigninResponse): void {
    localStorage.removeItem(this.USER_DATA);

    const userData = {
      id: signinResponse.id,
      username: signinResponse.username,
      roles: signinResponse.roles,
    };

    console.log("Saving user data:", userData);
    localStorage.setItem(this.USER_DATA, JSON.stringify(userData));
  }

  clearUser(): void {
    localStorage.removeItem(this.USER_DATA);
  }

  // non auth related methods
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseurl}/${id}`, { withCredentials: true });
  }

  save(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseurl}/save`, user, { withCredentials: true });
  }

  countByCreatedAtAfter(date: Date): Observable<number> {
    return this.http.post<number>(`${this.baseurl}/count-by-createdAt-after`, { date: date.toISOString() }, { withCredentials: true });
  }
}
