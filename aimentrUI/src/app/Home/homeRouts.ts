import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { StepperComponent } from './stepper/stepper.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RegisterComponent } from './register/register.component';
import { AboutComponent } from './about/about.component';

import { TranslationComponent } from './translation/translation.component';
import { StudentProfileComponent } from './student-profile/student-profile.component';
import { MentorshipRegistrationComponent } from './mentorship-registration/mentorship-registration.component';
import { OtpVerifycationComponent } from './otp-verifycation/otp-verifycation.component';


export const Routes = [
    {
        path: '', component: HomeComponent,
        children: [            
            {
                path: "",
                component: LandingPageComponent
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: "register",
                component: RegisterComponent
            },
            {
                path: "verifyotp",
                component: OtpVerifycationComponent
            },
            
            // {
            //     path: "profile",
            //     component: StepperComponent
            // },
            {
                path: "studentprofile",
                component: StudentProfileComponent
            },
            {
                path: "mentorshipregistration",
                component: MentorshipRegistrationComponent
            },
            {
                path: "translate",
                component: TranslationComponent
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'about',
                component: AboutComponent
            },
        ]
    },

]