---
title: '– Astro for nesten alle pengene'
image: ./simen-kurt-lekanger.jpg
date: 2023-09-27
language: nb-NO
author: Simen A. W. Olsen
syndications:
  - publication: Kode24
    url: https://www.kode24.no/artikkel/gikk-fra-nextjs-til-astro-astro-for-nesten-alle-pengene/80246798
    publishedAt: 2023-09-27
---

For noen uker siden skrev jeg om nettsiden til Velt, et søsterselskap av Bjerk,
hvor vi byttet fra [Next.js](https://nextjs.org/) til
[Astro](https://astro.build/). Det tidligere Next.js-oppsettet var konfigurert
for eksport til statiske filer som ble lastet opp til GitHub Pages. Som
komponent-bibliotek brukte vi [Chakra](https://chakra-ui.com/), blant andre
verktøy.

Velts nettside er i utgangspunktet enkel, med en hovedside, noen interne
undersider, og et par skjemaer. Likevel opplevde vi utfordringer med for mange
komponenter og _greier_ for en slik nettside, noe som førte til at vi ikke fikk
like mye effekt når vi jobbet med den.

**Derfor tenkte jeg at nettsiden ville dra nytte av en overgang til Astro. Ikke
bare kunne det redusere _boilerplate_, men det ville også gi oss muligheten til
å utforske
[View Transitions API-et](https://docs.astro.build/en/guides/view-transitions/).**

## Først ut – fra CSS-in-JS til vanilje-CSS

Med Chakra bruker vi typisk CSS-in-JS. Et dagligdags eksempel ser slik ut:

```javascript

const Home = () => (
 <Layout>
  <Box sx={{ py: 'm', /* ... */ }}>
    <Hero {...} />
  </Box>
  <Heading fontSize={['2xl', '3xl']}>
    Vi skaper gode kunde- og ansattopplevelser
    for å gjøre hverdagen bedre for folk
  </Heading>
 </Layout>
);
```

Selv om dette er et enkelt eksempel, kan stil-objekter i realiteten inneholde
fort opptil 10 linjer. Chakra fremmer en standardisering, som vist med 2xl og
3xl i eksemplet.

Ved å overføre til Astro, fant jeg det naturlig å tenke nytt: Hva trenger vi
egentlig?

Selv om alle setter pris på standardisering, følte jeg at Chakra kanskje var
litt overivrig for Velts behov. Eksempel: I stedet for å bruke fastsatte
skriftstørrelser som 2xl og 3xl, tenkte jeg det var tilstrekkelig med
rem-verdier.

Jeg valgte derfor å benytte CSS-variabler der det ga mest mening:

```xml
<html>
  <head />
  <body>
    <slot />
  </body>
  <style is:global>
    :root {
      --liberty-hue: 238;
      --pale-hue: 265;
      --color-liberty: hsla(var(--liberty-hue), 100%, 64%, 1);
        --color-pale: hsla(var(--pale-hue), 100%, 90%, 1);

      --color-app-bg: hsla(var(--liberty-hue), 100%, 98%, 1);
      --color-low-contract-text: hsla(var(--liberty-hue), 100%, 80%, 1);
      --color-high-contract-text: hsla(var(--liberty-hue), 100%, 20%, 1);
      --color-solid-bg: hsla(var(--liberty-hue), 100%, 20%, 1);
      --color-solid-bg-text: hsla(var(--liberty-hue), 100%, 100%, 1);

      --container-width: 850px;
    }
  </style>
</html>
```

Hvis vi ønsker oss aliaser for andre ting, slik som skriftstørrelser, så kan vi
også bruke CSS-variabler til det. Kanskje til og med
[_flytende_ tekststørrelser med clamp](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/).

Stilsetting i Astro minner mye om [Svelte](https://svelte.dev/), der stilen er
begrenset til den aktuelle filen. Legg merke til den globale stil-taggen jeg
brukte for å unngå den begrensningen. Overføringen av komponenter og undersider
med Astro gikk smidig. Astro benytter seg, akkurat som Svelte og Next.js, av
fil-basert ruting, som gjorde prosessen oversiktlig og brukervennlig.

## `<iframe>`, events og feature toggles

Det meste av det gamle innholdet var enkelt å overføre. Utfordringene oppsto
hovedsakelig med Velts registreringsskjemaer, som er en del av et eksternt
system.

Vi har lite innsikt i hvordan det fungerer. Alt vi har fått fra utviklerne er
noen kodesnutter levert i DOCX-filer:

```html
<div class="fw-ctner">
  <iframe
    class="fw-iframe"
    gesture="media"
    allow="encrypted-media"
    frameborder="0"
    allowfullscreen
    src="[https://freshworks.com/live-chat-software/signup/partners-external-iframe-signup](https://freshworks.com/live-chat-software/signup/partners-external-iframe-signup)"
  ></iframe>
</div>

<script>
  window.addEventListener(
    'message',
    function (r) {
      if (location.origin !== r.origin) {
        for (
          vari = [
            'https://www.freshworks.com',
            'https://freshdesk.com',
            'https://freshservice.com',
          ],
            t = !1,
            e = 0;
          e < i.length;
          e++
        )
          if (r.origin.indexOf(i[e]) > -1) {
            t = !0;
            break;
          }
        if (
          t &&
          r.data &&
          (function (r) {
            try {
              JSON.parse(r);
            } catch (r) {
              return !1;
            }
            return !0;
          })(r.data)
        ) {
          varn = JSON.parse(r.data);
          n.signup_finished && (window.location.href = n.url.trim());
        }
      }
    },
    !1,
  );
</script>

<style>
  /** masse CSS som jeg hoppet over **/
</style>
```

Denne HTML-koden har vi tidligere
[konvertert til React](https://github.com/veltorg/website/blob/v1/src/components/signup-form.tsx),
og gjort det om til en gjenbrukbart komponent. Vi la også til en funksjon som
sender melding til en Slack-kanal hver gang skjemaet fylles ut, noe som vi
ønsket å bevare.

## Javascript i Astro

Astro støtter ulike JavaScript-rammeverk som React og Svelte gjennom det de
kaller [_Astro Islands_](https://docs.astro.build/en/concepts/islands/). For å
skru på funksjonalitet (_feature toggles_) i nettsiden til Velt bruker vi en rad
i localStorage kalt toggles hvor vi legger inn kommaseparerte verdier for hver
funksjon vi ønsker å skru på.

Jeg dykket særlig dypt før jeg opplevde hvor mye støy det var å bygge opp
lytting på event fra registreringsskjemaet, ikke minst styre dette med enkle
feature toggles. Jeg tenkte det derfor var helt naturlig å sette det opp som en
Svelte-komponent, ikke bare er det et kjent rammeverk, men med Svelte sitt
oppsett måtte det bli enkelt. Det virker som at Astro har hatt lite fokus på
bruker- og utvikler-opplevelsen rundt å skrive Javascript-kode for nettleseren.

> «Det virker som at Astro har hatt lite fokus på bruker- og
> utvikler-opplevelsen rundt å skrive Javascript-kode for nettleseren.»

Du lurer sikkert på hvorfor jeg ikke bare beholdt React-komponenten? Den
komponenten hadde så mange avhengigheter at det var nødvendig å skrive det om,
så jeg tenkte det var like raskt å skrive det om til Svelte. Så etter en snau
time hadde jeg en ny Svelte-komponent som fungerte lokalt på maskinen. «Klar for
å publisere!» tenkte jeg. Ikke helt, siden alt skrevet i blokken i Svelte ikke
ble synlig på bygde artifakter.

Den raske fiksen ble å bruke _inline style_, som heldigvis fungerte helt fint.
Det blokkerer utvidet bruk av Svelte selvfølgelig, men greit for vårt behov (en
enkel `<iframe />`.)

I etterkant har jeg reflektert litt over det hele. Hadde jeg gjort det igjen,
hadde jeg heller gjort mer for å unngå en avhengighet til Svelte, det vil si at
jeg heller ville _stått i støyen_ og lært mer om hvordan man gjør ting i
Astro-verden. Ikke bare er det rare ting som oppstår, slik som at stilene ikke
fungerer, men det er også en snarvei til å gjøre ting like komplisert som før.
På et eller annet tidspunkt blir det kanskje naturlig å skrive oss bort ifra
Svelte.

Uansett hvor bra det høres ut å kunne bruke andre rammeverk, så tror jeg ikke
det gir mening å faktisk bruke det i utstrakt arm. Jeg har tidligere lekt med
tanken om å gjøre det mulig å skrive om litt og litt fra et rammeverk til et
annet med Astro, det tror jeg ikke er særlig smart.

## View transitions

I Astro er det to linjer for å aktivere View Transitions API-et, og resten
fungerer av seg selv. Vi gikk for en enkel _fade_ mellom alle nettsidene, som
også var standard. Det som er ganske ålreit med Astro sitt oppsett er at du kan
konfigurere hvilke elementer som skal animeres, og hvordan.

Ønsker du at navigasjonen står stille, mens _<main />_-boksen din animeres, kan
du enkelt gjøre det slik:

```xml
---
import { CommonHead } from '../components/CommonHead.astro';
---

<html transition:animate="none">
<head>
	<CommonHead />
</head>
<body>
	<header>
	...
	</header>
	<main transition:animate="slide">
	...
	</main>
</body>
</html>
```

Vi kommer garantert til å utforske hvordan View Transitions kan lage en bedre
brukeropplevelse for nettsiden til Velt på sikt.

## Konklusjon

Astro er bra for nettsider. Det er veldig bra for nettsider som er statisk
genererte, det føles som det meste er skapt for det utgangspunktet.

Integrasjonene med forskjellige CMS-er, og ikke minst Markdown gjør Astro til et
bedre valg enn mange fordi man kan starte enkelt og progressivt ta i bruk
funksjonalitet ettersom behovet viser seg.

Astro støtter også SSR, som man kanskje ikke trenger i de innledende fasene av
en nettside, men godt å ha der etterhvert. Jeg har også testet å
[bruke Bun med Astro](https://docs.astro.build/en/recipes/bun/), som virker
lovende. Litt tidlig for SSR kanskje. Regner med at det dukker opp et
Bun-adapter for Astro etterhvert.

Til sist, må jeg fremheve et av Astros absolutte styrker:
**Bildeoptimalisering**. Med Next.js er det mye støy, spesielt med eksterne
bilder når man skal lage en statisk generert løsning. Det er ikke mye bedre med
Svelte, selv om med Svelte er det naturlig å la Vite håndtere det. Med Astro
bare fungerer det, og det betyr mye på et nettside-prosjekt.

**Så, ja, det er Astro for _nesten_ alle pengene, når vi skal lage nettsider
fremover. For det vi jobber mest med, nemlig nett-applikasjoner, så blir nok
Svelte vårt primære verktøy fremover, og kanskje mer HTMX nå som vi skriver mer
Golang.**
