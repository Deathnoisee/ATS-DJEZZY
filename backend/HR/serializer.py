from .models import job_Data, job_skills, job_requirements
from rest_framework import serializers


## SERIALIZERS FOR JOB DATA

class jobDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = job_Data
        exclude = ['created_at', 'updated_at', 'deleted_at', 'is_deleted']

    def validate(self, attrs):
        macro = attrs.get('macro_weight')
        micro = attrs.get('micro_weight')

        if macro is not None and micro is not None:
            if macro + micro != 1:
                raise serializers.ValidationError({
                    "weight_error": "The sum of macro_weight and micro_weight must be exactly 1."
                })
        elif macro is not None:
            attrs['micro_weight'] = 1 - macro
        elif micro is not None:
            attrs['macro_weight'] = 1 - micro
        else:
            attrs['macro_weight'] = 0.5
            attrs['micro_weight'] = 0.5        
        return attrs
    
class JobDetailPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = job_Data
        fields = ['uuid', 'title', 'job_description']
    
class jobRawRequirementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = job_Data
        fields = ['jobs_requirement_raw']

## SERIALIZERS FOR JOB SKILLS

class jobSkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = job_skills
        fields =['uuid', 'skill', 'experience', 'weight', 'is_required']
        read_only_fields = ['uuid']

class BulkJobSkillsSerializer(serializers.Serializer):
    skills = jobSkillsSerializer(many=True)
    def create (self, validated_data):
        job = self.context['job']
        skills_data = validated_data['skills']
        skills = [job_skills(job=job, **item) for item in skills_data]
        return job_skills.objects.bulk_create(skills)

## SERIALIZERS FOR JOB REQUIREMENTS

class jobRequirementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = job_requirements
        fields =['uuid','requirement', 'experience']
        read_only_fields = ['uuid']

class BulkJobRequirementsSerializer(serializers.Serializer):
    requirements = jobRequirementsSerializer(many=True)
    def create (self, validated_data):
        job = self.context['job']
        requirements_data = validated_data['requirements']
        requirements = [job_requirements(job=job, **item) for item in requirements_data]
        return job_requirements.objects.bulk_create(requirements)
    
