from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from accounts.models import *
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated



class ListArticleView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self,request):
        author = request.user
        category = request.GET.get('category')
        blog_type = request.GET.get('blog_type')

        if category or blog_type:
            if blog_type == 'Published':
                articles = Blog.objects.filter(is_published=True,author=author)
            if blog_type == 'Draft':
                articles = Blog.objects.filter(is_published=False,author=author)
            if category:
                articles = Blog.objects.filter(category__name=category,is_published=True).distinct()
        else:
            articles = Blog.objects.filter(is_published=True)

        serializer = ListArticleSerializer(articles,many=True)
        return Response({
                    "status":True,
                    "data":serializer.data
                    },status.HTTP_200_OK)
    
    def post(self, request):
        try:
            request.data["author"]=request.user.id
            serializer = ArticleSerializer(data=request.data)
            print(serializer.error_messages)
            if serializer.is_valid():
                article = serializer.save()
                return Response({'id': article.id, 'message': 'Blog created successfully!'}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ArticleDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request,id=None):
        try:
            article = Blog.objects.get(id=id)
            serializer = ListArticleSerializer(article)
            return Response({
                    "status":True,
                    "data":serializer.data},status.HTTP_200_OK)
                
        except Blog.DoesNotExist:
            return Response({'error': 'No article found !'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def patch(self,request,id=None):
        try:
            print(request.data)
            author = request.user.id
            article=Blog.objects.get(id=id,author__id=author)
            print(article,author)
            serializer = ArticleSerializer(article, data=request.data, partial=True)
            if serializer.is_valid():
                updated_article = serializer.save()
                return Response({'id': updated_article.id, 'message': 'Blog updated successfully!'}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        except Blog.DoesNotExist:
            return Response({'error': 'You have no article with given id !'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def delete(self,request,id=None):
        try:
            user_id = request.user.id
            article = Blog.objects.get(id=id,author=user_id)
            article.delete()
            return Response({'message': 'Blog deleted successfully!'}, status=status.HTTP_200_OK)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
class TopicView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get(self,request):
        try:
            if request.GET.get("limit"):
                limit = int(request.GET.get('limit'))
                topics = Category.objects.order_by("?")[:limit]
            else:
                topics = Category.objects.all()
            serializer = TopicSerializer(topics, many=True)
            return Response({
                "status":True,
                "data":serializer.data
            },status.HTTP_200_OK)
        
        except Category.DoesNotExist:
            return Response({'error': 'No topics found !'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    