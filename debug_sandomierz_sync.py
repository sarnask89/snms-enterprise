import os
import sys
import logging

# Konfiguracja logowania
logging.basicConfig(level=logging.ERROR)

sys.path.insert(0, os.getcwd())

from app import teryt_ws

def check_warszawa():
    client = teryt_ws._client()
    print("--- TEST ULIC DLA WARSZAWY (0918123) ---")
    
    try:
        # Warszawa: Woj=14, Pow=65, Gmi=01, Rodz=1, SIMC=0918123
        print("Pobieram ulice dla miejscowości Warszawa (SIMC: 0918123)...")
        ures = client.service.PobierzListeUlicDlaMiejscowosci(
            woj="14", pow="65", gmi="01", rodzaj="1", 
            msc="0918123", 
            czyWersjaUrzedowa=False, czyWersjaAdresowa=True
        )
        uitems = teryt_ws._ekstrakcja_listy(ures, "Ulica")
        print(f"  -> Znaleziono {len(uitems)} ulic.")
        if uitems:
            print(f"  Przykładowe: {[u.get('NAZWA') for u in uitems[:3]]}")

    except Exception as e:
        print(f" Błąd: {e}")

if __name__ == "__main__":
    check_warszawa()
