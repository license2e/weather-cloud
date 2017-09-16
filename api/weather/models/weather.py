import json

from flask import current_app #, abort, request, Response

# from weather.constants import JSON_MEDIA_TYPE
from weather.models.base import ResourceBase

class Weather(ResourceBase):
    """
    A weather entry.
    """

    COLLECTION = 'weather'

    resource = {
        'schema': {
            'coordinates': {
                'type': 'string'
            },
            'time': {
                'type': 'integer'
            }
        },
        'item_methods': ['GET'],
        'mongo_indexes': {
            'coordinates': [('coordinates', 1)],
            'time': [('time', -1)],
            'coordinate_time': [('coordinates', 1), ('time', -1)]
        }
    }

    @classmethod
    def pre_weather_GET(cls, request, lookup):
        """
        This hook runs before the weather GET to fire off the request to the Weather API
        """

        # print("{} {}".format(request.args.get('where'), lookup))
        where = request.args.get('where')
        