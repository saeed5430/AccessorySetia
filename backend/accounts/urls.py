from django.urls import path

from . import views

app_name = "accounts"

urlpatterns = [
    path("login/", views.LoginView.as_view(), name="login"),
    path("me/", views.MeView.as_view(), name="me"),
    path("profile/", views.ProfileView.as_view(), name="profile"),
    path(
        "token/refresh/",
        views.TokenRefreshView.as_view(),
        name="token-refresh",
    ),
    path("logout/", views.LogoutView.as_view(), name="logout"),
]
