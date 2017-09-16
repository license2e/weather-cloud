from flask import abort

from weather.constants import (JSON_MEDIA_TYPE)

class ResourceBase(object):
    """
    The base resource model
    """

    COLLECTION = None

    @classmethod
    def on_pre_GET(cls, resource_name, request, lookup):
        if JSON_MEDIA_TYPE not in request.headers.get('Content-Type', '').lower():
            abort(415, 'Content-Type must be application/json')