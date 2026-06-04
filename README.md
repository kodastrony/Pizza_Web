# 🍕 SLICE — Pizza z pieca opalanego drewnem

Odważny, retro‑kreskówkowy landing page fikcyjnej neapolitańskiej marki pizzy, zbudowany
jako pokazowa praca do portfolio. Mnóstwo animacji i charakteru: intro‑loader budujący
pizzę składnik po składniku, odsłona zakrzywionymi pasami koloru, gigantyczna obrysowana
typografia plakatowa, pizze z „oczami google" i białymi rękawiczkami, dryfujące składniki
napędzane scrollem oraz papierowy samolocik lecący po trasie między kartami miast.

> Język wizualny i model interakcji zainspirowane strukturą cravburgers.shop —
> napisane od zera dla pizzy, z autorską grafiką i kodem. Strona w pełni po polsku.

## ✨ Najważniejsze elementy

- **Intro‑loader** budujący pizzę warstwa po warstwie (sos → ser → pepperoni → bazylia →
  oczy) z rotującymi statusami i paskiem postępu.
- **Odsłona pasami koloru** (czerwony → pomarańczowy → bordowy → krem) ścierającymi się do hero.
- **Obrysowana typografia** — `paint-order` + text‑stroke dają „pulchny" plakatowy efekt.
- **Ręcznie rysowane SVG**: maskotki, składniki, rękawiczki, line‑art pizzaiolo i samolot.
- **Oczy** pizzy śledzące kursor i mrugające.
- **Płynny scroll** (Lenis) + **GSAP + ScrollTrigger**: reveal'e, paralaksa i samolot
  próbkowany po ścieżce SVG (`getPointAtLength`) — zawsze trzyma się trasy na każdym ekranie.
- **Faliste przejścia SVG**, ukośny marquee, własny kursor, pełnoekranowe menu, baner cookies.
- W pełni **responsywna** i szanuje **`prefers-reduced-motion`**.

## 🧱 Technologia

- Czysty **HTML / CSS / JavaScript** — bez kroku budowania.
- **GSAP 3** + ScrollTrigger + MotionPathPlugin, **Lenis** (hostowane lokalnie w `js/lib/`).
- **Fonty hostowane lokalnie** (Luckiest Guy, Paytone One, Fredoka) z podzbiorem
  **latin‑ext** (polskie znaki) w `assets/fonts/` — działa w pełni offline.

## ▶️ Uruchomienie

Strona ładuje lokalne fonty/skrypty, więc serwuj ją po HTTP (nie otwieraj pliku bezpośrednio):

```bash
node server.js      # → http://localhost:5188
```

…albo dowolnym serwerem statycznym (`npx serve`, Live Server w VS Code itp.).

Dodaj `?static` do adresu, aby wyłączyć animacje (przydatne do zrzutów / inspekcji).

## 📁 Struktura

```
index.html          markup + inline SVG
css/
  fonts.css         deklaracje @font-face (latin + latin-ext)
  styles.css        design system + wszystkie sekcje
js/
  main.js           loader, reveal, animacje scrolla, interakcje
  lib/              gsap, ScrollTrigger, MotionPathPlugin, lenis
assets/
  fonts/            fonty .woff2
  img/              zdjęcia
screenshots/        podglądy sekcji
server.js           mały serwer statyczny do podglądu
```

## 🙏 Źródła

- Zdjęcia: [Unsplash](https://unsplash.com) (darmowa licencja).
- Fonty: Luckiest Guy, Paytone One, Fredoka (Google Fonts, OFL).
- Animacje: [GSAP](https://gsap.com), [Lenis](https://github.com/darkroomengineering/lenis).

*Marka, treści i grafika są fikcyjne, wyłącznie do celów portfolio/demo.*
