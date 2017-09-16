import os
import sys
import traceback

from eve import Eve

from weather.resources import DOMAIN
from weather.models.weather import Weather


def app_init():
    """ Initialize the app """

    # configure the settings
    SETTINGS = {}
    SETTINGS['MONGO_URI'] = os.environ.get('MONGO_URI')
    SETTINGS['PORT'] = int(os.environ.get('PORT'))
    SETTINGS['DOMAIN'] = DOMAIN

    app = Eve(settings=SETTINGS)

    app.on_pre_GET_weather = Weather.pre_weather_GET

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

    print('Starting app...')
    app.run(
        host=app.config.get('HOST', '0.0.0.0'),
        port=app.config.get('PORT', 8000),
        debug=app.config.get('DEBUG', False),
        use_reloader=True
    )

if __name__ == '__main__':
    main_http()