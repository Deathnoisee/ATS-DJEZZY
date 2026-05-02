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
        fields =['uuid', 'skill', 'experience', 'weight', 'is_required', 'with_ai']
        read_only_fields = ['uuid']
class JobSkillsUpdateSerializer(serializers.ModelSerializer):
    uuid = serializers.UUIDField()
    class Meta:
        model = job_skills
        fields =['uuid', 'skill', 'experience', 'weight', 'is_required', 'with_ai']

class BulkJobSkillsSerializer(serializers.Serializer):
    skill = jobSkillsSerializer(many=True)
    def create (self, validated_data):
        job = self.context['job']
        skills_data = validated_data['skill']
        skills = [job_skills(job=job, **item) for item in skills_data]
        return job_skills.objects.bulk_create(skills)
    def to_representation(self, instance):
        return {
            'skills': jobSkillsSerializer(instance, many=True).data
        }
class BulkUpdateJobSkillsSerializer(serializers.Serializer):
    skill = JobSkillsUpdateSerializer(many=True)
    def update(self, instance, validated_data):
        skills_data = validated_data.get('skill', [])
        data_map = {str(item['uuid']): item for item in skills_data}
        
        to_update = job_skills.objects.filter(uuid__in=data_map.keys())
        
        updated_instances = []
        for obj in to_update:
            data = data_map[str(obj.uuid)]
            for attr, value in data.items():
                if attr != 'uuid':
                    setattr(obj, attr, value)
            updated_instances.append(obj)

        if updated_instances:
            fields = ['skill', 'experience', 'weight', 'is_required', 'with_ai']
            job_skills.objects.bulk_update(updated_instances, fields)
            
        return {"skill": updated_instances}
    
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
    
