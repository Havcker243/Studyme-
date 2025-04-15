
import functools
import logging
from fastapi import HTTPException
import traceback

logger = logging.getLogger(__name__)

def handle_exceptions(status_code=500):
    """
    A decorator to handle exceptions in route handlers.
    Usage: @handle_exceptions()
    """
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            try:
                return await func(*args, **kwargs)
            except HTTPException:
                # Re-raise HTTP exceptions (they're handled properly)
                raise
            except Exception as e:
                # Log the full exception with traceback
                error_details = traceback.format_exc()
                logger.error(f"Error in {func.__name__}: {str(e)}\n{error_details}")
                
                # Return a user-friendly message
                raise HTTPException(
                    status_code=status_code, 
                    detail=f"An error occurred: {str(e)}"
                )
        return wrapper
    return decorator