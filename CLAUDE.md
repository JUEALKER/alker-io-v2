# alker.io (alker-io-v2)

Die Live-Site www.alker.io. Astro, statisch, Vercel. **Push auf main = Production-Deploy.**
Slide-Deck (Hauptseite) + Writing-Sektion (`/writing`) + Imprint/Privacy.

## Neuen Artikel veröffentlichen

Wenn Jürgen einen neuen Artikel liefert (Text + Bilder, in `_blog/<nr>/` in
diesem Repo — gitignored, nie direkt veröffentlicht — oder direkt genannt),
ist das der Ablauf:

1. **Ordner anlegen:** `src/content/writing/<slug>/` — Slug kurz, sprechend,
   kleingeschrieben mit Bindestrichen. Wird Teil der URL, später nicht mehr ändern.
2. **`index.md`** mit diesem Frontmatter (Schema wird beim Build hart validiert):

   ```yaml
   ---
   title: "Der Titel"
   standfirst: "Ein bis zwei Sätze Teaser. Erscheint unter der Headline, im Index, in Feeds."
   date: 2026-09-01          # YYYY-MM-DD, Veröffentlichungsdatum
   series: beyond-ninety-minutes   # NUR bei Serienteilen, zusammen mit part
   part: 11                        # NUR bei Serienteilen
   hero: ./hero.webp         # Aufmacherbild; weglassen, wenn es keins gibt
   heroAlt: "Echte Bildbeschreibung, nie leer wenn hero gesetzt"
   draft: false              # true = im Code, aber nirgends sichtbar
   ---
   ```

3. **Bilder:** in den Artikelordner (nie nach `public/`). `hero.webp` = Aufmacher,
   weitere als `image-01.webp` aufwärts, im Text relativ referenziert
   (`![](./image-01.webp)`). Originale zu WebP max. 1600px Breite, Qualität 80
   konvertieren (Pillow ist auf dem System). Der Hero steht NUR im Frontmatter,
   nicht nochmal im Text. Mehrere Bilder direkt hintereinander rendern automatisch
   als Zweispalten-Galerie. `heroAlt` nach tatsächlichem Ansehen des Bildes schreiben.
4. **Copy-Regeln (Hausstil):** Englisch. Typografische Apostrophe ('), keine
   Gedankenstriche. Max. zwei Statement-Zeilen pro Artikel, max. eine fette Passage
   im Fließtext. Substack-Boilerplate (Subscribe-Aufrufe, "Thanks for reading",
   LinkedIn-Hinweise) entfernen. Kurze fette Zeilen ohne Satzzeichen sind
   Zwischenüberschriften (`##`). Achtung CommonMark: nach schließendem `**` muss
   ein Leerzeichen folgen, sonst rendert Bold nicht.
5. **Bauen und prüfen:** `npm run build` — muss fehlerfrei durchlaufen (Validierung
   bricht bei Schema-Verstößen, unbekannter Serie, doppelter Part-Nummer ab).
   Artikel lokal im Browser ansehen (dist/ via Preview-Server), dann committen
   und pushen.
6. **Nichts weiter nötig:** Writing-Slide (neueste 3), Index, RSS (Volltext),
   llms.txt, llms-full.txt, Sitemap und JSON-LD aktualisieren sich beim Build
   von selbst.

**Direkt live vs. Preview:** Standard ist direkt auf main. Wenn Jürgen erst
schauen will: Branch pushen (→ Vercel-Preview, hinter SSO) oder `draft: true`
bis zur Freigabe.

**Substack-Rhythmus:** Immer zuerst hier veröffentlichen, 2–3 Tage später auf
Substack mit Verweis auf das Original. Substack-Slugs bewusst identisch halten.

## Technische Leitplanken

- Site-URL kommt aus `astro.config.mjs` (env-abhängig: Previews bekommen ihre
  eigene Domain + noindex, Production www.alker.io). Nie URLs hardcoden —
  `Astro.site` / `context.site` verwenden.
- Design-System: 5 Farben, Messina Sans in 3 Schnitten (900 = Condensed Black
  für Headlines), 10px-Radius, fluid Typo. Kein neues CSS-Framework, keine
  neuen Fonts, keine Hover-Zustände (hat die Site nirgends).
- Bilder unter `/_astro/` und `/fonts/` cachen immutable — Assets nie unter
  gleichem Namen ersetzen, Inhalte in `public/images/` sind davon ausgenommen.
- `src/styles/writing.css` ist unter `.writing` genamespaced; Basis-Schriftgröße
  dort ist 1rem (Deck hat riesige fluid Basis — nichts erben lassen).
- Performance-Vertrag: PageSpeed 100 ohne Diagnose-Funde. Heroes laden eager
  mit fetchpriority=high; `sizes` muss die echte Spaltenbreite abbilden
  (`calc(100vw - 20px)` mobil, 44rem desktop).
- Imprint/Privacy: gemeinsame Content-Komponenten (Dialog + Standalone-Seiten).
  Rechtstexte nur auf ausdrückliche Anweisung ändern.

## Kontext

- Rollback-Anker: Tag `textstand-advisory-2026-07-21` (Stand vor dem Relaunch).
- Das Repo `../Alker_io` ist LEGACY (alter statischer Export) — nie dort arbeiten.
- Migrationshistorie der 43 Substack-Artikel: `../Alker_io/_briefing/migration alker blog/MIGRATIONSREPORT.md`.
