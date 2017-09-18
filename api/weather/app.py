import os
import sys
import traceback

from flask import jsonify, request
from timezonefinder import TimezoneFinder
from distutils.util import strtobool
from eve import Eve

from weather.resources import DOMAIN
from weather.models.weather import Weather

tf = TimezoneFinder()


def app_init():
    """ Initialize the app """

    # configure the settings
    SETTINGS = {}
    SETTINGS['MONGO_URI'] = os.environ.get('MONGO_URI')
    SETTINGS['PORT'] = int(os.environ.get('PORT'))
    SETTINGS['DOMAIN'] = DOMAIN
    SETTINGS['API_TOKEN'] = os.environ.get('API_TOKEN', '')
    SETTINGS['DEBUG'] = strtobool(os.environ.get('DEBUG', 'false'))
    SETTINGS['X_DOMAINS'] = '*'
    SETTINGS['X_HEADERS'] = ['Authorization', 'Content-type']

    app = Eve(settings=SETTINGS)

    app.on_pre_GET_weather = Weather.pre_weather_GET

    @app.route('/tz')
    def get_tz():
        return jsonify(tz=tf.timezone_at(lng=float(request.args['lng']), lat=float(request.args['lat'])))

    return app


def main_http():
    """ Launch the main server """
    try:
        print('Initializing app...')
        app = app_init()
    except KeyboardInterrupt:
        print('User issued a keyboard interrupt. Shutting down...')
        return
    except Exception:
        traceback.print_exc(file=sys.stdout)
        raise

    print('Starting weather app...')
    app.run(
        host=app.config.get('HOST', '0.0.0.0'),
        port=app.config.get('PORT', 8000),
        debug=app.config.get('DEBUG', False),
        use_reloader=True
    )

if __name__ == '__main__':
    main_http()