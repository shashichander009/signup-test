from django.urls import path
from .views import EmailSignupView, PhoneSignupView, LoginView

urlpatterns = [
    path('signup/email/', EmailSignupView.as_view(), name='signup-email'),
    path('signup/phone/', PhoneSignupView.as_view(), name='signup-phone'),
    path('login/', LoginView.as_view(), name='login'),
]
