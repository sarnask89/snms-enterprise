import os
import logging
import json
try:
    from google import genai
    from google.genai import types
except ImportError:
    genai = None
    types = None

from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        # Inicjalizacja klienta z ustawień systemowych (GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_LOCATION)
        # Używamy trybu Vertex AI dla zgodności z korporacyjnymi standardami Agent Platform
        if genai:
            try:
                self.client = genai.Client(
                    vertexai=True, 
                    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
                    location=os.getenv("GOOGLE_CLOUD_LOCATION", "global")
                )
            except Exception as e:
                logger.error(f"Failed to initialize Gemini client: {e}")
                self.client = None
        else:
            self.client = None
        self.model_id = "gemini-3.1-flash-preview"

    async def smart_parse_comment(self, comment: str) -> Optional[Dict[str, Any]]:
        """
        Używa Gemini do inteligentnego wyciągnięcia danych klienta z nieustrukturyzowanego komentarza.
        """
        if not comment or len(comment.strip()) < 3:
            return None

        prompt = f"""
        Jesteś ekspertem systemów ISP CRM. Przeanalizuj poniższy komentarz techniczny z routera Mikrotik 
        i spróbuj wyodrębnić dane abonenta w formacie JSON.
        
        Komentarz: "{comment}"
        
        Wymagany format JSON (zwróć TYLKO czysty JSON):
        {{
            "last_name": "Nazwisko lub nazwa firmy",
            "street_name": "Nazwa ulicy",
            "street_number": "Numer domu",
            "apartment_number": "Numer mieszkania (opcjonalnie)",
            "rate_limit": "Prędkość (np. 100M/100M, opcjonalnie)",
            "confidence": 0.0 do 1.0
        }}
        
        Zasady:
        - Jeśli nie jesteś pewien, ustaw confidence poniżej 0.5.
        - Jeśli nie znaleziono nazwiska, ustaw null.
        - Pomiń prefiksy typu 'sklep', 'p.' itp., chyba że są częścią nazwy.
        """

        try:
            response = self.client.models.generate_content(
                model=self.model_id,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type='application/json'
                )
            )
            
            if response.text:
                data = json.loads(response.text)
                logger.info(f"Gemini pomyślnie sparsował komentarz: {comment} -> {data}")
                return data
        except Exception as e:
            logger.error(f"Błąd podczas wywołania Gemini: {e}")
        
        return None

    async def start_batch_job(self, dataset_uri: str, webhook_uri: str):
        """
        Przykładowa implementacja zadania wsadowego (Batch Job) z webhookiem, 
        zgodnie z przykładem dostarczonym przez użytkownika.
        """
        webhook_config = types.WebhookConfig(
            uri=webhook_uri,
            subscribed_events=["video.generated"] # lub inne eventy batchowe
        )
        
        # W prawdziwym systemie użylibyśmy tego do analizy tysięcy rekordów
        logger.info(f"Rozpoczęto konfigurację zadania wsadowego dla {dataset_uri} z webhookiem {webhook_uri}")
        
        # client.models.generate_content(..., config={"webhook_config": webhook_config})
        return "job_id_placeholder"

# Singleton
gemini = GeminiService()
