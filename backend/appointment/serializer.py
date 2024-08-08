from rest_framework import serializers
from .models import Appointment

class AppointmentDataSerializer(serializers.Serializer):
    specialty = serializers.CharField(max_length=100)
    appointment_date = serializers.DateField()
    start_time = serializers.TimeField()
    doctor_id = serializers.UUIDField()

class AppointmentSerializer(serializers.ModelSerializer):
    doctor_name = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = ['id', 'doctor_name', 'start_datetime', 'end_datetime', 'calendar_event_id', 'specialty']

    def get_doctor_name(self, obj):
        # Assuming CustomUser model has a 'name' field
        return obj.doctor.username if obj.doctor else None