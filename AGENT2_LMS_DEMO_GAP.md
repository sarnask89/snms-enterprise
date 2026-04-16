# Instrukcje dla agenta 2 — zgodność `crm-portal` z [demo LMS 28-git](https://demo.lms.org.pl/)

**Odniesienie:** menu LMS w repozytorium — `lms-LMS_26/lib/menu.php` (hierarchia modułów; demo może mieć drobne różnice względem 26).  
**Stan kodu:** przegląd `crm-portal/` (FastAPI + Jinja2 + HTMX), porównanie z punktami menu demo / `menu.php`.

---

## 0. Krytyczne (już naprawione w repo — utrzymaj przy kolejnych zmianach)

- **`NameError: require_business_write`** — w routerach używano `Depends(require_business_write)` bez importu z `app.deps`. Import musi obejmować `require_business_write` (pliki: `customers`, `nodes`, `subscriptions`, `customer_groups`, `documents`, `finances`).
- **`ip_networks.py`:** brakowało `from sqlalchemy import func` przy `func.count` na liście sieci.

Po każdej większej zmianie uruchom:

`python -c "from app.main import app"`

---

## 1. Jak weryfikować względem demo

1. Wejdź na https://demo.lms.org.pl/ (tytuł: *Witaj w LMS 28-git*).
2. Zaloguj się (dane testowe z dokumentacji demo — jeśli nie działają, użyj aktualnych z opisu strony).
3. Dla **każdej gałęzi menu** zapisz: nazwa PL, podstrony (lista / nowy / szukaj / raporty itd.).
4. Odwzoruj w portalu albo **hierarchię menu** (sekcje + podmenu), albo minimum: **te same ścieżki funkcji** z linkami z poziomu listy/modułu.

**Różnica architektury:** LMS ma jedno wielkie menu zagnieżdżone; `crm-portal` ma **płaskie** pozycje w `app/nav_access.py` (`NAV_DEFINITION`). Aby zbliżyć się do demo, rozważ:

- rozszerzenie modelu menu o **parent_id** / grupę (np. „Klienci” → podlinki Lista, Nowy, Szukaj, Grupy, …), **albo**
- sekcje w `base.html` (nagłówki grup) generowane z konfiguracji.

---

## 2. Mapowanie: co jest vs czego brakuje (względem `menu.php` / demo)

### 2.1 Administracja (`admin` w LMS)

| LMS (demo / menu.php) | crm-portal |
|------------------------|------------|
| Info | Częściowo: `/admin/info` |
| Użytkownicy, Nowy użytkownik | Częściowo: `/admin/users`, formularze |
| Kopie zapasowe (Backups) | **Brak** |
| Copyrights | **Brak** (może być stopka + link zewnętrzny) |
| Grupy użytkowników, Nowa grupa | **Brak** — macierz ról jest uproszczona do `UserRole` enum (admin/manager/service/view), nie jak `usergrouplist` w LMS |

**Do zrobienia:** ekrany lub decyzja „poza MVP”; minimum: **eksport bazy / procedura backupu** opisana w `/admin/info` albo prosty endpoint tylko dla admina.

### 2.2 Klienci (`customers`)

| LMS | crm-portal |
|-----|------------|
| Lista, Nowy, **Szukaj** | Lista z `?q=` — OK jako odpowiednik search |
| Grupy | `/customer-groups` — OK |
| **Notices** (powiadomienia) | **Brak** |
| **Reports** (druk list) | **Brak** (CSV/PDF/widok do druku) |

**Do zrobienia:** moduł notices + prosty raport/druk listy klientów.

### 2.3 Węzły (`nodes`)

| LMS | crm-portal |
|-----|------------|
| Lista, Nowy, Szukaj | Lista — brak dedykowanej strony „szukaj” (można rozszerzyć listę o `?q=` jak u klientów) |
| Grupy węzłów | **Brak** modelu / UI |
| Sesje węzłów | **Brak** (wymaga źródeł danych — zaakceptować placeholder + komunikat) |
| Notices, Reports | **Brak** |

