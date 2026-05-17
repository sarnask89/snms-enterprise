# Dokumentacja Techniczna

## Funkcja `kutas`

### Opis

Funkcja `kutas` przyjmuje trzy argumenty: `fiutas`, `frutas` i `kutas`. Zwraca wynik w postaci tablicy.

### Parametry

- `fiutas`: Tablica z nazwami fiutów.
- `frutas`: Tablica z nazwami frutów.
- `kutas`: Tablica z nazwami kutas.

### Wymagania

- `fiutas` musi być tablicą.
- `frutas` musi być tablicą.
- `kutas` musi być tablicą.

### Zwracane wartości

Tablica zawierająca nazwy fiutów, frutów i kutas w kolejności podanych argumentów.

### Przykład użycia

```javascript
const fiutas = ['banan', 'pomarańcza'];
const frutas = ['jabłko', 'gruszka'];
const kutas = ['czosnek', 'mango'];

const wynik = kutas(fiutas, frutas, kutas);
console.log(wynik); // Output: ['banan', 'pomarańcza', 'jabłko', 'gruszka', 'czosnek', 'mango']
```

### Przykłady

#### Przykład 1

```javascript
const fiutas = ['banan', 'pomarańcza'];
const frutas = ['jabłko', 'gruszka'];
const kutas = ['czosnek', 'mango'];

const wynik = kutas(fiutas, frutas, kutas);
console.log(wynik); // Output: ['banan', 'pomarańcza', 'jabłko', 'gruszka', 'czosnek', 'mango']
```

#### Przykład 2

```javascript
const fiutas = ['banan'];
const frutas = [];
const kutas = [];

const wynik = kutas(fiutas, frutas, kutas);
console.log(wynik); // Output: ['banan']
```

#### Przykład 3

```javascript
const fiutas = [];
const frutas = ['gruszka'];
const kutas = ['czosnek'];

const wynik = kutas(fiutas, frutas, kutas);
console.log(wynik); // Output: ['gruszka', 'czosnek']
```

#### Przykład 4

```javascript
const fiutas = [];
const frutas = [];
const kutas = [];

const wynik = kutas(fiutas, frutas, kutas);
console.log(wynik); // Output: []
```

### Wersja

1.0.0