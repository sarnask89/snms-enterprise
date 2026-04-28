W systemie PIT (Punkt Informacyjny ds. Telekomunikacji) prowadzonym przez UKE, wymagania dotyczące współrzędnych są specyficzne i różnią się od standardowego "GPS-a" z Google Maps.Aby dane zostały poprawnie przyjęte w procesie paszportyzacji sieci (np. przy raportowaniu zasobów i infrastruktury), musisz zwrócić uwagę na dwa aspekty:1. Układ współrzędnych: PUWG 1992 (EPSG: 2180)Większość systemów administracji publicznej w Polsce, w tym PIT UKE, wymaga współrzędnych w układzie PUWG 1992. Standardowy GPS (WGS84) operuje na stopniach (np. 52.23), natomiast układ 1992 operuje na metrach (np. 484320, 630210).Zmiana w skrypcie:W zapytaniu do API ULDK musisz zmienić parametr srid z 4326 na 2180.2. Zmodyfikowany kod Python pod PIT UKEOto zaktualizowana funkcja, która pobierze dane dokładnie w formacie metrycznym (X, Y) wymaganym przez systemy geodezyjne i telekomunikacyjne:

#>>>code sample start



python import requests



def get\_coordinates\_for\_pit\_uke(simc, ulic, numer):

&#x20;   """

&#x20;   Pobiera współrzędne w układzie PUWG 1992 (EPSG:2180) pod system PIT UKE.

&#x20;   """

&#x20;   address\_id = f"{simc}\_{ulic}\_{numer}"

&#x20;   url = "https://gugik.gov.pl"

&#x20;   

&#x20;   # KLUCZOWA ZMIANA: srid=2180 (układ 1992 w metrach)

&#x20;   params = {

&#x20;       "request": "GetAddress",

&#x20;       "id": address\_id,

&#x20;       "srid": 2180

&#x20;   }

&#x20;   

&#x20;   try:

&#x20;       response = requests.get(url, params=params, timeout=10)

&#x20;       if response.status\_code == 200:

&#x20;           lines = response.text.splitlines()

&#x20;           if lines\[0] == '0' and len(lines) > 1:

&#x20;               # Wynik: identyfikator|X|Y

&#x20;               data = lines\[1].split('|')

&#x20;               # W układzie 2180:

&#x20;               # X (północne/N) to zwykle ok. 400000-800000

&#x20;               # Y (wschodnie/E) to zwykle ok. 100000-900000

&#x20;               return {

&#x20;                   "X\_1992": data\[1],

&#x20;                   "Y\_1992": data\[2],

&#x20;                   "EPSG": "2180"

&#x20;               }

&#x20;   except Exception:

&#x20;       return None





\#code sample end>>>>



\# Przykład dla Warszawy (Emilii Plater 53)

print(get\_coordinates\_for\_pit\_uke("0918123", "04711", "53"))

Używaj kodu z rozwagą.Na co uważać przy paszportyzacji w PIT?Kolejność współrzędnych: Systemy GIS często zamieniają X z Y. W układzie 2180 (PUWG 1992), X to współrzędna "pionowa" (północ), a Y "pozioma" (wschód). Sprawdź w specyfikacji swojego pliku do importu (np. GML lub CSV), czy UKE oczekuje kolejności X,Y czy Y,X.Dokładność: API ULDK zwraca środek budynku lub punkt adresowy z rejestru PRG, co jest w 100% akceptowalne w inwentaryzacji UKE.Identyfikator TERYT: W raportach PIT często musisz podać pełny, 14-znakowy kod TERYT punktu adresowego. ULDK w odpowiedzi zazwyczaj zwraca pełny ciąg, który możesz wykorzystać do wypełnienia kolumny z identyfikatorem obiektu.

