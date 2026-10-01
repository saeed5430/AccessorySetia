import uuid

from django.db import models


class Platform(models.TextChoices):
    TELEGRAM = "telegram", "Telegram"
    BALE = "bale", "Bale"


class User(models.Model):
    PROFILE_REQUIRED_FIELDS = (
        "first_name",
        "last_name",
        "mobile_number",
        "address",
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    USERNAME_FIELD = "id"
    REQUIRED_FIELDS = []
    platform = models.CharField(max_length=16, choices=Platform.choices)
    platform_user_id = models.CharField(max_length=64)
    username = models.CharField(max_length=64, null=True, blank=True)
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    avatar_url = models.CharField(max_length=500, null=True, blank=True)
    mobile_number = models.CharField(max_length=11, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    postal_code = models.CharField(max_length=10, null=True, blank=True)
    is_profile_completed = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "users"
        ordering = ["-created_at"]
        verbose_name = "user"
        verbose_name_plural = "users"
        constraints = [
            models.UniqueConstraint(
                fields=["platform", "platform_user_id"],
                name="unique_platform_user",
            )
        ]

    def __str__(self):
        identity = self.username or self.platform_user_id
        return f"{self.platform}:{identity}"

    @property
    def full_name(self):
        return " ".join(
            part for part in [self.first_name, self.last_name] if part
        )

    @property
    def is_anonymous(self):
        return False

    @property
    def is_authenticated(self):
        return True

    def recalculate_profile_completion(self):
        completed = all(
            bool(getattr(self, field)) for field in self.PROFILE_REQUIRED_FIELDS
        )
        self.is_profile_completed = completed
        return completed
