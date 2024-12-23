---
title: 'Feature toggles: «Kan kjøre ut kode som ikke er helt ferdig testa»'
image: ./simen-utenfor-hoysterett.jpg
date: 2024-01-25
language: nb-NO
author: Simen A. W. Olsen
syndications:
  - publication: Kode24
    url: https://www.kode24.no/artikkel/feature-toggles-kan-kjore-ut-kode-som-ikke-er-helt-ferdig-testa/80869433
    publishedAt: 2024-01-25
---

_Feature Toggles, feature flags eller funksjonsbrytere_ adresserer en rekke
utfordringer i programvareutvikling. Det hjelper oss teste ut uferdige
funksjoner i produksjonsmiljøer, gjøre A/B-testing og rulle ut nye funksjoner
gradvis.

**Ved å isolere kodeendringer bak disse _bryterne_, kan vi raskt reagere på
problemer, teste på et gitt publikum uten å måtte gjennomføre nye deployments.
Det er som å ha et kontrollpanel for produktets funksjoner.**

Se for deg en av og på-knapp som endrer funksjonaliteten i løsningen når du vil,
uavhengig av deployments. Bryterne lar oss rett og slett endre hvordan et system
oppfører seg uten å endre i koden.

## Selvtillit til å kjøre ut kode

Funksjonsbrytere er i sin enkleste form en _if_-spørring om en funksjonalitet
skal være av eller på. Brytere kan gi oss fleksibilitet gjennom at flere, slik
som andre som er en del av teamet kan styre systemet.

**Personlig liker jeg at det gir selvtillit til å kjøre ut kode som ikke er helt
ferdig testet, som et slags sikkerhetsnett.**

De fleste verktøy for feature toggles har også mulighet for å sende med
kontekst, slik som brukerens ID. Med en slik kontekst kan vi da åpne opp
funksjonalitet for enkelte brukere, for eksempel kunder som tåler at vi sender
med litt utestet kode. Jeg pleier å kombinere å rulle ut ny funksjonalitet til
flere og flere brukere sammen med en _en bryter_, altså at du bruker en brytere
som en slags nødbrems.

De forskjellige måtene å bruke bryterne på kalles ofte for
aktiveringsstrategier. Som regel starter man med en enkel av/på-bryter, som
enten hentes fra en database, et feature toggle-system eller en miljøvariabel.
Det neste er å aktivere funksjonalitet for enkelte brukere (eller grupper av
brukere).

## Et eksempel

Nedenfor ser du en funksjon som lager en _isEnabled_-funksjon basert på
konteksten i en spørring, og som du ser kan enten en funksjon bli skrudd på
basert på om noe ligger som en miljøvariabel eller om brukerens ID er _admin_.

```javascript
export function makeFeatureToggles(context) {
  return {
    isEnabled(name) {
      const envName = ['FEATURE', name].join('_').strToUpper();
      if (process.env[envName]) {
        return true;
      }
      // As an example, we give 'admin' access
      // to all features.
      if (context.user.id === 'admin') {
        return true;
      }

      return false;
    },
  };
}
```

La oss se på et Svelte-eksempel hvor funksjonen vår brukes. Først setter vi opp
\_isEnabled-\_funksjonen på serveren:

```javascript
import { makeFeatureToggles, getContext } from '../utils.js';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  const context = getContext(params);
  const { isEnabled } = makeFeatureToggles(context);
  return { isEnabled };
}
```

På den måten kan vi bruke _isEnabled_ for å visuelt vise forskjellige
grensesnitt utifra hva som er aktivert.

```xml
<script>
	let isEnabled;
</script>

{#if isEnabled('dashboard-v2')}
	<main>
		<div> ... </div>
	</main>
{:else}
	<table>
		...
	</table>
{/if}
```

Det betyr at om _FEATURE_DASHBOARD-V2_ er satt eller brukeren som er logget inn
har bruker id admin så vises blokken med _<main>_ i seg. Alle andre ser
_<table>_. Selv om eksempelet vårt kun hentet ganske statiske ting, slik som
hvilken ID det var eller miljøvariabel, kan man se for seg hvordan en database
og et grensesnitt kan gjøre dette enda mer nyttig.

## Gradvis utrulling

**En viktig aktiveringsstrategi er gradvis utrulling. Dette konseptet fungerer
som en 'dimmer' snarere enn en enkel av/på-bryter, og tillater oss å justere
synligheten av nye funksjoner for brukere i et kontrollert tempo.**

Ved å øke andelen av brukere som får tilgang til funksjonen gradvis, kan vi
overvåke ytelsen og brukertilbakemeldinger i sanntid. Dette minimerer risikoen
ved utrulling av nye funksjoner og gir verdifull innsikt som kan brukes til å
forbedre funksjonen før den blir gjort tilgjengelig for alle.

Heldigvis finnes det fantastiske systemer, som har tenkt gjennom dette. Jeg
liker personlig veldig godt [Unleash](https://www.getunleash.io/). Unleash er et
verktøy for feature toggles, som startet som et internt prosjekt hos FINN.no.
Verktøy som Unleash har tatt gjort funksjonsbrytere mer tilgjengelig og
brukervennlig.

**Jeg tror organisasjoner som har dette i verktøykassa lykkes mer. Del gjerne
dine erfaring og spørsmål i kommentarfeltet!**
