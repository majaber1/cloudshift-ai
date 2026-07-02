import httpx
import os
import json

class OllamaService:
    def __init__(self):
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://ollama:11434")
        self.model = os.getenv("OLLAMA_MODEL", "qwen2.5:7b-instruct")
        self.timeout = 300.0

    async def generate(self, prompt: str, system: str = None) -> str:
        messages = []
        if system:
            messages.append({"role": "system", "content": system})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": self.model,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": 0.3,
                "num_predict": 4096
            }
        }

        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.post(
                    f"{self.base_url}/api/chat",
                    json=payload
                )
                response.raise_for_status()
                result = response.json()
                return result.get("message", {}).get("content", "No response generated")
        except httpx.TimeoutException:
            return "Error: Ollama request timed out. The model may be loading or the document is too large."
        except httpx.ConnectError:
            return f"Error: Cannot connect to Ollama at {self.base_url}. Make sure Ollama is running and the model is pulled."
        except Exception as e:
            return f"Error generating response: {str(e)}"

    async def check_health(self) -> dict:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                if response.status_code == 200:
                    models = response.json().get("models", [])
                    model_names = [m.get("name", "") for m in models]
                    return {
                        "status": "healthy",
                        "available_models": model_names,
                        "current_model": self.model,
                        "model_ready": any(self.model in m for m in model_names)
                    }
        except Exception as e:
            return {"status": "unhealthy", "error": str(e), "current_model": self.model}
