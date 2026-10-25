from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` or `user` attribute.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        owner = getattr(obj, 'user', None) or getattr(obj, 'owner', None)
        return owner == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allow read-only requests for any user, but require admin/staff for writes.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or getattr(request.user, 'role', '') in ['admin', 'staff']))
