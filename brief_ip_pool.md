### Podsumowanie funkcji i zależności

#### _norm_ipv4(raw: str | None) -> str | None:
- **Funkcja**: Normalizuje adres IP z podanych danych.
- **Parametry**:
  - `raw`: Wartość do normalizacji (str lub None).
- **Zwracanie**:
  - Zwraca normalizowany adres IP jako string, jeśli jest poprawny; w przeciwnym razie None.

#### collect_used_ipv4_in_network(db: Session, net: models.IpNetwork, *, exclude_node_id: int | None = None) -> set[str]:
- **Funkcja**: Zwraca listę adresów IP, które są zajęte w określonej sieci.
- **Parametry**:
  - `db`: Sesja bazy danych SQLAlchemy.
  - `net`: Obiekt modelu IpNetwork.
  - `exclude_node_id`: ID komputera do wykluczenia (opcjonalny).
- **Zwracanie**:
  - Zwraca set z adresami IP, które są zajęte w sieci.

#### free_ipv4_suggestions(db: Session, network_id: int, *, exclude_node_id: int | None = None, limit: int = _MAX_SUGGESTIONS) -> list[str]:
- **Funkcja**: Zwraca listę wolnych adresów IP, ograniczona do podanej liczby.
- **Parametry**:
  - `db`: Sesja bazy danych SQLAlchemy.
  - `network_id`: ID sieci.
  - `exclude_node_id`: ID komputera do wykluczenia (opcjonalny).
  - `limit`: Limit adresów IP (domyślnie 512).
- **Zwracanie**:
  - Zwraca listę wolnych adresów IP.

#### validate_node_ip_assignment(db: Session, ip_network_id: int | None, ip_str: str | None, *, exclude_node_id: int | None = None) -> tuple[bool, str | None]:
- **Funkcja**: Valida czy podany adres IP może być przypisany do określonej sieci.
- **Parametry**:
  - `db`: Sesja bazy danych SQLAlchemy.
  - `ip_network_id`: ID sieci.
  - `ip_str`: Wartość do validacji (str lub None).
  - `exclude_node_id`: ID komputera do wykluczenia (opcjonalny).
- **Zwracanie**:
  - Zwraca tuple z dwoma elementami:
    - `bool`: Czy validacja się powiodła.
    - `str | None`: Błąd, jeśli niepowiodła.

### Streszczenie

1. **_norm_ipv4(raw: str | None) -> str | None**: Normalizuje adres IP z podanych danych.
2. **collect_used_ipv4_in_network(db: Session, net: models.IpNetwork, *, exclude_node_id: int | None = None) -> set[str]**: Zwraca listę adresów IP, które są zajęte w określonej sieci.
3. **free_ipv4_suggestions(db: Session, network_id: int, *, exclude_node_id: int | None = None, limit: int = _MAX_SUGGESTIONS) -> list[str]**: Zwraca listę wolnych adresów IP, ograniczona do podanej liczby.
4. **validate_node_ip_assignment(db: Session, ip_network_id: int | None, ip_str: str | None, *, exclude_node_id: int | None = None) -> tuple[bool, str | None]**: Valida czy podany adres IP może być przypisany do określonej sieci.