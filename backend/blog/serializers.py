from rest_framework import serializers
from .models import *


class ArticleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Blog
        fields = ['id','title','content','summary','author','image','category','is_published']



class ListArticleSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model=Blog
        fields=('id', 'title','category','image', 'content','summary','author','created_at')
    
    def get_author(self,obj):     
        return { "id":obj.author.id,"username":obj.author.username }
    
    
    
class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name','id']

