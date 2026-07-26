# Strandvis Verhuur Ameland

Professionele Next.js verhuurwebsite voor strandvismateriaal op Ameland.

## Inbegrepen
- Professionele responsive homepage
- Productselectie met aantallen en prijsberekening
- Aanvraagformulier met lokale demo-opslag
- Supabase API-voorbereiding
- Uitgebreid admin-dashboard met filters en aanvraagdetails
- SEO metadata

## Demo admin
- URL: `/admin`
- Wachtwoord: `ameland2026`

> Vervang dit wachtwoord en gebruik Supabase Auth voordat de website publiek wordt gebruikt.

## Installeren
```bash
npm install
npm run dev
```

## Supabase koppelen
1. Maak een Supabase-project.
2. Voer `supabase.sql` uit in de SQL editor.
3. Kopieer `.env.example` naar `.env.local`.
4. Vul de URL, anon key en service-role key in.
5. Deploy naar Vercel en voeg dezelfde variabelen daar toe.

## Nog aanpassen
Zoek in `app/page.js` naar de placeholder gegevens:
- `06 00 00 00 00`
- `info@strandvisverhuurameland.nl`
- Bedrijfsnaam en ophaallocatie
- Productprijzen, borg en afbeeldingen
