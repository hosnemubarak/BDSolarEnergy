import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger('common.exceptions')


def custom_exception_handler(exc, context):
    """
    Standardized DRF exception handler.
    - Preserves standard DRF responses (validation errors, 401, 403, 404, etc.).
    - Captures and logs unhandled internal server exceptions securely without leaking tracebacks.
    - Returns a structured JSON 500 payload to client.
    """
    response = exception_handler(exc, context)

    if response is not None:
        return response

    view = context.get('view')
    view_name = view.__class__.__name__ if view else 'UnknownView'
    request = context.get('request')
    path = request.path if request else 'UnknownPath'
    method = request.method if request else 'UNKNOWN'

    logger.exception(
        f"Unhandled server exception in {view_name} [{method} {path}]: {str(exc)}"
    )

    return Response(
        {
            "detail": "An internal server error occurred. Please contact customer support if this persists.",
            "error_type": "InternalServerError"
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )
