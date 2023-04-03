from django.contrib import admin

from .models import Button

@admin.register(Button)
class ButtonAdmin(admin.ModelAdmin):
    list_display = ('ethereum_address', 'created', 'updated')
    list_filter = ('ethereum_address', 'created', 'updated')
    search_fields = ('ethereum_address', 'created', 'updated')