from rest_framework import serializers
from .models import application, candidate_skills, candidate_resume
from Authentication.models import Users

## application serializers

class applicationCandidateSerializer(serializers.ModelSerializer):
    class Meta:
        model = application
        fields = ['uuid', 'user', 'job', 'status', 'macro_score', 'micro_score', 'final_score', 'matchedAt']
        read_only_fields = ['uuid', 'user', 'macro_score', 'micro_score', 'final_score', 'matchedAt', 'status']
    
class applicationHRSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = application
        fields = ['uuid', 'user', 'user_email', 'job', 'status', 'macro_score', 'micro_score', 'final_score', 'matchedAt']
        read_only_fields = ['uuid', 'user', 'user_email']

## candidate skills serializers

class candidateSkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = candidate_skills
        fields = ['uuid', 'skill_name', 'experience']
        read_only_fields = ['uuid','skill_name', 'experience']

class candidateSkillsBulkSerializer(serializers.Serializer):
    skills = candidateSkillsSerializer(many=True)
    def create(self, validated_data):
        resume = self.context['resume']
        user = self.context['user']
        skills_data = validated_data['skills']
        skills = [
            candidate_skills(user=user, resume=resume, **item)
            for item in skills_data
        ]
        return candidate_skills.objects.bulk_create(skills)

## candidate resume serializers

class candidateResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = candidate_resume
        fields = ['uuid', 'resume_file']
        read_only_fields = ['uuid']