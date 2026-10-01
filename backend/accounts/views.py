from django.conf import settings
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from . import services
from .models import User
from .serializers import LoginSerializer, ProfileSerializer, UserSerializer


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        input_serializer = LoginSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)

        platform = input_serializer.validated_data["platform"]
        init_data = input_serializer.validated_data["init_data"]

        fields = services.validate_init_data(platform, init_data)
        identity = services.extract_identity(platform, fields)

        user = User.objects.filter(
            platform=identity["platform"],
            platform_user_id=identity["platform_user_id"],
        ).first()

        if user is None:
            user = services.create_user_from_identity(identity)

        tokens = services.issue_tokens(user)

        response = Response(
            {
                "access_token": tokens["access_token"],
                "user": UserSerializer(user).data,
                "is_profile_completed": user.is_profile_completed,
            }
        )
        services.set_refresh_cookie(response, tokens["refresh_token"])
        return response


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ProfileView(APIView):
    def patch(self, request):
        serializer = ProfileSerializer(
            request.user, data=request.data, partial=False
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data)


class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get(settings.REFRESH_COOKIE_NAME)
        if not refresh_token:
            raise AuthenticationFailed("توکن بازیابی یافت نشد.")

        try:
            RefreshToken(refresh_token)
        except TokenError as exc:
            raise AuthenticationFailed("توکن بازیابی نامعتبر است.") from exc

        serializer = TokenRefreshSerializer(data={"refresh": refresh_token})
        serializer.is_valid(raise_exception=True)

        response = Response({"access": serializer.validated_data["access"]})
        rotated_refresh = serializer.validated_data.get("refresh")
        if rotated_refresh:
            services.set_refresh_cookie(response, rotated_refresh)
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response(
            {"detail": "با موفقیت خارج شدید."}, status=status.HTTP_200_OK
        )
        services.clear_refresh_cookie(response)
        return response
