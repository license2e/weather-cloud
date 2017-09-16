import arrow
import json
import datetime
import requests

from flask import current_app #, abort, request, Response

# from weather.constants import JSON_MEDIA_TYPE
from weather.models.base import ResourceBase

class Weather(ResourceBase):
    """
    A weather entry.
    """

    COLLECTION = 'weather'
    WEATHER_API = "https://api.darksky.net/forecast/{}/{},{}?exclude={}"
    EXCLUDE = 'hourly,minutely,currently,flags,alerts'

    resource = {
        'schema': {
            'coordinates': {
                'type': 'string'
            },
            'time': {
                'type': 'integer'
            },
            'result': {
                'type': 'object'
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
    def pre_weather_GET(self, request, lookup):
        """
        This hook runs before the weather GET to fire off the request to the Weather API
        """
        API_TOKEN = current_app.config['API_TOKEN']

        # print("{} {}".format(request.args.get('where'), lookup))
        where_param = request.args.get('where')
        if where_param != '' and where_param is not None:
            where = json.loads(where_param)

            mongo_db = current_app.data.driver.db
            weather_item = mongo_db[self.COLLECTION].find_one({
                'coordinates': where['coordinates']})

            if weather_item is None:
                request_time = str(datetime.datetime.now().isoformat()).split('.')[0]
                api_url = self.WEATHER_API.format(API_TOKEN, where['coordinates'],
                                                  request_time, self.EXCLUDE)
                r = requests.get(api_url)
                res = r.json()

                now = arrow.utcnow()
                new_weather_item = {
                    'coordinates': where['coordinates'],
                    'time': res.get('daily').get('data')[0]['time'],
                    'result': res,
                    '_created': now.datetime,
                    '_updated': now.datetime
                }
                mongo_db[self.COLLECTION].insert(new_weather_item)
