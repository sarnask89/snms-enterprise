Ten kod definiuje modeli bazy danych SQLAlchemy dla różnych typów danych w systemie. Modely reprezentują różne elementy, takie jak tarify, subskrypcje, faktury, płatności ręcznie i wpłaty kredytowe.

1. **Tariff**: Reprezentuje informacje o tariffach, w tym nazwę, cenę, opis, aktywność, prędkość przesyłania danych w Mbps i stawka VAT.

2. **Subscription**: Reprezentuje subskrypcje, które zawierają informacje o kliencie, tariffie, urządzeniu, datę rozpoczęcia i zakończenia subskrypcji, oraz prędkość przesyłania danych w Mbps.

3. **Invoice**: Reprezentuje faktury, które zawierają informacje o numerze, kliencie, kwotę, statusie, datę wystawienia, działaniu, stawką VAT, cenę netto i cenę VAT, oraz kwalifikację dokumentu.

4. **RecurringPayment**: Reprezentuje płatności ręcznie, które zawierają informacje o kliencie, nazwę, kwotę, interwał w miesiącach, dzień miesiąca, aktywność i datę następnego wykonywania.

5. **LedgerEntry**: Reprezentuje wpłaty kredytowe, które zawierają informacje o kliencie, kwotę, typie wpłaty (np. wpłata z banku), opis i datę wpłaty.

6. **CashReceipt**: Reprezentuje wpłaty kredytowe, które zawierają informacje o kliencie, kwotę, opis i datę wpłaty.

Każdy model ma relacje do innych tabel bazy danych, takich jak `tariff`, `subscription`, `invoice`, `recurring_payment`, `ledger_entry` i `cash_receipt`. Relacje są definiowane za pomocą funkcji `relationship()` w SQLAlchemy.