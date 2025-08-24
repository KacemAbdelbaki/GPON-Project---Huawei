import { Routes } from '@angular/router';
import { Signin } from './user/signin/signin';
import { Dashboard } from './dashboard/dashboard';
import { MapComponent } from './shared/map-component/map-component';
import { Signup } from './user/signup/signup';
import { Profile } from './user/profile/profile';
import { CompleteSignup } from './user/complete-signup/complete-signup';
import { CreateBoard } from './equipment/board/create-board/create-board';
import { CreateOLT } from './equipment/OLT/create-olt/create-olt';
import { CreateBox } from './equipment/Box/create-box/create-box';
import { CreateONT } from './equipment/ONT/create-ont/create-ont';

export const routes: Routes = [
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "home", component: Dashboard },
    { path: "signin", component: Signin },
    { path: "signup", component: Signup },
    { path: "complete-signup", component: CompleteSignup },
    { path: "profile", component: Profile },
    { path: "map", component: MapComponent },
    { path: "create-board", component: CreateBoard },
    { path: "create-olt", component: CreateOLT },
    { path: "create-box", component: CreateBox },
    { path: "create-ont", component: CreateONT },
    { path: "**", redirectTo: "home" }
];
