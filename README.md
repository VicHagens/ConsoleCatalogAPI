# Console Catalog API

**Auteur:** Vic Hagens  
**Opleiding:** Hogeschool VIVES Kortrijk  
**Vak:** NodeJS  
**Docenten:** D. Hostens en M. Dima

Console Catalog API is een REST API voor een catalogus van iconische gameconsoles, games, merken, franchises en reviews. Het project is gemaakt als examenopdracht voor het vak NodeJS.

Ik koos dit onderwerp omdat retro gaming en klassieke consoles mij interesseren en een groot deel uitmaakten van mijn jeugd. Ook vandaag blijft dat onderwerp mij aanspreken. Met deze API kan later bijvoorbeeld een frontend gebouwd worden waar gebruikers consoles en games kunnen ontdekken, reviews kunnen lezen en zelf beoordelingen kunnen plaatsen.

Het project volgt de cursusaanpak van het vak: Express routes, middleware, Mongoose models, Joi validation, environment variables, JWT authentication en centrale error handling.

## Huidige Status

| Onderdeel | Status |
|---|---|
| Express API | Klaar |
| MongoDB + Mongoose | Klaar |
| Minstens 17 endpoints | Klaar |
| Minstens 4 gelinkte collections | Klaar |
| Embedded documents | Klaar |
| References tussen collections | Klaar |
| JWT authentication | Klaar |
| Role-based authorization | Klaar |
| Joi validation | Klaar |
| ObjectId validation | Klaar |
| Centrale error middleware | Klaar |
| REST Client `.http` files | Klaar |
| Manueel testen via `.http` files | Klaar |
| Unit tests | Nog te doen |
| Integration tests | Nog te doen |
| Deployment | Nog te doen |

## Links

Live API URL:

```txt
Nog toe te voegen na deployment
```

API documentatie:

```txt
README.md
docs/*.http
```

Na deployment worden de live URL en eventuele extra documentatielink hier ingevuld.

## Belangrijkste Functionaliteiten

- Publieke catalogus met brands, consoles, franchises en games
- Gebruikersregistratie en login
- JWT tokens met vervaltijd
- Admin-only beheer van catalogusdata
- Gebruikers kunnen reviews schrijven voor games
- Gebruikers kunnen hun eigen reviews aanpassen of verwijderen
- Admins kunnen alle reviews beheren
- Users kunnen hun eigen profiel aanpassen, maar niet hun eigen role
- Input validation met Joi
- ObjectId checks voor MongoDB-acties
- Demo data via een seed script
- REST Client bestanden met succesvolle en falende requestvoorbeelden

## Tech Stack

```txt
Node.js
Express
MongoDB
Mongoose
Joi
JSON Web Tokens
bcrypt
dotenv
REST Client
```

## Projectstructuur

```txt
docs/
  api_calls_auth.http
  api_calls_brands.http
  api_calls_consoles.http
  api_calls_franchises.http
  api_calls_games.http
  api_calls_reviews.http
  api_calls_users.http
scripts/
   seed.js
src/
  app.js
  server.js
  config/
    db.js
  middleware/
    admin.js
    auth.js
    error.js
    reviewOwnerOrAdmin.js
  models/
    brand.js
    console.js
    franchise.js
    game.js
    review.js
    user.js
  routes/
    auth.js
    brands.js
    consoles.js
    franchises.js
    games.js
    reviews.js
    users.js
  validation/
    authValidation.js
    brandValidation.js
    consoleValidation.js
    franchiseValidation.js
    gameValidation.js
    reviewValidation.js
    userValidation.js
```

## Installatie

1. Clone de repository.

```bash
git clone https://github.com/VIVES-Zuid/nodejs-ti-a-final-assignment-VicHagens
cd nodejs-ti-a-final-assignment-VicHagens
```

2. Installeer de dependencies.

```bash
npm install
```

