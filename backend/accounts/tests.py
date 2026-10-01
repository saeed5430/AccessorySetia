import hashlib
import hmac
import json
import time
from urllib.parse import urlencode

from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

from .models import Platform, User
from .serializers import ProfileSerializer

TELEGRAM_TOKEN = "111111:telegram-test-token"
BALE_TOKEN = "222222:bale-test-token"

TEST_USER_PAYLOAD = {
    "id": 123456789,
    "first_name": "حسام",
    "last_name": "عبدالهی",
    "username": "hesam",
    "photo_url": "https://example.com/avatar.jpg",
}

VALID_PROFILE = {
    "first_name": "حسام",
    "last_name": "عبدالهی",
    "mobile_number": "09123456789",
    "address": "تهران، خیابان آزادی، پلاک ۱۲",
    "postal_code": "1234567890",
}


def build_init_data(bot_token, user_payload=None, auth_date=None):
    auth_date = int(time.time()) if auth_date is None else auth_date
    fields = {
        "user": json.dumps(user_payload or TEST_USER_PAYLOAD),
        "auth_date": str(auth_date),
        "query_id": "query-test",
    }
    data_check_string = "\n".join(
        f"{key}={value}" for key, value in sorted(fields.items())
    )
    secret_key = hmac.new(
        b"WebAppData", bot_token.encode("utf-8"), hashlib.sha256
    ).digest()
    fields["hash"] = hmac.new(
        data_check_string.encode("utf-8"), secret_key, hashlib.sha256
    ).hexdigest()
    return urlencode(fields)


