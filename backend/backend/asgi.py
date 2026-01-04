import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.conf import settings
from starlette.routing import Mount
from starlette.staticfiles import StaticFiles
import core.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django_asgi_app = get_asgi_application()

# Serve static files via WhiteNoise (already done in settings)
# Serve media files via ASGI
application = ProtocolTypeRouter({
    "http": URLRouter([
        Mount("/media", app=StaticFiles(directory=settings.MEDIA_ROOT), name="media"),
        Mount("/", app=django_asgi_app),  # Django app handles all other routes
    ]),
    "websocket": AuthMiddlewareStack(
        URLRouter(core.routing.websocket_urlpatterns)
    ),
})
