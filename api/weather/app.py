import os
import sys
import traceback

from flask import jsonify, request
from flask_cors import cross_origin
from timezonefinder import TimezoneFinder
from distutils.util import strtobool
from eve import Eve

from weather.resources import DOMAIN
from weather.models.weather import Weather
from weather.distance import calc_distance

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
    SETTINGS['MAPBOX_ACCESS_TOKEN'] = 'pk.eyJ1IjoibGljZW5zZTJlIiwiYSI6ImNqN250cW05dzFuZHEycXJyZmpleGlwMzUifQ.7KShHg4PfC1bM5qij9EzhA'

    app = Eve(settings=SETTINGS)

    app.on_pre_GET_weather = Weather.pre_weather_GET

    @app.route('/tz')
    @cross_origin()
    def get_tz():
        return jsonify(
            tz=tf.timezone_at(lng=float(request.args['lng']),
                              lat=float(request.args['lat'])))

    @app.route('/distance')
    @cross_origin()
    def get_distance():
        return jsonify(
            calc_distance(org_lng=float(request.args['org_lng']),
                            org_lat=float(request.args['org_lat']),
                            dest_lng=float(request.args['dest_lng']),
                            dest_lat=float(request.args['dest_lat'])))

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