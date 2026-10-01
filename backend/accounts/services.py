import hashlib
import hmac
import json
import time
from urllib.parse import parse_qsl

from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.settings import api_settings as jwt_settings
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from .models import Platform, User


class InitDataError(AuthenticationFailed):
    pass


def get_bot_token(platform):
    if platform == Platform.TELEGRAM:
        return settings.TELEGRAM_BOT_TOKEN
    if platform == Platform.BALE:
        return settings.BALE_BOT_TOKEN
    raise InitDataError("پلتفرم نامعتبر است.")


def validate_init_data(platform, init_data):
    if platform not in (Platform.TELEGRAM, Platform.BALE):
        raise InitDataError("پلتفرم نامعتبر است.")
    if not init_data:
        raise InitDataError("اطلاعات ورود نامعتبر است.")

    token = get_bot_token(platform)
    if not token:
        raise InitDataError("سرویس احراز هویت پیکربندی نشده است.")

    try:
        pairs = dict(parse_qsl(init_data, keep_blank_values=True))
    except ValueError as exc:
        raise InitDataError("اطلاعات ورود نامعتبر است.") from exc

    received_hash = pairs.pop("hash", None)
    if not received_hash:
        raise InitDataError("اطلاعات ورود نامعتبر است.")

    data_check_string = "\n".join(
        f"{key}={value}" for key, value in sorted(pairs.items())
    )
    secret_key = hmac.new(
        b"WebAppData", token.encode("utf-8"), hashlib.sha256
    ).digest()
    calculated_hash = hmac.new(
        data_check_string.encode("utf-8"), secret_key, hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(calculated_hash, received_hash):
        raise InitDataError("امضای اطلاعات ورود نامعتبر است.")

    auth_date = pairs.get("auth_date")
    if auth_date:
        try:
            age = time.time() - int(auth_date)
        except (TypeError, ValueError) as exc:
            raise InitDataError("اطلاعات ورود نامعتبر است.") from exc
        if age < 0 or age > settings.INIT_DATA_MAX_AGE:
            raise InitDataError("اطلاعات ورود منقضی شده است.")

    return pairs


def extract_identity(platform, fields):
    try:
        user_json = json.loads(fields.get("user", ""))
    except (TypeError, ValueError) as exc:
        raise InitDataError("اطلاعات کاربر نامعتبر است.") from exc

    platform_user_id = user_json.get("id")
    if platform_user_id in (None, ""):
        raise InitDataError("اطلاعات کاربر نامعتبر است.")

    return {
        "platform": platform,
        "platform_user_id": str(platform_user_id),
        "username": user_json.get("username"),
        "first_name": user_json.get("first_name"),
        "last_name": user_json.get("last_name"),
        "avatar_url": user_json.get("photo_url"),
    }


def create_user_from_identity(identity):
    user = User(
        platform=identity["platform"],
        platform_user_id=identity["platform_user_id"],
        username=identity.get("username"),
        first_name=identity.get("first_name"),
        last_name=identity.get("last_name"),
        avatar_url=identity.get("avatar_url"),
    )
    user.recalculate_profile_completion()
    user.save()
    return user


def issue_tokens(user):
    refresh = RefreshToken.for_user(user)
    return {
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
    }


def set_refresh_cookie(response, refresh_token):
    response.set_cookie(
        settings.REFRESH_COOKIE_NAME,
        refresh_token,
        max_age=int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()),
        path=settings.REFRESH_COOKIE_PATH,
        httponly=settings.REFRESH_COOKIE_HTTP_ONLY,
        secure=settings.REFRESH_COOKIE_SECURE,
        samesite=settings.REFRESH_COOKIE_SAMESITE,
    )


def clear_refresh_cookie(response):
    response.delete_cookie(
        settings.REFRESH_COOKIE_NAME,
        path=settings.REFRESH_COOKIE_PATH,
        samesite=settings.REFRESH_COOKIE_SAMESITE,
    )


def get_user_from_access_token(access_token):
    try:
        token = AccessToken(access_token)
        user_id = token[jwt_settings.USER_ID_CLAIM]
        return User.objects.get(pk=user_id, is_active=True)
    except Exception as exc:
        raise InitDataError("توکن نامعتبر است.") from exc
