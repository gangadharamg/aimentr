import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import {
    MDBBootstrapModule,
    ButtonsModule,
    BadgeModule,
    BreadcrumbModule,
    //  CardsFreeModule,
    CarouselModule,
    ChartsModule,
    CheckboxModule,
    CollapseModule,
    DropdownModule,
    IconsModule,
    InputsModule,
    InputUtilitiesModule,
    ModalModule,
    NavbarModule,
    PopoverModule,
    TableModule,
    TooltipModule,
    WavesModule

} from 'angular-bootstrap-md';

// Start material
import { A11yModule } from '@angular/cdk/a11y';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
//end material



// import { PipesModule } from '../Pipes/pipes.module';
// import { DirectivesModule } from '../Directives/directives.module';

import { Routes } from './dashboardRouts';

import { DashboardCoursesComponent } from './dashboard-courses/dashboard-courses.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DetailCourseComponent } from './detail-course/detail-course.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { VideoComponent } from './video/video.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { StudentComponent } from './student/student.component';
import { PaymentComponent } from './Payments/payment/payment.component';
import {StudentviewMentordashboardComponent} from './studentview-mentordashboard/studentview-mentordashboard.component';
import { RequestComponent } from './request/request.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { OfflineCourseOverviewComponent } from './offline-course-overview/offline-course-overview.component';
import { OnlineCourseOverviewComponent } from './online-course-overview/online-course-overview.component';
import { MentorFollowersComponent } from './mentor-followers/mentor-followers.component';

//livesessions
import { LiveVideoComponent } from './onlineSession/video/video.component';
import { TranslationComponent } from './onlineSession/translation/translation.component';
import { ChatComponent } from './onlineSession/chat/chat.component';
import { CodeTerminalLayoutComponent } from './onlineSession/code-terminal-layout/code-terminal-layout.component';
import { EditorComponent } from './onlineSession/editor/editor.component';


import {CanvasWhiteboardModule} from 'ng2-canvas-whiteboard'


import { MonacoEditorModule , NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { DrawingpadComponent } from './onlineSession/drawingpad/drawingpad.component';
import { PeerToPeerComponent } from './onlineSession/peer-to-peer/peer-to-peer.component';
import { TwiloVideoComponent } from './onlineSession/twilo-video/twilo-video.component';
// import { MonacoEditorComponent } from './onlineSession/monaco-editor/monaco-editor.component';
const monacoConfig: NgxMonacoEditorConfig = {
    baseUrl: 'assets',
    defaultOptions: { scrollBeyondLastLine: false },
    onMonacoLoad: () => {
      console.log((window as any).monaco);
      const uri = monaco.Uri.parse('a://b/foo.json');
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [{
          uri: 'http://myserver/foo-schema.json',
          fileMatch: [uri.toString()],
          schema: {
            type: 'object',
            properties: {
              p1: {
                enum: ['v1', 'v2']
              },
              p2: {
                $ref: 'http://myserver/bar-schema.json'
              }
            }
          }
        }, {
          uri: 'http://myserver/bar-schema.json',
          fileMatch: [uri.toString()],
          schema: {
            type: 'object',
            properties: {
              q1: {
                enum: ['x1', 'x2']
              }
            }
          }
        }]
      });
    } 
  };

@NgModule({
    declarations: [
        DashboardCoursesComponent,
        DashboardComponent,
        DetailCourseComponent,
        HomeScreenComponent,
        CreateCourseComponent,
        VideoComponent,
        ViewProfileComponent,
        StudentComponent,
        PaymentComponent,
        StudentviewMentordashboardComponent,
        RequestComponent,
        StudentDashboardComponent,
        OfflineCourseOverviewComponent,
        OnlineCourseOverviewComponent,
        MentorFollowersComponent,
        
        LiveVideoComponent,
        TranslationComponent,
        ChatComponent,
        CodeTerminalLayoutComponent,
        EditorComponent,
        DrawingpadComponent,
        PeerToPeerComponent,
        TwiloVideoComponent,
        // MonacoEditorComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        // MDB start =============
        MDBBootstrapModule.forRoot(),
        BadgeModule,
        BreadcrumbModule,
        ButtonsModule,
        // CardsFreeModule,
        CarouselModule.forRoot(),
        ChartsModule,
        CheckboxModule,
        CollapseModule.forRoot(),
        DropdownModule.forRoot(),
        IconsModule,
        InputsModule.forRoot(),
        InputUtilitiesModule,
        ModalModule.forRoot(),
        NavbarModule,
        PopoverModule.forRoot(),
        TableModule,
        TooltipModule.forRoot(),
        WavesModule.forRoot(),
        // MDB end=============

        RouterModule.forRoot(Routes, {
            scrollPositionRestoration: 'enabled'
        }),

        // PipesModule,
        // DirectivesModule,



        //start material
        A11yModule,
        CdkStepperModule,
        CdkTableModule,
        CdkTreeModule,
        DragDropModule,
        MatAutocompleteModule,
        MatBadgeModule,
        MatBottomSheetModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatTreeModule,
        PortalModule,
        ScrollingModule,
        // end materiali


        MonacoEditorModule.forRoot(monacoConfig),
        CanvasWhiteboardModule 
    ],
})
export class DashboardModule { }
