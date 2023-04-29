from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from rest_framework.views import APIView
from Lab_1.models import UserProfile, User
from Lab_1.serializers import UserSerializer, UserProfileSerializer
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken

class RegisterView(generics.GenericAPIView):
    serializer_class = UserProfileSerializer
    def post(self, request, format=None):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            username = request.data.get('user.username')
            userpass = request.data.get('user.password')
            user = User.objects.create_user(username, userpass)
            user.is_active = False
            user.save()
            print(user)
            user_profile = UserProfile(user=user)
            user_profile.bio = request.data.get('bio')
            user_profile.marital_status = request.data.get('marital_status')
            user_profile.gender = request.data.get('gender')
            user_profile.location = request.data.get('location')
            user_profile.birthday = request.data.get('birthday')

            user_profile.save()

            print(user_profile)

            refresh = RefreshToken.for_user(user)
            access = AccessToken.for_user(user)

            return Response({
                'refresh': str(refresh),
                'access': str(access),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class ConfirmRegistrationView(APIView):
    def get(self, request, confirmation_code):
        try:
            token = AccessToken(confirmation_code)
            user = User.objects.get(id=token['user_id'])
            user.is_active = True
            user.save()
            return Response({'message': 'Account activated successfully.'}, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({'error': 'Invalid confirmation code.'}, status=status.HTTP_400_BAD_REQUEST)
