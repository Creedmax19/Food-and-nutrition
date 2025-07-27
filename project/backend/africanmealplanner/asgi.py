"""
ASGI config for African Meal Planner project.
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'africanmealplanner.settings')

application = get_asgi_application()