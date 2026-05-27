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

## Prosjektstruktur

```
/config        - databaseoppsett
/controllers   - kontroller-logikk (MVC)
/middleware    - auth-middleware
/models        - Mongoose-modeller
/public/css    - stilark
/routes        - Express-ruter
/views         - EJS-maler
app.js         - hovedfil
seed.js        - script for testdata
```

## Komme i gang

1. Installer avhengigheter:
   ```
   npm install
   ```

2. Lag en `.env`-fil basert på `.env.example`:
   ```
   cp .env.example .env
   ```

3. Kjør seed-scriptet for å lage testbrukere og eksempelhendelser:
   ```
   npm run seed
   ```

4. Start serveren:
   ```
   npm start
   ```

Serveren kjører som standard på `http://localhost:3000`.

## Personvern / GDPR

Systemet lagrer kun nødvendige personopplysninger for intern oppfølging av
hendelser. Det lagres fullt navn og rolle for å kunne vise hvem som har
opprettet, fått ansvar for eller fulgt opp en hendelse. Systemet skal ikke
lagre fødselsnummer, private adresser, telefonnummer eller helseopplysninger.
Brukere får beskjed i FAQ om å ikke skrive sensitive personopplysninger
unødvendig.

## Roller

- **admin** – kan opprette brukere og se/redigere alle hendelser.
- **it** – kan se og følge opp hendelser.
- **drift** – kan se og følge opp hendelser.

## Testbrukere (etter seed)

- `Christian Bjørndal` / `Admin123!` (admin)
- `Marius Haugen` / `It123!` (it)
- `Anders Johansen` / `Drift123!` (drift)

Se `seed.js` for full liste over 27 brukere.
