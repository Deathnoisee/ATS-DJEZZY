from django.urls import path

from .views import createApplicationView, createCandidateResumeView, createCandidateSkillBulkView, deleteAnyResumeView, deleteApplicationView, deleteResumeView, fetchAllApplicationsForJobHRView, fetchAllApplicationsUserView, fetchAllCandidateSkillsView, fetchAllResumesView, fetchApplication, fetchResumeView, fetchTopFiveApplicationsForJobHRView, updateApplicationView


urlpatterns = [
    
    ## application urls

    path('application/create/', createApplicationView.as_view()),
    path('application/', fetchAllApplicationsUserView.as_view()),
    path('application/<uuid:uuid>/', fetchApplication.as_view()),
    path('application/hr/<uuid:job_uuid>/', fetchAllApplicationsForJobHRView.as_view()),
    path('application/hr/<uuid:job_uuid>/top/', fetchTopFiveApplicationsForJobHRView.as_view()),
    path('application/<uuid:uuid>/update/', updateApplicationView.as_view()),
    path('application/<uuid:uuid>/delete/', deleteApplicationView.as_view()),

    ## candidate skills urls

    path('candidate_skills/<uuid:user_uuid>/create/', createCandidateSkillBulkView.as_view()),
    path('candidate_skills/<uuid:user_uuid>/', fetchAllCandidateSkillsView.as_view()),

    ## candidate resume urls

    path('candidate_resume/create/', createCandidateResumeView.as_view()),
    path('candidate_resume/', fetchAllResumesView.as_view()),
    path('candidate_resume/<uuid:user_uuid>/', fetchResumeView.as_view()),
    path('candidate_resume/delete/', deleteResumeView.as_view()),
    path('candidate_resume/<uuid:user_uuid>/delete/', deleteAnyResumeView.as_view()),
]
