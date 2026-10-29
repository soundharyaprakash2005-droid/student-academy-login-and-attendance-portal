from typing import Any, Optional


def success_response(
    message: str,
    data: Optional[Any] = None
):
    return {
        "success": True,
        "message": message,
        "data": data
    }


def error_response(
    message: str,
    error: Optional[Any] = None
):
    return {
        "success": False,
        "message": message,
        "error": error
    }


def validation_error_response(
    errors: Any
):
    return {
        "success": False,
        "message": "Validation Error",
        "errors": errors
    }


def not_found_response(
    message: str = "Data not found"
):
    return {
        "success": False,
        "message": message
    }