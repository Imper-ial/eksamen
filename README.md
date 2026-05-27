# Kommune 69 Varslingssystem

Eksamensprosjekt VG2 IT.
Et enkelt digitalt varslingssystem som lar en kommune registrere, følge opp
og dokumentere hendelser som vannlekkasje, brannfare, IT-feil, strøm og
andre avvik.

## Teknologi

- Node.js + Express
- EJS som view engine
- MongoDB + Mongoose
- express-session
- argon2 (passord-hashing)
- dotenv
- Vanlig CSS

## Prosjektstruktur

```
/config        - databaseoppsett
/public/css    - stilark
/routes        - Express-ruter
/views         - EJS-maler
app.js         - hovedfil som starter serveren
```

## Komme i gang

1. Installer avhengigheter:
   ```
   npm install
   ```

2. Kopier eksempelmiljøfilen og fyll inn dine egne verdier:
   ```
   cp .env.example .env
   ```

3. Start serveren:
   ```
   npm start
   ```

Serveren kjører som standard på `http://localhost:3000`.

## Miljøvariabler

Se `.env.example` for hvilke variabler som må være satt.

## Status

Iterasjon 1: grunnstruktur og forside.
Innlogging, modeller og hendelser kommer i senere iterasjoner.
