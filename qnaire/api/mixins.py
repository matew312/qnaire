from rest_framework import permissions, response, status
from django.db.models import F


class UserQuerySetMixin():
    # these can be overriden by the subclass
    permission_classes = [permissions.IsAuthenticated]
    user_field = 'creator'

    def get_queryset(self, *args, **kwargs):
        lookup_data = {}
        lookup_data[self.user_field] = self.request.user
        queryset = super().get_queryset(*args, **kwargs)
        return queryset.filter(**lookup_data)


class MultiSerializerViewSetMixin(object):
    def get_serializer_class(self):
        """
        Look for serializer class in self.serializer_action_classes, which
        should be a dict mapping action name (key) to serializer class (value),
        i.e.:

        class MyViewSet(MultiSerializerViewSetMixin, ViewSet):
            serializer_class = MyDefaultSerializer
            serializer_action_classes = {
               'list': MyListSerializer,
               'my_action': MyActionSerializer,
            }

            @action
            def my_action:
                ...

        If there's no entry for that action then just fallback to the regular
        get_serializer_class lookup: self.serializer_class, DefaultSerializer.

        """
        try:
            return self.serializer_action_classes[self.action]
        except (KeyError, AttributeError):
            return super(MultiSerializerViewSetMixin, self).get_serializer_class()


class OrderedViewSetMixin():
    order_scope_field = None

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        filters = {}
        if self.order_scope_field:
            filters[self.order_scope_field] = serializer.validated_data[self.order_scope_field]
        queryset = self.queryset
        filtered_queryset = queryset.filter(
            order_num__gte=serializer.validated_data['order_num'], **filters)
        filtered_queryset.update(order_num=F('order_num') + 1)
        obj = serializer.save()

        return response.Response({
            **serializer.data,
            # other data that changed
            'changed_data': self.list_serializer_class(filtered_queryset, many=True).data
        }, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        obj = self.get_object()
        order_num = obj.order_num
        # accessing the queryset directly so that other filters (e.g. of UserQuerySetMixin) are not unnecessarily applied
        queryset = self.queryset
        filters = {}
        if self.order_scope_field:
            filters[self.order_scope_field] = getattr(
                obj, self.order_scope_field)
        queryset.filter(order_num__gt=order_num, **
                        filters).update(order_num=F('order_num') - 1)
        obj.delete()
        changed_objs = queryset.filter(order_num__gte=order_num, **filters)
        return response.Response(data={
            'changed_data': self.list_serializer_class(changed_objs, many=True).data
        }, status=status.HTTP_200_OK)
