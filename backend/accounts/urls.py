from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/',RegisterUser.as_view(),name='user_register'),
    path('login/',LoginUser.as_view(),name='user_login'),
    path('login/refresh/',TokenRefreshView.as_view(),name='user_token_refresh'),
    path('logout/',LogoutUser.as_view(),name='user_logout'),
    path('user-details/',UserDetails.as_view(),name='user_logout'),

]