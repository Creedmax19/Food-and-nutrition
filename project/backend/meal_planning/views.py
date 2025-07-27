"""
Views for the meal_planning app.
"""
from rest_framework import generics, permissions
from .models import MealPlan, MealPlanEntry
from .serializers import MealPlanSerializer, MealPlanEntrySerializer

class MealPlanListCreateView(generics.ListCreateAPIView):
    """
    API endpoint that allows meal plans to be viewed or created.
    """
    queryset = MealPlan.objects.all()
    serializer_class = MealPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MealPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class MealPlanDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that allows a single meal plan to be viewed, updated or deleted.
    """
    queryset = MealPlan.objects.all()
    serializer_class = MealPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MealPlan.objects.filter(user=self.request.user)

class MealPlanEntryListCreateView(generics.ListCreateAPIView):
    """
    API endpoint that allows meal plan entries to be viewed or created.
    """
    serializer_class = MealPlanEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MealPlanEntry.objects.filter(
            meal_plan_id=self.kwargs['meal_plan_id'],
            meal_plan__user=self.request.user
        )

    def perform_create(self, serializer):
        meal_plan = MealPlan.objects.get(
            id=self.kwargs['meal_plan_id'],
            user=self.request.user
        )
        serializer.save(meal_plan=meal_plan)

class MealPlanEntryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that allows a single meal plan entry to be viewed, updated or deleted.
    """
    serializer_class = MealPlanEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MealPlanEntry.objects.filter(
            meal_plan__user=self.request.user
        )
