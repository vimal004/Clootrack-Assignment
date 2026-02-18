from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Avg, F
from django.db.models.functions import TruncDay
from .models import Ticket
from .serializers import TicketSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all().order_by('-created_at')
    serializer_class = TicketSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        priority = self.request.query_params.get('priority')
        status = self.request.query_params.get('status')
        search = self.request.query_params.get('search')

        if category:
            queryset = queryset.filter(category=category)
        if priority:
            queryset = queryset.filter(priority=priority)
        if status:
            queryset = queryset.filter(status=status)
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(description__icontains=search)

        return queryset
