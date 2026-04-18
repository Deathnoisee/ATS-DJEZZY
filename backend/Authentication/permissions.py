from rest_framework.permissions import BasePermission

class IsRHUser(BasePermission):
    message = "Only HR users can access this view."
    def has_permission(self, request, view):
        if not request.user :
            return False
        return request.user.isRH
    
class IsOwnerOrHR(BasePermission):
    def has_object_permission(self, request, obj):
        if request.user.is_authenticated and request.user.isRH:
            return True
        return obj.user == request.user