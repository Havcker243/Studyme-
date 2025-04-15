
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import time
from collections import defaultdict
from fastapi.responses import JSONResponse

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 10, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.request_counts = defaultdict(list)
        
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        current_time = time.time()
        
        # Clean old requests outside the time window
        self.request_counts[client_ip] = [
            timestamp for timestamp in self.request_counts[client_ip] 
            if current_time - timestamp < self.window_seconds
        ]
        
        # Check if rate limit exceeded
        if len(self.request_counts[client_ip]) >= self.max_requests:
            return JSONResponse(
                content={"error": "Rate limit exceeded. Please try again later."},
                status_code=429
            )
        
        # Add current request timestamp
        self.request_counts[client_ip].append(current_time)
        
        # Process the request
        return await call_next(request)
