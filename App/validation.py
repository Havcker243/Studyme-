
from pydantic import BaseModel, Field, field_validator
from typing import Optional

class TextPayload(BaseModel):
    text: str = Field(..., min_length=10, max_length=100000)
    
    @field_validator('text')
    def text_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError('Text cannot be empty or just whitespace')
        return v

class SummaryModePayload(TextPayload):
    mode: Optional[str] = Field(default="standard", pattern="^(brief|standard|detailed)$")
