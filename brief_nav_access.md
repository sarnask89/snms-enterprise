### Podsumowanie

Ten kod definiuje funkcje i klasy w celu zarządzania menu nawigacyjnym w aplikacji. Wszystkie operacje są realizowane za pomocą SQLAlchemy, która umożliwia komunikację z bazą danych.

#### Funkcje:

1. **_default_matrix**: Tworzy domyślne uprawnienia dla ról. Domyślnie, użytkownicy mają dostęp do "dashboard" i "auth_password". Administratorzy mają dostęp do wszystkich pozycji menu, a manageri - tylko do pozycji, które są wykrywane w kodzie.

2. **visible_nav_items**: Zwraca listę elementów menu dla podanego użytkownika. Użytkownikowi zdefiniowane uprawnienia są uwzględnione w wynikach.

3. **grouped_visible_nav**: Grupuje pozycje menu wg definicji `NAV_GROUPS`. Dla każdego grupy, są wyświetlane tylko te elementy, które mają odpowiednie uprawnienia dla użytkownika.

4. **path_allowed_for_portal**: Sprawdza, czy dana ścieżka jest zezwolona dla użytkownika. Zwraca `True`, jeśli ścieżka jest zgodna z definicją lub spełnia specyficzne reguły dla powiązanych ścieżek.

5. **seed_nav_menu_and_permissions**: Tworzy pozycje menu i domyślne uprawnienia dla ról. Użytkownikowi zdefiniowane uprawnienia są uwzględnione w wynikach.

6. **sync_new_nav_items_and_permissions**: Dodaje brakujące pozycje menu do bazy bez resetowania istniejących.