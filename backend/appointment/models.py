from django.db import models
from accounts.models import CustomUser

class Appointment(models.Model):
    patient = models.ForeignKey(CustomUser,on_delete=models.CASCADE, related_name='appointments_as_patient')
    doctor = models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='appointments_as_doctor')
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    calendar_event_id = models.CharField(max_length=255, blank=True, null=True)
    specialty = models.CharField(max_length=100)
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient} - {self.doctor} on {self.start_datetime}"