### 2.4 VoIP

| LMS | crm-portal |
|-----|------------|
| Cała sekcja VoIP | **Brak** (konta, billing, taryfy tel., reguły, cenniki, pule, szukaj) |

**Do zrobienia:** albo ukryć w menu z adnotacją „poza zakresem”, albo szkielet encji + puste listy zgodne z planem parity.

### 2.5 Net Devices (NMS)

| LMS | crm-portal |
|-----|------------|
| Lista, urządzenia, węzły na dev, modele, mapa, raporty | Jest `/net-devices` + CRUD — **plan pierwotny:** backend NMS poza zakresem; demo ma pełne menu |

**Do zrobienia:** uzgodnij z produktem: **oznaczyć jako „inwentaryzacja lekka”** vs „pełny NMS”; jeśli parity tylko CRM — przenieś w menu pod „konfiguracja” lub ukryj dla ról bez uprawnień.

### 2.6 Sieci IP (`networks`)

| LMS | crm-portal |
|-----|------------|
| Lista, Nowa, Szukaj | Lista + formularze — OK |
| **Network usage** (zajętość) | **Brak** widoku „netusage” (agregacja IP z węzłów/urządzeń lub z puli) |

**Do zrobienia:** strona wykorzystania puli (nawet uproszczona: statyczna analiza CIDR + przypisane węzły).

### 2.7 Finanse (`finances`)

| LMS | crm-portal |
|-----|------------|
| Lista subskrypcji (taryfy) + nowa | Taryfy `/finances/tariffs` — OK; w LMS „Subscriptions List” to szersze niż sama tabela `Tariff` |
| Płatności stałe (paymentlist) | **Brak** |
| Bilans / nowa operacja | **Brak** |
| Faktury, nowa | Częściowo — lista + formularz |
| Pro forma | **Brak** |
| Noty obciążeniowe | **Brak** |
| Kasa / paragon | **Brak** |
| Import / eksport | **Brak** |
| Raporty | **Brak** |
| Tagi taryf | **Brak** |

**Uwaga modelowa:** w portalu **„Subskrypcje”** (`/subscriptions`) odpowiadają przypisaniu klient–taryfa — to jest bliżej LMS **assignments** niż sama „lista taryf”. Rozważ **scalenie nazewnictwa** z demo (PL: „Abonamenty” / „Taryfy” jak w LMS).

### 2.8 Dokumenty (`documents`)

| LMS | crm-portal |
|-----|------------|
| Lista, Nowy | OK |
| **Dodawanie skanów** | **Brak** (plik/blob w DB lub dysk + ścieżka) |
| Generator masowy | **Brak** |
| Uprawnienia do typów | **Brak** |

### 2.9 Hosting

| LMS | crm-portal |
|-----|------------|
| Konta, aliasy, domeny, szukaj | **Brak** całej sekcji |

### 2.10 Wiadomości (`messages`)

| LMS | crm-portal |
|-----|------------|
| Lista wysłanych, Nowa, Szablony | **Brak** |

### 2.11 Reload

| LMS | crm-portal |
|-----|------------|
| Przeładowanie konfiguracji | **Brak** — ekwiwalent: np. „wyczyść cache szablonów / odśwież słowniki TERYT” jeśli wprowadzicie cache |

### 2.12 Statystyki (`stats`)

| LMS | crm-portal |
|-----|------------|
| Traffic, okna czasowe, compacting, raporty | **Brak** — wymaga źródeł; minimum: strona informacyjna + placeholder zgodny z demo (żeby menu nie znikało) |

### 2.13 Helpdesk (`helpdesk`)

| LMS | crm-portal |
|-----|------------|
| Kolejki (lista, nowa) | **Brak** — jest tylko pole `queue` (string) na zgłoszeniu |
| Kategorie | **Brak** |
| Szukaj | **Brak** dedykowanego widoku |
| Nowe zgłoszenie, raporty | Częściowo (nowe + lista); raporty **brak** |

