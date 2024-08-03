from django.db import models
from accounts.models import CustomUser
from django.utils import timezone

class Category(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self) -> str:
        return self.name

class Blog(models.Model):
    author = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    title = models.CharField(max_length=250)
    image = models.ImageField(upload_to="media/blog_img")
    content = models.TextField()
    summary = models.TextField(default="")
    category = models.ForeignKey(Category,on_delete=models.CASCADE,related_name='articles',null=True,blank=True)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
