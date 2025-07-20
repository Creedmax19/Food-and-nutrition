"""
URL configuration for African Meal Planner project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/recipes/', include('recipes.urls')),
    path('api/meal-planning/', include('meal_planning.urls')),
    path('api/shopping/', include('shopping.urls')),
    path('api/ai/', include('ai_engine.urls')),
    path('api/nutrition/', include('nutrition.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin site customization
admin.site.site_header = "African Meal Planner Admin"
admin.site.site_title = "African Meal Planner"
admin.site.index_title = "Welcome to African Meal Planner Administration"