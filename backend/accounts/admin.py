from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "platform",
        "platform_user_id",
        "username",
        "first_name",
        "last_name",
        "is_profile_completed",
        "is_active",
        "created_at",
    )
    list_filter = ("platform", "is_profile_completed", "is_active")
    search_fields = ("platform_user_id", "username", "first_name", "last_name")
    readonly_fields = ("id", "created_at", "updated_at")
