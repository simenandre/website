---
title: «Sender du meg .env-fila?» spør folk. «Nei!»
image: ./simen-startuplab.jpg
date: 2024-09-23
language: nb-NO
author: Simen A. W. Olsen
syndications:
  - publication: Kode24
    url: https://www.kode24.no/artikkel/sender-du-meg-env-fila-spor-folk-nei-svarer-simen/81970100
    publishedAt: 2024-09-23
---

**– Sender du meg .env-fila som du har?**

Nei, er svaret. Bare kjør _task generate:env_.

For jeg tror jeg snakker på vegne av mange når jeg sier at miljøvariabler er et
veldig fint utgangspunkt, men så vokser prosjektet, så faller ting ut av synk
blant team-medlemmer.

> «Problemet er at det gjør ting mer komplekst, og det vil vi ikke.»

## Noe enklere

I mange år har jeg brukt _validerte miljøvarabler_, og i Node.js-prosjekter har
jeg vært veldig fornøyd med [_envalid_](https://github.com/af/envalid) som
verktøy for å oppnå det.

Nå skriver jeg stadig mer Golang, og har vært innom Apples-prosjekt
[pkl](https://pkl-lang.org/). Det er lovende, men jeg sokner nok til noe
enklere, slik som Kelsey Hightower’s
[_envconfig_](https://github.com/kelseyhightower/envconfig).

**Nøkkelordet er _noe enklere_. Vi kan selvfølgelig bruke verktøy som
[Google Secret Manager](https://cloud.google.com/security/products/secret-manager?hl=en)
eller [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/). Hashicorps
egen [Vault](https://www.vaultproject.io/) er også bra. Problemet er at det gjør
ting mer komplekst, og det vil vi ikke.**

Som
[grug sier, så er kompleksitet vår evige fiende](https://grugbrain.dev/#grug-on-complexity).
Jeg opplever at for de aller fleste behov, så er faktisk miljøvariabler den
beste måten å gjøre konfigurasjon i en applikasjon på.

Problemet er bare at for å kjøre en applikasjon så trenger man mer enn det man
kan sette som en standardverdi. Det er faktiske hemmeligheter, som kanskje må
distribueres og byttes ut løpende. Det er klønete.

Heldigvis finnes det løsninger, mine venner.

## Felles hvelv til hemmelighetene

Konseptet jeg har søkt etter er en eller annen måte hvor vi kan sette
miljøvariabler, hvor den henter hemmelighetene enten hver gang vi kjører
tjenesten eller hvor vi enkelt kan hente de nye oppdaterte hemmelighetene. Det
tror jeg er den optimale løsningen.

**Hos oss i Padeia, har vi foreløpig bestemt oss for å reduseres systemene vi
bruker. Vi har allerede tatt i bruk 1Password, så vår løsning baserer seg på at
hemmelighetene våre ligger lagret i eget felles hvelv.**

1Password har et genialt lite
[kommandolinje-verktøy](https://1password.com/downloads/command-line) som
støtter å _injecte_ hemmeligheter inn i en fil. Løsningen vår ble derfor at vi
har en mal for .env-filene våre (`env.template`). Basert på den malen, genererer
vi midlertidige .env filer.

```bash
op inject -i ./config/env.template -o .env
```

Det gir kanskje mer mening om jeg viser deg et eksempel på en mal.

```ini
APP_ENV=development
HELLO=world?
GOOGLE_CLIENT_ID={{ op://felles-hvelv/google-oauth/client_id }}
GOOGLE_CLIENT_SECRET={{ op://felles-hvelv/google-oauth/client_secret }}
TURSO_DATABASE_URL={{ op://felles-hvelv/turso/url }}
TURSO_DATABASE_TOKEN={{ op://felles-hvelv/turso/token }}
```

Det 1Password gjør er å erstatte template delene (_{{ op:// … }}_) med de
faktiske hemmelighetene. Du kan oppnå tilsvarende med Bitwarden, for de som
bruker det. Sjekk ut
[Bitwarden Secrets Manage](https://bitwarden.com/products/secrets-manager/)r.

## Få hemmeligheter fra ekstern tjeneste

**Et annet alternativ er å injecte miljøvariabler fra en ekstern tjeneste.**

Pulumi, som etter min mening er en av de bedre verktøyene for å håndtere
infrastruktur som kode, har noe som kalles _ESC_. Her kan du konfigurere
miljøvariabler som dette:

```yaml
values:
  tag: pr-14
  google:
    clientId: dette-er-en-klient-id
    clientSecret: dette-er-en-hemmelig-nøkkel
  accountingApiToken:
    fn::secret: # Pulumi støtter å kryptere nøklene
      ciphertext: oifjoiwjefgoiwjefoijweg
  turso:
    accessToken: ${1password.secrets.turso-token} # Samt hente fra 1Password!
    databaseURL: libsql://hello-world-padeia.turso.io
    qualifiedDatabaseURL: ${turso.databaseURL}?authToken=${turso.accessToken}
  pulumiConfig:
    # ...
  environmentVariables:
    APP_ENV=development HELLO=world? GOOGLE_CLIENT_ID=${google.clientId}
    GOOGLE_CLIENT_SECRET=${google.clientSecret}
    TURSO_DATABASE_URL=${turso.databaseURL}
    TURSO_DATABASE_TOKEN=${turso.accessToken}
```

Basert på en konfigurasjon, eller _miljø_, som beskrevet over kan du hente ut
miljøvariabler med denne kommandoen:

```bash
pulumi env run <navnet på miljøet> -- npm run
```

Som du kanskje så i eksempelet mitt over, så kan Pulumi hente inn hemmeligheter
fra andre steder. Den støtter både 1Password og mer typiske slik som Vault, AWS
Secrets Manager og Google Secret Manager. Det betyr at etterhvert som vi vokser
oss ut av 1Password sin metode over, kan vi ta i bruk Pulumis verktøy uten
særlig med migreringsarbeid.

Vi har ikke låst oss fast i noe mer enn miljøvariabler, som jeg tenker er en bra
ting.
