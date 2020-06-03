// var baseUrl = "http://localhost:8080/";
// var baseUrl = "http://localhost:5001/";
// var baseUrl = "https://aimentruiserver.herokuapp.com/";
import { environment } from '../environments/environment'
// var baseUrl = "";
var baseUrl = environment.API_URL;
export const APIURL = {

    REGISTER_WITH_RESUME: baseUrl + "api/upload",
    GET_AUDIO_TO_TEXT: baseUrl + "api/getAudioToText",



    // auth Routs
    AUTH_VALIDUSERNAME: baseUrl + 'auth/validUsername/:username',
    AUTH_REGISTER_USER: baseUrl + 'auth/register',
    AUTH_LOGIN_USER: baseUrl + 'auth/login',
    AUTH_RESET_PASSWORD: baseUrl + 'auth/resetPassword',
    EXTRACT_RESUME: baseUrl + 'extractResume',
    MAIL_VERIFIED_BY_USERNAME: baseUrl + 'mailVerified/:username',
    MAIL_VERIFICATION_STATUS_BY_USERNAME: baseUrl + 'mailVerificationStatus/:username',
    RESEND_CONFORMATION_BY_USERNAME: baseUrl + 'resendConfirmation/:username',
    SEND_OTP: baseUrl + 'sendOtp',
    VERIFY_OTP: baseUrl + 'verifyOtp',
    STUDENT_REGISTRATION: baseUrl + 'studentRegistration',

    // User Routes
    GET_USER_INFO: baseUrl + 'getUserInfo',
    UPDATE_USER_PROFILE: baseUrl + 'updateProfile',
    GET_USERS_BY_ROLE: baseUrl + 'getUsersByRole',
    GET_USERS_BY_QUERY: baseUrl + 'queryUsers',

    GET_USERS_FOR_FILTERS: baseUrl + 'filterUsersAndCourses',
    GET_USER_BY_EMAIL: baseUrl + 'getUserByEmail',


    //Course 
    ADD_COURSE: baseUrl + 'addCourse',
    GET_ALL_COURSES_OF_MENTOR: baseUrl + 'getAllCoursesOfMentor',
    UPDATE_COURSE: baseUrl + 'updateCourse',
    DELETE_COURSE: baseUrl + 'deleteCourse',

    GET_COURSE_INFO_BY_ID: baseUrl + 'getCourseInfo',




    //topics and subtopics of course

    ADD_TOPICS_OF_COURSE: baseUrl + 'AddTopicOfCourse',
    GET_TOPICS_OF_COURSE: baseUrl + 'getTopicsOfCourse',
    UPDATE_TOPIC_NAMES_OF_COURSE: baseUrl + 'updateTopicNames',
    DELETE_TOPICS_NAMES_OF_COURSE: baseUrl + 'deleteTopicNames',
    GET_TOPICS_BASED_ON_COURSEIDS: baseUrl + 'getTopicsBasedOnCourseIds',

    ADD_SUB_TOPICS_OF_COURSE: baseUrl + 'AddSubTopicOfCourse',
    GET_SUB_TOPICS_OF_COURSE: baseUrl + 'getSubtopicsOfCourse',
    UPDATE_SUB_TOPIC_NAMES_OF_COURSE: baseUrl + 'updateSubTopicNames',
    DELETE_SUB_TOPIC_NAMES_OF_COURSE: baseUrl + 'deleteSubTopicNames',

    GET_SUBTOPICS_BASED_ON_COURSEIDS: baseUrl + 'getSubTopicsBasedOnCourseIds',



    UPDATE_SUB_TOPIC_PROGRAMMING_STATUS: baseUrl + 'updateSubTopicProgrammingStatus',
    UPDATE_SUB_TOPIC_VIDEO_URL: baseUrl + 'updateSubTopicVideoUrl',


    //User Completed Videos
    ADD_USER_COMPLETED_VIDEOS_OF_THE_COURSE: baseUrl + 'AddUserCompletedVideosOftheCourse',
    GET_USER_COMPLETED_VIDEOS_OF_THE_COURSE: baseUrl + 'getUserCompletedVideosOftheCourse',


    //Payment 
    MAKE_PAYMENT: baseUrl + 'makePayment',
    GET_BEFORE_PAID_PAYMENT_USER_DETAILS: baseUrl + 'getBeforePaidPaymentDetails',
    DELETE_BEFORE_PAID_PAYMENT_USER_DETAILS: baseUrl + 'DeleteBeforePaidPaymentDetails',
    INSERT_PAYMENT_DETAILS: baseUrl + 'InsertPaymentDetails',
    DELETE_PAYMENT_DETAILS: baseUrl + 'DeletePaymentDetails',
    GET_PAID_COURSES: baseUrl + 'getPaidCourses',
    GET_PAID_USERS: baseUrl + 'getPaidUsers',


    //Follow and Message
    START_FOLLOWING: baseUrl + 'startFollowing',
    GET_FOLLOWERS: baseUrl + 'getFollowers',
    CHECK_FOLLOWING_STATUS: baseUrl + 'CheckFollowingOrNot',
    UPDATE_FOLLOW_REQUEST_ACCEPTED_OR_REJECTED: baseUrl + 'UpdateFollowRequestOrRejected',
    UNFOLLOW: baseUrl + 'unFollow',
    SEND_MESSAGE_NOTIFICATIONS: baseUrl + 'SendMessage/Notifications',
    GET_MESSAGE_NOTIFICATIONS: baseUrl + 'GetMessages/Notifications',
    UPDATE_MESSAGE_STATUS: baseUrl + 'updateMessageStatus',
    DELETE_MESSAGE: baseUrl + 'DeleteMessage',


    // Video Sessions twilio
    CREATE_VIDEO_SESSION: baseUrl + 'CreateVideoSeeion',







    // SESSION API's
    CREATE_SESSION: baseUrl + 'createSession',
    END_SESSION: baseUrl + 'endSession',
    JOIN_SESSION: baseUrl + 'joinSession',
    EXIT_FROM_SESSION: baseUrl + 'exitSession',
    IS_VALID_USER_FOR_SESSION: baseUrl + 'validUserForSession',
    COMPILE_CODE: baseUrl + 'compileCode',
    IS_ADMIN_FOR_SESSION: baseUrl + 'isAdminForSession',

    // GOOGLE TRANSLATE API's
    GET_ALL_SUPPORTED_LANGUAGES: baseUrl + 'getAllSupportedLanguages',
    TRANSLATE_TEXT: baseUrl + 'translateText',
    GET_ALL_SUPPORTED_LANGUAGES_FOR_LANG: baseUrl + 'getSupportedLanguagesForLang',





}