3. Maak een `.env` bestand aan in de root van het project.

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/consolecatalog
JWT_SECRET=secret_hier
JWT_EXPIRES_IN=1h
```

4. Zorg dat MongoDB lokaal draait.

Voor MongoDB Compass kan je lokaal verbinden met:

```txt
mongodb://127.0.0.1:27017
```

5. Start de API.

```bash
npm run dev
```

6. Open de welcome route.

```txt
http://localhost:3000/
```

## Scripts

| Script | Uitleg |
|---|---|
| `npm start` | Start de server met Node |
| `npm run dev` | Start de server met nodemon |
| `npm run seed` | Vult de database met demo catalogusdata |

Het seed script staat in:

```txt
src/seed.js
```

Let op: het seed script verwijdert bestaande catalogusdata en reviews voordat de demo data opnieuw wordt toegevoegd. Dit voorkomt dat oude reviews blijven verwijzen naar games die opnieuw aangemaakt zijn.

## Environment Variables

De API gebruikt environment variables zodat gevoelige data niet hardcoded in de code staat.

| Variable | Betekenis |
|---|---|
| `PORT` | Poort waarop de server draait |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret waarmee JWT tokens ondertekend worden |
| `JWT_EXPIRES_IN` | Geldigheid van JWT tokens |

Belangrijk:

- `.env` wordt niet gecommit.
- `JWT_SECRET` moet in productie een sterke geheime waarde zijn.
- `JWT_EXPIRES_IN` zorgt ervoor dat tokens niet onbeperkt geldig zijn.
- MongoDB connection strings worden via environment variables ingesteld.

## Database Ontwerp

De API gebruikt zes collections:

```txt
brands
consoles
franchises
games
users
reviews
```

Geen enkele collection staat volledig los. De collections zijn aan elkaar gekoppeld via references waar dat logisch is.

### Brand

Een brand stelt een bedrijf of uitgever voor, bijvoorbeeld Nintendo, Sega, Microsoft of Atari.

Belangrijke velden:

```txt
name
country
foundedYear
description
```

Brands worden gebruikt door consoles en games:

```txt
console.brand -> Brand
game.publisher -> Brand
```

### Console

Een console stelt een gameconsole voor.

Belangrijke velden:

```txt
name
brand
generation
releaseYear
description
specs
```

`specs` is een embedded document:

```txt
cpu
memory
media
maxResolution
```

Deze technische details horen alleen bij die ene console. Daarom worden ze embedded opgeslagen.

De `brand` is een reference naar `Brand`, omdat een brand meerdere consoles kan hebben en apart beheerd wordt.

### Franchise

Een franchise stelt een reeks games voor, zoals Mario, Zelda, Halo of Sonic.

Belangrijke velden:

```txt
name
createdBy
firstReleaseYear
description
```

Games kunnen naar een franchise verwijzen:

```txt
game.franchise -> Franchise
```

### Game

Een game is een item in de globale gamecatalogus.

Belangrijke velden:

```txt
title
franchise
consoles
publisher
releaseYear
genre
description
releaseInfo
```

`releaseInfo` is een embedded document:

```txt
region
originalReleaseDate
ageRating
```

Deze release-informatie hoort specifiek bij een game. Daarom is embedding hier logischer dan een aparte collection.

Games gebruiken references voor gedeelde data:

```txt
game.franchise -> Franchise
game.consoles -> Console[]
game.publisher -> Brand
```

Dit is bewust gedaan omdat consoles, franchises en brands apart bestaan en door meerdere games gebruikt kunnen worden.

### User

Een user bevat logininformatie en een role.

Belangrijke velden:

```txt
name
email
password
role
```

Wachtwoorden worden gehasht met bcrypt. Ze worden dus niet als plain text opgeslagen.

Mogelijke rollen:

```txt
user
admin
```

Een nieuwe gebruiker krijgt automatisch de role `user`. De register route accepteert geen `role` field, zodat gebruikers zichzelf geen admin kunnen maken.

### Review

Een review is een beoordeling van een user voor een game.

Belangrijke velden:

```txt
user
game
rating
comment
createdAt
updatedAt
```

Relaties:

```txt
review.user -> User
review.game -> Game
```

Reviews staan in een aparte collection omdat ze bij zowel users als games horen. Een user kan maximaal een review per game schrijven. Dit wordt gecontroleerd in de review route.

## Embedded Documents Versus References

Ik gebruik embedded documents voor data die maar bij een document hoort:

- `Console.specs`
- `Game.releaseInfo`

Ik gebruik references voor data die gedeeld wordt of apart beheerd moet worden:

- brands
- consoles
- franchises
- games
- users
- reviews

Voorbeeld: een game kan op meerdere consoles verschijnen. Daarom is `Game.consoles` een array van references naar `Console` documenten.

## Rollen En Rechten

### Niet Ingelogd

Een niet-ingelogde gebruiker kan:

- brands bekijken
- consoles bekijken
- franchises bekijken
- games bekijken
- reviews bekijken
- reviews van een specifieke game bekijken

### User

Een ingelogde user kan:

- eigen profiel bekijken via `/api/users/me`
- eigen naam en email wijzigen
- een review schrijven voor een game
- eigen reviews aanpassen
- eigen reviews verwijderen

Een gewone user kan geen catalogusdata beheren en kan zichzelf geen admin maken.

### Admin

Een admin kan:

- brands beheren
- consoles beheren
- franchises beheren
- games beheren
- alle users bekijken
- users opzoeken via id
- usergegevens wijzigen
- userrollen wijzigen
- users verwijderen
- reviews aanpassen of verwijderen

## Authenticatie

Registreren gebeurt via:

```http
POST /api/auth/register
```

Inloggen gebeurt via:

```http
POST /api/auth/login
```

Bij login geeft de API een JWT terug:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Beschermde routes verwachten de token in de `x-auth-token` header:

```http
x-auth-token: YOUR_TOKEN_HERE
```

De token bevat:

```txt
_id
role
```

De auth middleware zet deze data op:

```js
req.user
```

## Autorisatie

De API gebruikt drie belangrijke middleware-bestanden voor beveiliging:

```txt
auth.js
admin.js
reviewOwnerOrAdmin.js
```

Voor admin-only catalogusroutes worden `authMiddleware` en `adminMiddleware` samen gebruikt.

Voor reviews wordt gecontroleerd of de gebruiker eigenaar is van de review of admin is.

Gebruikers kunnen hun eigen role niet aanpassen. Alleen admins kunnen roles wijzigen via de user update route.

## Validatie

Alle request bodies voor create/update acties worden gevalideerd met Joi.

De validatie staat in:

```txt
src/validation/
```

Validatie wordt gebruikt voor:

- register en login
- brands
- consoles
- franchises
- games
- user updates
- reviews

ObjectIds in route parameters worden gecontroleerd met:

```js
mongoose.Types.ObjectId.isValid(id)
```

Voorbeelden:

```txt
/api/games/:id
/api/users/:id
/api/games/:gameId/reviews
```

Joi controleert de vorm van ObjectIds in request bodies. De routes controleren daarna nog of het gereferencete document echt bestaat in MongoDB.

## Error Handling

Async routes gebruiken `try/catch` en sturen onverwachte errors door met:

```js
next(error)
```

De centrale error middleware staat in:

```txt
src/middleware/error.js
```

Daardoor crasht de API niet zomaar bij onverwachte fouten.

## API Endpoints

### Auth

| Method | Endpoint | Access | Beschrijving |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Registreer een nieuwe user |
| POST | `/api/auth/login` | Public | Login en ontvang JWT |

### Brands

| Method | Endpoint | Access | Beschrijving |
|---|---|---|---|
| GET | `/api/brands` | Public | Haal alle brands op |
| GET | `/api/brands/:id` | Public | Haal een brand op |
| POST | `/api/brands` | Admin | Maak een brand aan |
| PUT | `/api/brands/:id` | Admin | Update een brand |
| DELETE | `/api/brands/:id` | Admin | Verwijder een brand |

### Consoles

| Method | Endpoint | Access | Beschrijving |
|---|---|---|---|
| GET | `/api/consoles` | Public | Haal alle consoles op |
| GET | `/api/consoles/:id` | Public | Haal een console op |
| POST | `/api/consoles` | Admin | Maak een console aan |
| PUT | `/api/consoles/:id` | Admin | Update een console |
| DELETE | `/api/consoles/:id` | Admin | Verwijder een console |

### Franchises

| Method | Endpoint | Access | Beschrijving |
|---|---|---|---|
| GET | `/api/franchises` | Public | Haal alle franchises op |
| GET | `/api/franchises/:id` | Public | Haal een franchise op |
| POST | `/api/franchises` | Admin | Maak een franchise aan |
| PUT | `/api/franchises/:id` | Admin | Update een franchise |
| DELETE | `/api/franchises/:id` | Admin | Verwijder een franchise |

### Games

| Method | Endpoint | Access | Beschrijving |
|---|---|---|---|
| GET | `/api/games` | Public | Haal alle games op |
| GET | `/api/games/:id` | Public | Haal een game op |
| POST | `/api/games` | Admin | Maak een game aan |
| PUT | `/api/games/:id` | Admin | Update een game |
| DELETE | `/api/games/:id` | Admin | Verwijder een game |

### Users

| Method | Endpoint | Access | Beschrijving |
|---|---|---|---|
| GET | `/api/users` | Admin | Haal alle users op |
| GET | `/api/users/me` | User/Admin | Haal huidige ingelogde user op |
| GET | `/api/users/:id` | Admin | Haal een user op |
| PUT | `/api/users/:id` | Owner/Admin | Update eigen profiel of user als admin |
| DELETE | `/api/users/:id` | Admin | Verwijder een user |

### Reviews

| Method | Endpoint | Access | Beschrijving |
|---|---|---|---|
| GET | `/api/reviews` | Public | Haal alle reviews op |
| GET | `/api/reviews/:id` | Public | Haal een review op |
| GET | `/api/games/:gameId/reviews` | Public | Haal reviews van een game op |
| POST | `/api/games/:gameId/reviews` | User/Admin | Schrijf review voor een game |
| PATCH | `/api/reviews/:id` | Owner/Admin | Update review |
| DELETE | `/api/reviews/:id` | Owner/Admin | Verwijder review |

## REST Client Bestanden

De map `docs/` bevat `.http` bestanden om de API manueel te testen met de REST Client extension in VS Code.

```txt
docs/api_calls_auth.http
docs/api_calls_brands.http
docs/api_calls_consoles.http
docs/api_calls_franchises.http
docs/api_calls_games.http
docs/api_calls_reviews.http
docs/api_calls_users.http
```

De bestanden bevatten:

- werkende requests
- foutscenario's met ongeldige data
- foutscenario's zonder token
- foutscenario's met onvoldoende rechten
- voorbeelden met ongeldige ObjectIds

Gebruik eerst:

```txt
POST /api/auth/register
POST /api/auth/login
```

Kopieer daarna de token naar:

```http
x-auth-token: paste-user-token-here
```

of voor adminroutes:

```http
x-auth-token: paste-admin-token-here
```

## Demo Data

Met het seed script kan de database gevuld worden met demo data:

```bash
npm run seed
```

Het seed script maakt demo data aan voor:

- brands
- consoles
- franchises
- games

Het script gebruikt de `MONGODB_URI` uit `.env`.

## Testing

De `.http` bestanden zijn manueel getest en werken zoals verwacht.

Automated tests moeten nog toegevoegd worden.

Geplande tests:

- register en login
- protected routes zonder token
- admin-only routes met gewone user
- publieke catalogus GET routes
- Joi validation failures
- review owner/admin permissions

## Deployment Guide

### 1. MongoDB Atlas

Maak een MongoDB Atlas database aan en kopieer de connection string.

Voorbeeld:

```txt
mongodb+srv://<username>:<password>@cluster.mongodb.net/console-catalog-api
```

### 2. Hostingplatform

Mogelijke platformen:

```txt
Render
Railway
Fly.io
Azure
```

Voor deze API is Render of Railway een eenvoudige keuze.

### 3. Code Pushen

```bash
git add .
git commit -m "Prepare Console Catalog API for deployment"
git push
```

### 4. Web Service Aanmaken

Gebruik op het hostingplatform:

```bash
npm install
```

als build command.

Gebruik:

```bash
npm start
```

als start command.

### 5. Environment Variables Instellen

```env
PORT=3000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_production_secret
JWT_EXPIRES_IN=1h
```

Sommige platformen vullen `PORT` automatisch in.

### 6. Deployment Testen

Na deployment test je:

```txt
GET /
GET /api/games
POST /api/auth/login
GET /api/users/me
```

Daarna moeten de live links bovenaan deze README ingevuld worden.

## Security Notes

- Wachtwoorden worden gehasht met bcrypt.
- JWT tokens verlopen via `JWT_EXPIRES_IN`.
- `.env` wordt genegeerd door Git.
- Users kunnen bij registratie geen role meegeven.
- Users kunnen hun eigen role niet aanpassen.
- Admin-only routes gebruiken `authMiddleware` en `adminMiddleware`.
- Review updates/deletes gebruiken owner/admin authorization.
- MongoDB connection strings worden via environment variables gebruikt.
