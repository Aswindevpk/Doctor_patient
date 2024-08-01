from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import CustomUser,Address
from django.contrib.auth import authenticate
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated



class RegisterUser(APIView):
    serializer_class = RegisterSerializer

    def post(self,request):
        try:
            print(request.data)
            data = request.data
            serializer = self.serializer_class(data=data)
            if not serializer.is_valid():
                return Response({
                    'status':False,
                    'message':serializer.errors
                    }, status.HTTP_400_BAD_REQUEST)
            serializer.save()
            return Response({'status':True, 'message':'user created'}, status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'status':False, 'message':serializer.error_messages}, status.HTTP_400_BAD_REQUEST)


class LoginUser(APIView):
    def post(self,request):
        data = request.data 
        serializer = LoginSerializer(data=data)
        if not serializer.is_valid():
            return Response({
                'status':False,
                'message':serializer.errors,
                'verified':True
                }, status.HTTP_400_BAD_REQUEST)
        user = authenticate(username=serializer.data.get('username'),
                            password=serializer.data.get('password'))
        if not user:
            return Response({
                'status':False,
                'message':'incorrect credentials.Try again',
                'verified':True
                }, status.HTTP_401_UNAUTHORIZED)
        
        if user.user_type != serializer.data.get('user_type'):
            return Response({'status':False, 
                'message':'Invalid credentials.',
            }, status.HTTP_401_UNAUTHORIZED)

        #create the tokens
        refresh = RefreshToken.for_user(user)
        refresh['username'] = user.username
        refresh['user_type'] = user.user_type
        
        return Response({'status':True, 
                         'message':'user login',
                          'refresh': str(refresh),
                          'access': str(refresh.access_token)
                         }, status.HTTP_200_OK)


class LogoutUser(APIView):
    def post(self, request):
        try:
            data = request.data
            serializer = LogoutSerializer(data=data)
            if not serializer.is_valid():
                return Response({
                'status':False,
                'message':serializer.errors
                }, status.HTTP_400_BAD_REQUEST)
            token = RefreshToken(serializer.validated_data['refresh'])
            token.blacklist()
            return Response({
                'status':True,
                'message':"Logged out"
                },status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'status':False,
                'message':e
            },status=status.HTTP_400_BAD_REQUEST)
        
class UserDetails(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request):
        try:
            user = CustomUser.objects.get(id=request.user.id)
            serializer = UserDetailSerializer(instance=user)
            print(serializer.data)
            return Response({
                    "status":True,
                    "data":serializer.data},status.HTTP_200_OK)
                
        except CustomUser.DoesNotExist:
            return Response({'error': 'No article found !'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
