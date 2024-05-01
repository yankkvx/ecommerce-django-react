from django.db.models.signals import pre_save, post_save
from django.contrib.auth.models import User
from django.core.validators import validate_email
from django.core.exceptions import ValidationError


def update_user(sender, instance, **kwargs):
    user = instance
    if user.email:
        validate_email(user.email)
        user.username = user.email


pre_save.connect(update_user, sender=User)