**Do zrobienia:** tabele `RtQueue`, `RtCategory` (lub nazewnictwo CRM), CRUD + filtrowanie ticketów jak `rtsearch`.

### 2.14 Terminarz (`timetable`)

| LMS | crm-portal |
|-----|------------|
| Terminarz, harmonogram, zaległe, nowe, szukaj | **Brak** całej sekcji |

### 2.15 Uwierzytelnianie (`auth`)

| LMS | crm-portal |
|-----|------------|
| Zmiana hasła | **Sprawdź** — jeśli brak `/auth/change-password`, dodać |
| 2FA (ustawienia) | **Brak** |

### 2.16 Konfiguracja (`config`)

| LMS | crm-portal |
|-----|------------|
| UI settings, VAT, plany numeracji, stany, oddziały, hosty, daemon, import wpłat, promocje, wtyczki, projekty | **Prawie wszystko brak** — TERYT jest przez `/teryt/browse` + WS GUS, to **nie** zastępuje `statelist`/`divisionlist` z LMS |

**Do zrobienia:** priorytet biznesowy: **oddziały (divisions)**, **stawki VAT**, **plany numeracji** — bez tego faktury w PL są dalekie od demo.

### 2.17 Dokumentacja

| LMS | crm-portal |
|-----|------------|
| Link do doc | W demo jest link „Dokumentacja”; w portalu dodać w stopce / menu stały link (np. do lms.org.pl lub lokalny `/static/docs`) |

---

## 3. Pulpit vs demo

LMS **welcome** pokazuje bogatszy zestaw informacji systemowych i skrótów. Obecny pulpit (`dashboard.py`) liczy encje — **OK jako MVP**.

**Do dodania dla zbliżenia do demo:** skróty do najczęstszych akcji (Nowy klient, Nowa faktura, Nowe zgłoszenie), opcjonalnie „ostatnie zdarzenia” / audyt (gdy będzie log transakcji).

---

## 4. TERYT / adres (zgodność z formularzem klienta w demo)

Portal ma kaskadę województwo → … w oparciu o **lokalne tabele** `location_*` oraz przeglądarkę `/teryt/browse` i endpointy WS.

**Do dopięcia parity:**

- zsynchronizować lub importować dane TERYT do `location_states` / districts / cities / streets (nie tylko podgląd WS),
- rozważyć **SIMC/ULIC** identyfikatory jak w GUS (kolumny TERC w modelu),
- spójność nazw z demo (etykiety pól po PL jak w LMS).

---

## 5. Sugerowana kolejność poprawek (żeby zbliżyć się do demo)

1. **Stabilność:** test importu aplikacji + podstawowe ścieżki HTTP po logowaniu.  
2. **Menu:** grupowanie jak LMS lub mapa „moduł LMS → URL portalu” w jednej tabeli README.  
3. **Finanse:** pro forma, noty, płatności stałe lub jawne „w przygotowaniu” w UI.  
4. **Helpdesk:** kolejki i kategorie jako encje.  
5. **Konfiguracja:** VAT, oddziały, numery faktur.  
6. **Moduły całkowicie brakujące:** Hosting, Wiadomości, Terminarz, VoIP — albo implementacja minimalna, albo sekcja „Niedostępne w tej wersji” zgodna z komunikatem produktu.

---

## 6. Checklist przed kolejnym review

- [ ] `from app.main import app` bez wyjątku  
- [ ] Porównanie drzewka menu z zalogowanego demo z `NAV_DEFINITION` + ewentualnymi grupami  
- [ ] Lista braków z sekcji 2 zaktualizowana (data + commit)  
- [ ] Wpis w głównym `AGENT_LOGS.md` (repo `copilotpy`)

---

*Dokument roboczy dla agenta 2; demo LMS: https://demo.lms.org.pl/*