class InitDataValidationTests(APITestCase):
    def setUp(self):
        self.url = "/api/account/login/"

    @override_settings(TELEGRAM_BOT_TOKEN=TELEGRAM_TOKEN, BALE_BOT_TOKEN=BALE_TOKEN)
    def test_login_with_valid_telegram_init_data(self):
        response = self.client.post(
            self.url,
            {"platform": "telegram", "init_data": build_init_data(TELEGRAM_TOKEN)},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access_token", response.data)
        self.assertIn("user", response.data)
        self.assertIn("is_profile_completed", response.data)
        self.assertFalse(response.data["is_profile_completed"])
        self.assertIn("refresh_token", response.cookies)

    @override_settings(TELEGRAM_BOT_TOKEN=TELEGRAM_TOKEN, BALE_BOT_TOKEN=BALE_TOKEN)
    def test_login_with_valid_bale_init_data(self):
        response = self.client.post(
            self.url,
            {"platform": "bale", "init_data": build_init_data(BALE_TOKEN)},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["platform"], "bale")

    @override_settings(TELEGRAM_BOT_TOKEN=TELEGRAM_TOKEN, BALE_BOT_TOKEN=BALE_TOKEN)
    def test_wrong_platform_token_is_rejected(self):
        response = self.client.post(
            self.url,
            {"platform": "telegram", "init_data": build_init_data(BALE_TOKEN)},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.post(
            self.url,
            {"platform": "bale", "init_data": build_init_data(TELEGRAM_TOKEN)},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(User.objects.count(), 0)

    @override_settings(TELEGRAM_BOT_TOKEN=TELEGRAM_TOKEN, BALE_BOT_TOKEN=BALE_TOKEN)
    def test_expired_init_data_is_rejected(self):
        old_date = int(time.time()) - 48 * 60 * 60
        response = self.client.post(
            self.url,
            {
                "platform": "telegram",
                "init_data": build_init_data(TELEGRAM_TOKEN, auth_date=old_date),
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @override_settings(TELEGRAM_BOT_TOKEN=TELEGRAM_TOKEN, BALE_BOT_TOKEN=BALE_TOKEN)
    def test_missing_hash_is_rejected(self):
        response = self.client.post(
            self.url,
            {
                "platform": "telegram",
                "init_data": urlencode(
                    {
                        "user": json.dumps(TEST_USER_PAYLOAD),
                        "auth_date": str(int(time.time())),
                    }
                ),
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @override_settings(TELEGRAM_BOT_TOKEN=TELEGRAM_TOKEN, BALE_BOT_TOKEN=BALE_TOKEN)
    def test_development_platform_is_rejected(self):
        response = self.client.post(
            self.url, {"platform": "web", "init_data": "x"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginFlowTests(APITestCase):
    def setUp(self):
        self.url = "/api/account/login/"

    @override_settings(TELEGRAM_BOT_TOKEN=TELEGRAM_TOKEN, BALE_BOT_TOKEN=BALE_TOKEN)
    def test_second_login_does_not_overwrite_database_fields(self):
        first_payload = dict(TEST_USER_PAYLOAD, username="hesam")
        self.client.post(
            self.url,
            {
                "platform": "telegram",
                "init_data": build_init_data(TELEGRAM_TOKEN, first_payload),
            },
            format="json",
        )
        user = User.objects.get()
        user.mobile_number = "09123456789"
        user.address = "تهران، خیابان آزادی، پلاک ۱۲"
        user.save()

        second_payload = dict(
            TEST_USER_PAYLOAD, username="changed", first_name="تغییر"
        )
        response = self.client.post(
            self.url,
            {
                "platform": "telegram",
                "init_data": build_init_data(TELEGRAM_TOKEN, second_payload),
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.count(), 1)
        user.refresh_from_db()
        self.assertEqual(user.username, "hesam")
        self.assertEqual(user.first_name, "حسام")
        self.assertEqual(user.mobile_number, "09123456789")

    @override_settings(TELEGRAM_BOT_TOKEN=TELEGRAM_TOKEN, BALE_BOT_TOKEN=BALE_TOKEN)
    def test_profile_fields_are_saved_only_on_first_login(self):
        self.client.post(
            self.url,
            {
                "platform": "telegram",
                "init_data": build_init_data(TELEGRAM_TOKEN),
            },
            format="json",
        )
        user = User.objects.get()
        self.assertEqual(user.platform_user_id, "123456789")
        self.assertEqual(user.first_name, "حسام")
        self.assertEqual(user.username, "hesam")
        self.assertEqual(user.avatar_url, "https://example.com/avatar.jpg")
        self.assertFalse(user.is_profile_completed)


@override_settings(
    TELEGRAM_BOT_TOKEN=TELEGRAM_TOKEN, BALE_BOT_TOKEN=BALE_TOKEN
)
class ProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            platform=Platform.TELEGRAM,
            platform_user_id="123456789",
            username="hesam",
            first_name="حسام",
        )
        self.access_token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")
        self.profile_url = "/api/account/profile/"
        self.me_url = "/api/account/me/"

    def test_me_requires_authentication(self):
        self.client.credentials()
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_full_user_with_jalali_dates(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["platform"], "telegram")
        self.assertIn("mobile_number", response.data)
        self.assertIn("created_at", response.data)
        self.assertRegex(response.data["created_at_jalali"], r"^\d{4}/\d{2}/\d{2}$")
        self.assertRegex(response.data["updated_at_jalali"], r"^\d{4}/\d{2}/\d{2}$")

    def test_profile_patch_updates_and_completes_profile(self):
        response = self.client.patch(self.profile_url, VALID_PROFILE, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["is_profile_completed"])
        self.assertEqual(response.data["mobile_number"], "09123456789")
        self.assertEqual(response.data["postal_code"], "1234567890")

        self.user.refresh_from_db()
        self.assertTrue(self.user.is_profile_completed)
        self.assertEqual(self.user.last_name, "عبدالهی")

    def test_profile_patch_keeps_postal_code_optional(self):
        payload = dict(VALID_PROFILE, postal_code="")
        response = self.client.patch(self.profile_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNone(response.data["postal_code"])
        self.assertTrue(response.data["is_profile_completed"])

    def test_profile_patch_rejects_invalid_mobile_number(self):
        payload = dict(VALID_PROFILE, mobile_number="9123456789")
        response = self.client.patch(self.profile_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["mobile_number"][0], "شماره تلفن باید ۱۱ رقم باشد"
        )

    def test_profile_patch_requires_all_fields(self):
        response = self.client.patch(
            self.profile_url, {"first_name": "حسام"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("mobile_number", response.data)
        self.assertIn("address", response.data)
        self.assertEqual(
            response.data["mobile_number"][0], "شماره تلفن خود را وارد کنید"
        )
        self.assertEqual(response.data["address"][0], "آدرس خود را وارد کنید")


class ProfileSerializerTests(APITestCase):
    def validate(self, payload):
        serializer = ProfileSerializer(data=payload)
        serializer.is_valid(raise_exception=False)
        return serializer

    def test_valid_payload(self):
        self.assertTrue(self.validate(VALID_PROFILE).is_valid())

    def test_persian_and_arabic_digits_accepted(self):
        for mobile in ("۰۹۱۲۳۴۵۶۷۸۹", "٠٩١٢٣٤٥٦٧٨٩"):
            payload = dict(VALID_PROFILE, mobile_number=mobile)
            serializer = self.validate(payload)
            self.assertTrue(serializer.is_valid(), serializer.errors)
            self.assertEqual(serializer.validated_data["mobile_number"], mobile)

        payload = dict(VALID_PROFILE, postal_code="۱۲۳۴۵۶۷۸۹۰")
        self.assertTrue(self.validate(payload).is_valid())

    def test_mobile_number_length_rules(self):
        for mobile in ("9123456789", "0912345678", "091234567890"):
            payload = dict(VALID_PROFILE, mobile_number=mobile)
            errors = self.validate(payload).errors
            self.assertEqual(errors["mobile_number"][0], "شماره تلفن باید ۱۱ رقم باشد")

    def test_required_field_messages(self):
        payload = {key: value for key, value in VALID_PROFILE.items() if key != "first_name"}
        errors = self.validate(payload).errors
        self.assertEqual(errors["first_name"][0], "نام خود را وارد کنید")

        payload = dict(VALID_PROFILE, last_name="")
        errors = self.validate(payload).errors
        self.assertEqual(errors["last_name"][0], "نام خانوادگی خود را وارد کنید")

        payload = dict(VALID_PROFILE, mobile_number="")
        errors = self.validate(payload).errors
        self.assertEqual(errors["mobile_number"][0], "شماره تلفن خود را وارد کنید")

        payload = dict(VALID_PROFILE, address="")
        errors = self.validate(payload).errors
        self.assertEqual(errors["address"][0], "آدرس خود را وارد کنید")

    def test_name_and_address_length_rules(self):
        payload = dict(VALID_PROFILE, first_name="ح")
        errors = self.validate(payload).errors
        self.assertEqual(errors["first_name"][0], "نام باید حداقل ۲ حرف باشد")

        payload = dict(VALID_PROFILE, last_name="ح")
        errors = self.validate(payload).errors
        self.assertEqual(
            errors["last_name"][0], "نام خانوادگی باید حداقل ۲ حرف باشد"
        )

        payload = dict(VALID_PROFILE, first_name="ح" * 51)
        errors = self.validate(payload).errors
        self.assertEqual(errors["first_name"][0], "نام نباید بیشتر از ۵۰ حرف باشد")

        payload = dict(VALID_PROFILE, address="کوتاه")
        errors = self.validate(payload).errors
        self.assertEqual(errors["address"][0], "آدرس باید حداقل ۱۰ حرف باشد")

        payload = dict(VALID_PROFILE, address="ا" * 301)
        errors = self.validate(payload).errors
        self.assertEqual(errors["address"][0], "آدرس نباید بیشتر از ۳۰۰ حرف باشد")

    def test_postal_code_rules(self):
        payload = dict(VALID_PROFILE, postal_code="12345")
        errors = self.validate(payload).errors
        self.assertEqual(errors["postal_code"][0], "کد پستی باید ۱۰ رقم باشد")

        payload = dict(VALID_PROFILE, postal_code=None)
        self.assertTrue(self.validate(payload).is_valid())

    def test_whitespace_is_trimmed(self):
        payload = dict(
            VALID_PROFILE,
            first_name="  حسام  ",
            address="  تهران، خیابان آزادی، پلاک ۱۲  ",
        )
        serializer = self.validate(payload)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        self.assertEqual(serializer.validated_data["first_name"], "حسام")
        self.assertEqual(
            serializer.validated_data["address"],
            "تهران، خیابان آزادی، پلاک ۱۲",
        )


class RefreshAndLogoutTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create(
            platform=Platform.TELEGRAM,
            platform_user_id="123456789",
            username="hesam",
            first_name="حسام",
        )
        self.refresh_url = "/api/account/token/refresh/"
        self.logout_url = "/api/account/logout/"

    def test_refresh_reads_cookie_and_rotates_token(self):
        self.client.cookies["refresh_token"] = str(RefreshToken.for_user(self.user))
        response = self.client.post(self.refresh_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh_token", response.cookies)

    def test_refresh_without_cookie_is_rejected(self):
        response = self.client.post(self.refresh_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_clears_refresh_cookie(self):
        access_token = str(AccessToken.for_user(self.user))
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")
        self.client.cookies["refresh_token"] = str(RefreshToken.for_user(self.user))
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.cookies["refresh_token"].value, "")

    def test_logout_requires_authentication(self):
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ProfileCompletionTests(APITestCase):
    def setUp(self):
        self.user = User(
            platform=Platform.TELEGRAM,
            platform_user_id="1",
            first_name="حسام",
            last_name="عبدالهی",
        )

    def test_completion_requires_all_four_fields(self):
        self.user.recalculate_profile_completion()
        self.assertFalse(self.user.is_profile_completed)

        self.user.mobile_number = "09123456789"
        self.user.recalculate_profile_completion()
        self.assertFalse(self.user.is_profile_completed)

        self.user.address = "تهران، خیابان آزادی، پلاک ۱۲"
        self.user.recalculate_profile_completion()
        self.assertTrue(self.user.is_profile_completed)

    def test_postal_code_does_not_affect_completion(self):
        self.user.mobile_number = "09123456789"
        self.user.address = "تهران، خیابان آزادی، پلاک ۱۲"
        self.user.recalculate_profile_completion()
        self.assertTrue(self.user.is_profile_completed)

        self.user.postal_code = "1234567890"
        self.user.recalculate_profile_completion()
        self.assertTrue(self.user.is_profile_completed)

    def test_missing_address_marks_profile_incomplete(self):
        self.user.mobile_number = "09123456789"
        self.user.address = "تهران، خیابان آزادی، پلاک ۱۲"
        self.user.recalculate_profile_completion()
        self.user.address = ""
        self.user.recalculate_profile_completion()
        self.assertFalse(self.user.is_profile_completed)
