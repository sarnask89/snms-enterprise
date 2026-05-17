import requests
import json
import argparse
import os
import sys
import io

# Wymuszenie UTF-8 w terminalu Windows
if sys.platform == "win32":
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')
class OllamaReviewer:
    def __init__(self, model):
        self.url = "http://localhost:11434/api/generate"
        self.model = model

    def read_file(self, file_path):
        # Lista kodowań do sprawdzenia
        encodings = ['utf-8', 'utf-16', 'latin-1', 'cp1250']
        for encoding in encodings:
            try:
                with open(file_path, 'r', encoding=encoding) as f:
                    return f.read()
            except (UnicodeDecodeError, UnicodeError):
                continue
        
        print(f"Błąd: Nie udało się odczytać pliku {file_path}. Spróbuj zapisać go jako UTF-8.")
        sys.exit(1)

    def call_ollama(self, prompt, stream=False):
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": stream,
            "options": {"num_ctx": 4096, "num_predict": 2048, "num_gpu": 20, "low_vram": True, "temperature": 0.1}
        }
        return requests.post(self.url, json=payload, stream=stream)

    def run_action(self, action, file_path):
        code = self.read_file(file_path)
        base_name = os.path.basename(file_path)

        if action == "comments":
            prompt = f"Zwróć kod 1:1, ale dopisz komentarz wyjaśniający do KAŻDEJ linii po polsku: ODPOWIADAJ W JĘZYKU POLSKIM UŻYWAJĄC POLSKICH ZNAKÓW (UTF-8).\n\n{code}"
            print(f"Generowanie komentowanego kodu dla {base_name}...")
            res = self.call_ollama(prompt, stream=False).json()
            out = f"commented_{base_name}"
            with open(out, 'w', encoding='utf-8') as f: f.write(res.get("response", ""))
            print(f"Gotowe! Zapisano w: {out}")

        elif action == "docs":
            prompt = f"Stwórz dokumentację techniczną Markdown dla tego kodu po polsku:  ODPOWIADAJ W JĘZYKU POLSKIM UŻYWAJĄC POLSKICH ZNAKÓW (UTF-8).\n\n{code}"
            print(f"Generowanie dokumentacji dla {base_name}...")
            res = self.call_ollama(prompt, stream=False).json()
            out = f"docs_{os.path.splitext(base_name)[0]}.md"
            with open(out, 'w', encoding='utf-8') as f: f.write(res.get("response", ""))
            print(f"Gotowe! Zapisano w: {out}")

        elif action == "stream":
            prompt = f"Przeanalizuj ten kod pod kątem błędów i optymalizacji:\n\n{code}"
            print(f"--- Stream Review dla {base_name} ---\n")
            res = self.call_ollama(prompt, stream=True)
            for line in res.iter_lines():
                if line:
                    chunk = json.loads(line.decode('utf-8'))
                    print(chunk.get("response", ""), end="", flush=True)
            print("\n\n--- Koniec ---")

        elif action == "brief":
            prompt = f"Przeanalizuj ten kod wygeneruj podsumowanie użytych funkcji i zależności ,streść co robi po polsku: ODPOWIADAJ W JĘZYKU POLSKIM UŻYWAJĄC POLSKICH ZNAKÓW (UTF-8)\n\n{code}"
            print(f"--- Streszczenie dla {base_name} ---\n")
            res = self.call_ollama(prompt, stream=False).json()
            out = f"brief_{os.path.splitext(base_name)[0]}.md"
            with open(out, 'w', encoding='utf-8') as f: f.write(res.get("response", ""))
            print(f"Gotowe! Zapisano w: {out}")


def main():
    parser = argparse.ArgumentParser(description="Ollama Code Tool - CLI do analizy kodu")
    parser.add_argument("file", help="Ścieżka do pliku z kodem")
    parser.add_argument("mode", choices=["comments", "docs", "stream", "brief"], help="Tryb: comments (kod z komentarzami), docs (dokumentacja), stream (analiza na żywo), brief (streszczenie funkcjonalności i zależności)")
    parser.add_argument("--model", default="qwen2.5-coder:1.5b", help="Nazwa modelu Ollama (domyślnie: qwen2.5-coder:1.5b)")

    args = parser.parse_args()
    
    reviewer = OllamaReviewer(args.model)
    reviewer.run_action(args.mode, args.file)

if __name__ == "__main__":
    main()