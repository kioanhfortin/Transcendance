# from django.contrib import admin

from django.contrib import admin
from .models import UserStatistics, User
# from .models import User, UserStatistics

# Register your models here.
class UserStatisticsInline(admin.StackedInline):
    model = UserStatistics
    can_delete = False

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'isOnline', 'isIngame')
    search_fields = ('username',)
    inlines = (UserStatisticsInline,)

admin.site.register(User, UserAdmin)