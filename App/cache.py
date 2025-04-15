
import hashlib
import json
import os
from datetime import datetime, timedelta

class SimpleCache:
    def __init__(self, cache_dir="./cache", ttl_hours=24):
        self.cache_dir = cache_dir
        self.ttl_hours = ttl_hours
        os.makedirs(cache_dir, exist_ok=True)
    
    def _get_cache_path(self, key):
        # Generate a cache filename from the key
        hashed_key = hashlib.md5(key.encode()).hexdigest()
        return os.path.join(self.cache_dir, f"{hashed_key}.json")
    
    def get(self, text):
        # Generate a key from the text
        key = text[:1000]  # Use first 1000 chars as cache key
        cache_path = self._get_cache_path(key)
        
        if not os.path.exists(cache_path):
            return None
        
        # Check if cache entry is still valid
        file_modified_time = datetime.fromtimestamp(os.path.getmtime(cache_path))
        if datetime.now() - file_modified_time > timedelta(hours=self.ttl_hours):
            os.remove(cache_path)  # Remove expired cache
            return None
        
        try:
            with open(cache_path, 'r') as f:
                return json.load(f)
        except Exception:
            return None
    
    def set(self, text, data):
        key = text[:1000]
        cache_path = self._get_cache_path(key)
        
        try:
            with open(cache_path, 'w') as f:
                json.dump(data, f)
            return True
        except Exception:
            return False

# Create a global cache instance
document_cache = SimpleCache()

def cache_summary(text, data=None):
    """
    If data is None, try to get from cache.
    If data is provided, save to cache.
    """
    if data is None:
        return document_cache.get(text)
    else:
        return document_cache.set(text, data)
