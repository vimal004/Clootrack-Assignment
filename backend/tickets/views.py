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

    @action(detail=False, methods=['get'])
    def stats(self, request):
        total_tickets = Ticket.objects.count()
        open_tickets = Ticket.objects.filter(status='open').count()

        # Breakdown
        priority_breakdown = Ticket.objects.values('priority').annotate(count=Count('id'))
        category_breakdown = Ticket.objects.values('category').annotate(count=Count('id'))

        # Avg per day
        daily_counts = Ticket.objects.annotate(date=TruncDay('created_at')).values('date').annotate(count=Count('id')).aggregate(avg=Avg('count'))
        avg_tickets_per_day = daily_counts['avg'] or 0

        # Format breakdowns into dicts
        p_data = {item['priority']: item['count'] for item in priority_breakdown}
        c_data = {item['category']: item['count'] for item in category_breakdown}

        return Response({
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "avg_tickets_per_day": round(avg_tickets_per_day, 1),
            "priority_breakdown": p_data,
            "category_breakdown": c_data
        })
