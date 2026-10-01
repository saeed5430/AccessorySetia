import re
from zoneinfo import ZoneInfo

import jdatetime
from rest_framework import serializers

from .models import Platform, User

DIGITS_PATTERN = re.compile(r"^[0-9۰-۹٠-٩]{11}$")
POSTAL_CODE_PATTERN = re.compile(r"^[0-9۰-۹٠-٩]{10}$")
TEHRAN = ZoneInfo("Asia/Tehran")


def to_jalali(value):
    local_value = value.astimezone(TEHRAN)
    return jdatetime.date.fromgregorian(date=local_value.date()).strftime("%Y/%m/%d")


class UserSerializer(serializers.ModelSerializer):
    created_at_jalali = serializers.SerializerMethodField()
    updated_at_jalali = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "platform",
            "platform_user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
            "mobile_number",
            "address",
            "postal_code",
            "is_profile_completed",
            "is_active",
            "created_at",
            "created_at_jalali",
            "updated_at",
            "updated_at_jalali",
        ]
        read_only_fields = fields

    def get_created_at_jalali(self, obj):
        return to_jalali(obj.created_at)

    def get_updated_at_jalali(self, obj):
        return to_jalali(obj.updated_at)


class ProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            "required": "نام خود را وارد کنید",
            "blank": "نام خود را وارد کنید",
            "null": "نام خود را وارد کنید",
        },
    )
    last_name = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            "required": "نام خانوادگی خود را وارد کنید",
            "blank": "نام خانوادگی خود را وارد کنید",
            "null": "نام خانوادگی خود را وارد کنید",
        },
    )
    mobile_number = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            "required": "شماره تلفن خود را وارد کنید",
            "blank": "شماره تلفن خود را وارد کنید",
            "null": "شماره تلفن خود را وارد کنید",
        },
    )
    address = serializers.CharField(
        required=True,
        allow_blank=False,
        error_messages={
            "required": "آدرس خود را وارد کنید",
            "blank": "آدرس خود را وارد کنید",
            "null": "آدرس خود را وارد کنید",
        },
    )
    postal_code = serializers.CharField(
        required=False,
        allow_blank=True,
        allow_null=True,
    )

    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "mobile_number",
            "address",
            "postal_code",
        ]

    def validate_first_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("نام خود را وارد کنید")
        if len(value) < 2:
            raise serializers.ValidationError("نام باید حداقل ۲ حرف باشد")
        if len(value) > 50:
            raise serializers.ValidationError("نام نباید بیشتر از ۵۰ حرف باشد")
        return value

    def validate_last_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("نام خانوادگی خود را وارد کنید")
        if len(value) < 2:
            raise serializers.ValidationError("نام خانوادگی باید حداقل ۲ حرف باشد")
        if len(value) > 50:
            raise serializers.ValidationError("نام خانوادگی نباید بیشتر از ۵۰ حرف باشد")
        return value

    def validate_mobile_number(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("شماره تلفن خود را وارد کنید")
        if not DIGITS_PATTERN.match(value):
            raise serializers.ValidationError("شماره تلفن باید ۱۱ رقم باشد")
        return value

    def validate_address(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("آدرس خود را وارد کنید")
        if len(value) < 10:
            raise serializers.ValidationError("آدرس باید حداقل ۱۰ حرف باشد")
        if len(value) > 300:
            raise serializers.ValidationError("آدرس نباید بیشتر از ۳۰۰ حرف باشد")
        return value

    def validate_postal_code(self, value):
        if value is None:
            return None
        value = value.strip()
        if not value:
            return None
        if not POSTAL_CODE_PATTERN.match(value):
            raise serializers.ValidationError("کد پستی باید ۱۰ رقم باشد")
        return value

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.recalculate_profile_completion()
        instance.save()
        return instance


class LoginSerializer(serializers.Serializer):
    platform = serializers.ChoiceField(choices=Platform.choices)
    init_data = serializers.CharField(required=True, allow_blank=False)
