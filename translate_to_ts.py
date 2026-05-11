import os
import sys
import time
from pathlib import Path
import ollama

class TypeScriptTranslator:
    def __init__(self, model):
        self.model = model

    def read_file(self, file_path):
        encodings = ['utf-8', 'utf-16', 'latin-1', 'cp1250']
        for encoding in encodings:
            try:
                with open(file_path, 'r', encoding=encoding) as f:
                    return f.read()
            except (UnicodeDecodeError, UnicodeError):
                continue
        print(f"Error reading file {file_path}")
        return None

    def log_gpu_usage(self):
        try:
            import subprocess
            ps_cmd = (
                "$p = Get-Process ollama -ErrorAction SilentlyContinue | Select-Object -First 1; "
                "if ($p) { "
                "  $mem = ((Get-Counter \"\\GPU Process Memory(pid_$($p.id)*)\\Local Usage\").CounterSamples | where CookedValue).CookedValue; "
                "  $util = ((Get-Counter \"\\GPU Engine(pid_$($p.id)*engtype_Compute_0)\\Utilization Percentage\" -ErrorAction SilentlyContinue).CounterSamples | where CookedValue).CookedValue; "
                "  if ($mem) { Write-Output \"Ollama GPU VRAM: $([math]::Round($mem/1MB,2)) MB\" } "
                "  if ($util) { Write-Output \"Ollama GPU Engine: $([math]::Round($util,2)) %\" } "
                "} else { Write-Output \"Ollama process not found\" }"
            )
            res = subprocess.check_output(["powershell", "-Command", ps_cmd]).decode('utf-8').strip()
            print(f"--- GPU STATUS: {res} ---", flush=True)
        except Exception as e:
            print(f"--- GPU STATUS: Error querying counters: {e} ---", flush=True)

    def translate_file(self, file_path, dest_path):
        self.log_gpu_usage()
        code = self.read_file(file_path)
        if not code:
            return
            
        prompt = (
            "You are an expert Senior Full-Stack Engineer specializing in Python to TypeScript migrations.\n"
            "Your goal is to produce production-ready, highly readable, and idiomatic TypeScript code.\n\n"
            "Rules:\n"
            "1. Architecture: Target a Node.js environment using Express for routers and TypeORM-like patterns for models.\n"
            "2. Typing: Use strict TypeScript. Avoid 'any' at all costs. Define Interfaces or Types for all data structures.\n"
            "3. Naming: Convert snake_case to camelCase for variables, functions, and properties.\n"
            "4. Modules: Use ESM (import/export) syntax.\n"
            "5. Logic: Ensure the logic remains identical to the Python source, but adapted to TS idioms (e.g., async/await, proper error handling).\n"
            "6. Models: If the Python code uses SQLAlchemy/SQLModel, translate it to TypeORM class decorators or clean TypeScript classes with property types.\n"
            "7. Output: Return ONLY the TypeScript code. No markdown blocks, no explanations, no 'Here is your code'.\n\n"
            f"Python Code:\n{code}"
        )
        
        print(f"Translating {file_path} to TypeScript...", flush=True)
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                response = ollama.generate(
                    model=self.model,
                    prompt=prompt,
                    options={
                        "num_ctx": 4096, 
                        "num_predict": 2048, 
                        "num_gpu": 99,
                        "temperature": 0.1
                    }
                )
                
                ts_code = response.get("response", "").strip()
                
                if not ts_code:
                    print(f"Attempt {attempt+1}/{max_retries}: Empty response. Retrying...", flush=True)
                    time.sleep(3)
                    continue

                # Cleanup markdown
                if ts_code.startswith("```typescript"):
                    ts_code = ts_code.replace("```typescript\n", "", 1)
                if ts_code.startswith("```ts"):
                    ts_code = ts_code.replace("```ts\n", "", 1)
                if ts_code.endswith("```"):
                    ts_code = ts_code[:-3]
                    
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                with open(dest_path, 'w', encoding='utf-8') as f:
                    f.write(ts_code)
                print(f"Saved translated file to {dest_path}", flush=True)
                return 
                
            except Exception as e:
                print(f"Attempt {attempt+1}/{max_retries} failed for {file_path}: {e}", flush=True)
                time.sleep(5)
                
        print(f"All {max_retries} attempts failed for {file_path}. Writing failure marker.", flush=True)
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        with open(dest_path, 'w', encoding='utf-8') as f:
            f.write("// FAILED TO TRANSLATE\n")

import argparse

def main():
    parser = argparse.ArgumentParser(description="Translate Python files to TypeScript using Ollama.")
    parser.add_argument("--src", default="app", help="Source directory (relative to project root)")
    parser.add_argument("--dest", default="crm-portal-ts/src", help="Destination directory (relative to project root)")
    parser.add_argument("--model", default="deepseek-coder:1.3b", help="Ollama model to use")
    args = parser.parse_args()

    source_dir = Path(args.src)
    target_dir = Path(args.dest)
    
    if not source_dir.exists():
        print(f"Source directory {source_dir} not found.")
        sys.exit(1)
        
    print(f"Starting translation of {source_dir} to TypeScript in {target_dir}...", flush=True)
    
    translator = TypeScriptTranslator(model=args.model)
    
    for root, dirs, files in os.walk(source_dir):
        if "__pycache__" in root or "generated" in root:
            continue
            
        for file in files:
            if file.endswith(".py") and not file.startswith("__"):
                source_path = os.path.join(root, file)
                rel_path = os.path.relpath(source_path, source_dir)
                dest_file_name = file.replace(".py", ".ts")
                dest_path = os.path.join(target_dir, os.path.dirname(rel_path), dest_file_name)
                
                # Check for existing translation
                if os.path.exists(dest_path) and os.path.getsize(dest_path) > 100:
                   print(f"Skipping {source_path} - already translated.", flush=True)
                   continue

                translator.translate_file(source_path, dest_path)
                print("Cooling down GPU for 5 seconds...", flush=True)
                time.sleep(5)

if __name__ == "__main__":
    main()
