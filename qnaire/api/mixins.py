from rest_framework import permissions, response, status
from django.db.models import F


class UserQuerySetMixin():
    # this can be overriden by the subclass
    user_field = 'creator'

    def get_queryset(self, *args, **kwargs):
        if self.request.user.is_authenticated:
            lookup_data = {}
            lookup_data[self.user_field] = self.request.user
            queryset = super().get_queryset(*args, **kwargs)
            return queryset.filter(**lookup_data)
        else:
            return super().get_queryset(*args, **kwargs)


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

    def do_create(self, serializer):
        filters = {}
        if self.order_scope_field:
            filters[self.order_scope_field] = serializer.validated_data[self.order_scope_field]
        queryset = self.get_queryset()
        filtered_queryset = queryset.filter(
            order_num__gte=serializer.validated_data['order_num'], **filters)
        filtered_queryset.update(order_num=F('order_num') + 1)
        obj = serializer.save()

        response_data = serializer.data  # {**serializer.data}
        changed_objs = filtered_queryset.exclude(pk=obj.id)
        if changed_objs:  # querysets retrieve the results when used in boolean evaluation
            print(self.list_serializer_class(
                changed_objs, many=True).data)
            response_data['changed_data'] = self.list_serializer_class(
                changed_objs, many=True).data

        return response.Response(response_data, status=status.HTTP_200_OK)

    def do_destroy(self, obj):
        order_num = obj.order_num
        queryset = self.get_queryset()
        filters = {}
        if self.order_scope_field:
            filters[self.order_scope_field] = getattr(
                obj, self.order_scope_field)
        queryset.filter(order_num__gt=order_num, **
                        filters).update(order_num=F('order_num') - 1)
        # obj.delete()
        self.perform_destroy(obj)
        changed_objs = queryset.filter(order_num__gte=order_num, **filters)
        if changed_objs:
            return response.Response(data={
                'changed_data': self.list_serializer_class(changed_objs, many=True).data
            }, status=status.HTTP_200_OK)
        else:
            return response.Response(status=status.HTTP_204_NO_CONTENT)


# class PublishedQnaireQuerySetMixin():
#     allow_update = False
#     qnaire_field = None

#     def get_queryset(self, *args, **kwargs):
#         method = self.request.method
#         queryset = super().get_queryset(*args, **kwargs)
#         if method in ['POST', 'DELETE'] or (not self.allow_update and method in ['PUT', 'PATCH']):
#             queryset = queryset.filter(**{qnaire_field: })
#         return queryset
