# Zadaci

## 1. Search bar na početnoj stranici

Dodajte funkcionalnost search baru na homepageu. UI komponenta je prisutna na zaslonu ali nije funkcionalna, vi trebate povezati backend i ažurirati stanje liste festivala.

### Upute
- Search bar treba koristiti servis za festivale. Servis se zove `festivalService` i nalazi se u `src/services/festivalService.ts`.
- Search bar treba slati query prema `GET /festivals`.
- Koristite query parametar `search`.
- Kada korisnik upiše tekst i pokrene pretragu, dohvatite filtriranu listu festivala s backenda.
- Ažurirajte stanje na stranici tako da se prikazuju samo festivali koje je backend vratio.

---

## 2. Stranica s favoritima

Dodajte zasebnu stranicu za festivale koje je korisnik označio kao favorite.

### Upute
- Stranica za favorite već postoji, potrebno ju je nadopuniti.
- Rutu za nove favorite dodajte u datoteci `src/App.tsx`.
- Povežite gumb u navigacijskoj traci s novom rutom.
- Na toj stranici prikažite festivale koje je korisnik spremio (dohvatite s backenda koristeći `festivalService`.
- Koristite postojeće kartice festivala (`FestivalCard`).
- Omogućite uklanjanje festivala iz liste favorita (poziv backendu, ne samo lokalno).

---

## 3. Validacija forme

Poboljšajte validaciju forme za dodavanje i uređivanje festivala.

### Upute
- U formi obavezno koristite `useForm`.
- Kao primjer pogledajte `FoodManager` ili `DrinkManager`, gdje je `useForm` već korišten za validaciju
- Validaciju dodajte u datoteci `src/validation/formSchemas.ts`.
- Proširite `FestivalForm` validacijom da su naziv, lokacija i datum obavezni.
- Datum ne smije biti u prošlosti.

---

## 4. Error i loading stanja

Ujednačite prikaz učitavanja i grešaka kroz aplikaciju.

### Upute
- Na stranici `src/pages/HomePage.tsx` prikažite spinner na sredini stranice dok se učitavaju festivali.
- Na stranici `src/pages/FavouritesPage.tsx` prikažite isti centrirani spinner dok se učitavaju festivali.
- Ako fetch timeouta ili ne uspije, prikažite odgovarajuću poruku o grešci.

---

## Bonus: Search bar je neresponzivan

Search bar trenutno nije responzivan i utipkana slova se prikazuju sa zakašnjenjem.

### Upute
- Ispitajte zašto postoji delay pri upisu i što ga uzrokuje.
- Optimizirajte render tako da se upisana slova prikazuju odmah.
- Pazite da search i dalje radi ispravno.
