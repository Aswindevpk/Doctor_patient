import os
from datetime import datetime,timedelta
from django.shortcuts import get_object_or_404
import pytz
from google.oauth2 import service_account
from googleapiclient.discovery import build
from django.conf import settings
from rest_framework.decorators import api_view
from .serializer import AppointmentDataSerializer,AppointmentSerializer
from accounts.models import CustomUser
from .models import Appointment
from rest_framework.response import Response
from rest_framework import status


# Path to the service account JSON file
SERVICE_ACCOUNT_FILE = os.path.join(settings.BASE_DIR, 'service_account.json')

# Google Calendar API scope
SCOPES = ['https://www.googleapis.com/auth/calendar']


@api_view(['POST'])
def create_event(request):
    try:
        serializer = AppointmentDataSerializer(data=request.data)
        if serializer.is_valid():
            appointment_date = serializer.validated_data['appointment_date']
            start_time = serializer.validated_data['start_time']

            speciality = serializer.validated_data['specialty']
            doctor_id = serializer.validated_data['doctor_id']
            doctor = CustomUser.objects.get(id=doctor_id)
            patient = CustomUser.objects.get(id=request.user.id)
            # Combine date and time into a single datetime object
            start_datetime = datetime.combine(appointment_date, start_time)
            end_datetime = start_datetime + timedelta(minutes=45)

            credentials = service_account.Credentials.from_service_account_file(
                SERVICE_ACCOUNT_FILE, scopes=SCOPES)

            # Build the service
            service = build('calendar', 'v3', credentials=credentials)

            # Define the local timezone for India
            local_tz = pytz.timezone('Asia/Kolkata')

            # Localize to the specified time zone (IST)
            start_time_local = local_tz.localize(start_datetime)
            end_time_local = local_tz.localize(end_datetime)

            # Convert to UTC
            start_time_utc = start_time_local.astimezone(pytz.utc)
            end_time_utc = end_time_local.astimezone(pytz.utc)

            # Convert to ISO format
            start_time_iso = start_time_utc.isoformat()
            end_time_iso = end_time_utc.isoformat()

            event = {
                'summary': f'Doctor Appointment for {patient.username}',
                'description': f'Appointment with Dr.{doctor.username}',
                'start': {
                    'dateTime': start_time_iso,
                    'timeZone': 'Asia/Kolkata',
                },
                'end': {
                    'dateTime': end_time_iso,
                    'timeZone': 'Asia/Kolkata',
                },
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},
                        {'method': 'popup', 'minutes': 10},
                    ],
                },
            }
            # Check for existing events to avoid double booking
            events_result = service.events().list(
                calendarId='primary',  # Use 'primary' for the primary calendar of the service account
                timeMin=start_time_iso,
                timeMax=end_time_iso,
                singleEvents=True,
                orderBy='startTime'
            ).execute()

            events = events_result.get('items', [])

            if events:
                return Response({'status':False, 'message':"Cannot create an event. This time slot is already booked."}, status.HTTP_406_NOT_ACCEPTABLE)

            # Call the Google Calendar API to create the event
            event = service.events().insert(calendarId='primary', body=event).execute()
            # create appointment instance
            if event:
                appointment = Appointment.objects.create(
                    patient= patient,
                    doctor=doctor,
                    start_datetime = start_datetime,
                    end_datetime = end_datetime,
                    specialty = speciality,
                    calendar_event_id = event['id']
                )
                appointment.save()
                return Response({'status':True, 'message':'Appointment Confirm','id':appointment.id}, status.HTTP_201_CREATED)
            return Response({'status':False, 'message':"error While creating event"}, status.HTTP_406_NOT_ACCEPTABLE)
    except Exception as e:
        print(e)
        return Response({'status':False, 'message':serializer.error_messages}, status.HTTP_400_BAD_REQUEST)
    

@api_view(['GET'])
def appointmentDetails(request,id):
    appointment = get_object_or_404(Appointment, id=id,patient=request.user.id)
    serializer = AppointmentSerializer(appointment)
    return Response({'status':True, 'message':'Appointment Confirm','data':serializer.data}, status.HTTP_200_OK)
