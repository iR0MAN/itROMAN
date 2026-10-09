# Pierwsza Dolina

Gra action RPG single-player 3D w przeglądarce, inspirowana klasycznymi orientalnymi MMORPG. Oryginalne modele low-poly generowane w kodzie, bez zasobów Metin2.

## Uruchomienie

Otwórz https://niewiadomski-art.pl/pierwsza-dolina/ lub https://niewiadomski-art.netlify.app/pierwsza-dolina/.

Lokalnie w katalogu repozytorium: `python3 -m http.server 8080`, potem http://localhost:8080/pierwsza-dolina/. Moduły ES wymagają serwera HTTP; nie otwieraj pliku przez file://.

## Funkcje

- Mapa 180 × 180 z wioską, drogami, lasem, rzeką, dwoma mostami i kolizjami.
- Cztery NPC; sześć zwykłych typów potworów, kamienie zniszczenia i boss.
- Walka w czasie rzeczywistym, cztery umiejętności, agresja i odradzanie przeciwników.
- Poziomy 1–30, punkty statystyk, doświadczenie i 12 kolejnych misji.
- Plecak 40 miejsc, siedem slotów wyposażenia, pięć poziomów broni i zbroi.
- Ulepszenia +0–+9, materiały, szansa sukcesu i zwoje ochronne.
- Sklep, mikstury, monety i łupy na ziemi.
- Zapis localStorage, eksport/import JSON i nowa gra z potwierdzeniem.
- WASD, kliknięcie i interfejs dotykowy.

## Sterowanie

WASD / strzałki / kliknięcie: ruch. Kliknięcie potwora: podejście i automatyczny atak. Spacja: atak. 1–4: umiejętności. Q/E: mikstury. F: zbieranie. I: ekwipunek. C: postać. J: misje. Esc: menu. Kółko myszy: przybliżanie. Telefon: joystick, przyciski i dotknięcie celu.

## Sprawdzenie

`node --test pierwsza-dolina/core.test.mjs pierwsza-dolina/world.test.mjs`

Testy obejmują doświadczenie, misje, ulepszenia i ich porażki, wyposażenie, mikstury, limit plecaka, zapis, wyszukiwanie ścieżek oraz generowanie prawdziwej geometrii Three.js i dostępność NPC. Kontrola GPU i wyglądu w realnej przeglądarce wymaga ręcznego testu.

## Pliki

`core.mjs`: mechaniki i ścieżki; `world.mjs`: scena i modele; `game.mjs`: sterowanie, symulacja i UI; `style.css`: interfejs. Three.js 0.169.0 jest dołączony lokalnie (licencja MIT w vendor/THREE-LICENSE.txt). Gra nie wymaga CDN ani instalacji zależności.

Wersja jednoosobowa: postępy są lokalne, potwory i łupy odtwarzają się po ponownym uruchomieniu. Bez serwera multiplayer i synchronizacji kont.
