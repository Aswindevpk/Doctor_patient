from django.urls import path
from .views import *

urlpatterns = [
    path('articles/',ListArticleView.as_view(),name='article_list'),
    path('article/<str:id>/',ArticleDetailView.as_view(),name='article_detail'),
    path('categories/',TopicView.as_view(),name='category_list'),
]