from rest_framework import generics, permissions, status
from rest_framework.response import Response
from Authentication.permissions import IsRHUser
from HR.Services.statsServices.statsServices import get_total_jobs, get_total_open_jobs, get_total_closed_jobs
from HR.Services.statsServices.statsServices  import get_total_jobs_by_department, get_total_jobs_by_location, get_total_users, get_total_applications
from HR.Services.statsServices.statsServices  import get_most_applied_jobs, get_job_applications_count, get_average_scores
from HR.Services.statsServices.statsServices  import get_application_status_distribution, job_best_5

class StatsView(generics.GenericAPIView):
    permission_classes = [IsRHUser]
    def get(self, request, **kwargs):
        stat_type = request.query_params.get('type')
        if stat_type == 'total_jobs':
            total = get_total_jobs()
            return Response({'total': total})
        if stat_type == 'total_open_jobs':
            total = get_total_open_jobs()
            return Response({'total': total})
        if stat_type == 'total_closed_jobs':
            total = get_total_closed_jobs()
            return Response({'total': total})
        if stat_type == 'total_jobs_by_department':
            department = request.query_params.get('department')
            total = get_total_jobs_by_department(department)
            return Response({'total': total})
        if stat_type == 'total_jobs_by_location':
            location = request.query_params.get('location')
            total = get_total_jobs_by_location(location)
            return Response({'total': total})
        if stat_type == 'total_users':
            total = get_total_users()
            return Response({'total': total})
        if stat_type == 'total_applications':
            total = get_total_applications()
            return Response({'total': total})
        if stat_type == 'most_applied_jobs':
            total = get_most_applied_jobs()
            return Response({'most_applied_jobs': total})
        
        return Response({'error': 'Invalid stat type'}, status=status.HTTP_400_BAD_REQUEST)

class JobStatsView(generics.GenericAPIView):
    permission_classes = [IsRHUser]
    def get(self, request, **kwargs):
        job_uuid = kwargs.get('job_uuid')
        stat_type = request.query_params.get('type')
        if stat_type == 'total_applications':
            total = get_job_applications_count(job_uuid)
            return Response({'total': total})
        if stat_type == 'application_status_distribution':
            distribution = get_application_status_distribution()
            return Response({'application_status_distribution': distribution})
        if stat_type == 'average_scores':
            average = get_average_scores(job_uuid)
            return Response({'average_scores': average})
        if stat_type == 'best_5':
            best_5 = job_best_5(job_uuid)
            return Response({'best_5': best_5})
        return Response({'error': 'Invalid stat type'}, status=status.HTTP_400_BAD_REQUEST)