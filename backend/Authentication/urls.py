# urls.py (in your main project folder)
from django.urls import path, include
from .views import HRFetchAllView, HRUpdateView, RegisterView, RegisterAsHRView, CandidateDeleteSelfView, HRUserDeleteView

urlpatterns = [
    # urls.py
    path('candidate/', RegisterView.as_view()),
    path('register/candidate/', RegisterView.as_view()),
    path('auth/register/hr/', RegisterAsHRView.as_view()),
    path('candidate/delete-me/', CandidateDeleteSelfView.as_view()),
    path('hr/delete/<uuid:uuid>/', HRUserDeleteView.as_view()),
    path('hr/update/<uuid:uuid>/', HRUpdateView.as_view()),
    path('hr/users', HRFetchAllView.as_view()),
]