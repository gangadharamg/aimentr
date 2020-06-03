import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardCoursesComponent } from './dashboard-courses/dashboard-courses.component';
import { DetailCourseComponent } from './detail-course/detail-course.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { VideoComponent } from './video/video.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { StudentComponent } from './student/student.component';
import { RequestComponent } from './request/request.component';
import { PaymentComponent } from './Payments/payment/payment.component';
import { StudentviewMentordashboardComponent } from './studentview-mentordashboard/studentview-mentordashboard.component'
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component'
import { OfflineCourseOverviewComponent } from './offline-course-overview/offline-course-overview.component';
import { OnlineCourseOverviewComponent } from './online-course-overview/online-course-overview.component';
import { MentorFollowersComponent } from './mentor-followers/mentor-followers.component';


import { LiveVideoComponent } from './onlineSession/video/video.component';
import { TranslationComponent } from './onlineSession/translation/translation.component';
import { ChatComponent } from './onlineSession/chat/chat.component';
import { CodeTerminalLayoutComponent } from './onlineSession/code-terminal-layout/code-terminal-layout.component';


import { PeerToPeerComponent } from './onlineSession/peer-to-peer/peer-to-peer.component';
import { TwiloVideoComponent } from './onlineSession/twilo-video/twilo-video.component';

export const Routes = [

    {
        path: 'home', component: DashboardComponent,
        children: [
            {
                path: "",
                component: DetailCourseComponent
            },
            {
                path: "offlinecourse/overview",
                component: OfflineCourseOverviewComponent
            },
            {
                path: "onlinecourse/overview",
                component: OnlineCourseOverviewComponent
            },
            {
                path: "mentor/dashboard",
                component: DashboardCoursesComponent
            },
            {
                path: "mentor/dashboard/followers",
                component: MentorFollowersComponent
            },
            {
                path: 'student/video', component: VideoComponent
            },
            {
                path: "courseupload",
                component: CreateCourseComponent
            },
            {
                path: "profile",
                component: ViewProfileComponent
            },
            {
                path: "student",
                component: StudentComponent
            },
            {
                path: "student/dashboard",
                component: StudentDashboardComponent
            },
            {
                path: "payment",
                component: PaymentComponent
            },
            {
                path: "student/mentordashboard",
                component: StudentviewMentordashboardComponent
            },
            {
                path: "mentor/requests",
                component: RequestComponent
            },
           
            {
                path: "livesession/:id",
                component: CodeTerminalLayoutComponent
            },


             
            {
                path: "peer",
                component: PeerToPeerComponent
            },
            {
                path: "twilio",
                component: TwiloVideoComponent
            },
            


        ]
    },



]