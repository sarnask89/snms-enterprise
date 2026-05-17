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
            # Silently fail or log minimal error for GPU monitoring to not block translation
            pass

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
                # We remove explicit options to let Ollama use the Modelfile settings (context size, etc.)
                response = ollama.generate(
                    model=self.model,
                    prompt=prompt
                )
                
                ts_code = response.get("response", "").strip()
                
                if not ts_code:
                    print(f"Attempt {attempt+1}/{max_retries}: Empty response. Retrying...", flush=True)
                    time.sleep(3)
                    continue

                # Cleanup markdown blocks if the model still includes them
                if "```typescript" in ts_code:
                    ts_code = ts_code.split("```typescript")[1].split("```")[0].strip()
                elif "```ts" in ts_code:
                    ts_code = ts_code.split("```ts")[1].split("```")[0].strip()
                elif "```" in ts_code:
                    ts_code = ts_code.split("```")[1].strip()
                    
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
    parser.add_argument("--model", default="deepseek-safe", help="Ollama model to use")
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
                
                # Check for existing translation and skip if valid
                if os.path.exists(dest_path):
                    with open(dest_path, 'r', encoding='utf-8') as f:
                        content = f.read().strip()
                        if content and content != "// TRANSLATION FAILED":
                            print(f"Skipping {source_path} - already translated.", flush=True)
                            continue

                translator.translate_file(source_path, dest_path)
                # Reduced sleep time for better performance since VRAM is optimized
                time.sleep(2)

if __name__ == "__main__":
    main()
