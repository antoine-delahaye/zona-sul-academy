# Zona Sul Academy — guide de contribution

Site du club de jiu-jitsu brésilien et grappling Zona Sul Academy (Orléans).
Monorepo npm workspaces à deux paquets :

| Workspace | Rôle                                                                |
| --------- | ------------------------------------------------------------------- |
| `blog/`   | Front Angular 22 en SSR, déployé comme Cloudflare Worker            |
| `cms/`    | Sanity Studio 6 : schémas de contenu, déployé sur `*.sanity.studio` |

## Commandes

```bash
npm run start:blog      # ng serve
npm run start:cms       # sanity dev
npm run build           # build des deux workspaces
npm run lint            # ESLint sur les deux workspaces
npm test                # tests unitaires du blog (Vitest)
npm run format          # Prettier sur tout le dépôt
```

Node est épinglé (`.nvmrc`, `volta`) : Angular 22 exige `^24.15.0 || >=26`.

Les scripts d'installation ne sont pas approuvés (garde `allow-scripts` de npm 11.17+),
et c'est volontaire : les binaires de plateforme (esbuild, workerd) sont livrés dans
les paquets optionnels, donc build, lint, tests et `wrangler deploy` fonctionnent
depuis un `npm ci` propre sans autoriser un seul script.

## Monorepo et outillage d'éditeur

npm hisse les paquets de façon non garantie : un même paquet peut se retrouver dans
`node_modules/` ou dans `blog/node_modules/` d'une installation à l'autre. D'où
deux règles :

- Les `$schema` de `blog/angular.json` et `blog/wrangler.jsonc` pointent vers des
  **URL distantes** (unpkg), pas vers un chemin relatif dans `node_modules`.
- `@angular/language-server` et `typescript` sont déclarés à la **racine** : les
  serveurs de langage (Zed, Neovim…) les cherchent dans le `node_modules` de la
  racine du projet ouvert. Sans `typescript` à la racine, npm y laissait la 5.9.3
  tirée en peer par `typescript-eslint`, que le compilateur Angular 22 refuse.

## Flux de données

Le blog lit Sanity en **GROQ via `fetch`**, sans SDK, pour garder le bundle Worker
minimal.

- `blog/src/data/sanity.config.ts` — projectId, dataset, version d'API. Source unique.
- `blog/src/data/services/groq.ts` — toutes les requêtes GROQ, avec une projection
  d'image partagée.
- `blog/src/data/services/sanity.service.ts` — exécute les requêtes.

Règles :

- **Ne jamais interpoler une valeur dans une requête GROQ.** Utiliser `$nom` et
  passer la valeur en paramètre à `SanityService.query`.
- Chaque `resource()` porte un `id`, ce qui fait passer les données par le transfer
  state SSR au lieu d'être refetchées à l'hydratation.
- Les slugs sont des `string` simples, pas le type `slug` de Sanity : les requêtes
  comparent `slug == $slug`. Changer cela casserait toutes les requêtes.
- Le texte alternatif des images vient de `image.alt`, avec repli sur
  `asset->altText` puis sur un libellé explicite (`sanityImageAlt`).
- Le Portable Text est aplati avec `portableTextBlockToPlainText` : un paragraphe
  formaté arrive découpé en plusieurs spans.

## Conventions Angular 22

- Composants standalone. Ne pas écrire `standalone: true` (défaut depuis v20).
- **Ne pas écrire `changeDetection: ChangeDetectionStrategy.OnPush`** : c'est le
  défaut depuis la v22.
- Services : décorateur `@Service()`, pas `@Injectable({providedIn: 'root'})`.
  Utiliser `@Service({autoProvided: false})` pour un service fourni manuellement.
- Injection par `inject()`, en tête de classe.
- État en signaux : `signal`, `computed`, `linkedSignal`, `resource`. Pas de
  `BehaviorSubject`, pas de pipe `async`.
- Entrées/sorties via `input()` / `output()`. Les paramètres de route et de query
  arrivent directement en `input()` grâce à `withComponentInputBinding()`.
- Bindings d'hôte dans l'objet `host` du décorateur, jamais `@HostBinding` /
  `@HostListener`.
- Templates : flux de contrôle natif (`@if`, `@for`, `@switch`), `class`/`style`
  bindings (pas `ngClass` / `ngStyle`), pas de `$any()` — corriger le type.
- Images via `NgOptimizedImage` (`ngSrc`). Le loader Sanity est configuré dans
  `app.config.ts`.
- Lazy loading pour toutes les routes.

## Accessibilité

Le lint applique `templateAccessibility`. Attendu : conformité WCAG AA, contrastes
suffisants, gestion du focus, `alt` pertinent (chaîne vide pour une image
décorative), navigation par liens `<a>` et non par `<button>`.

## Styles

Tailwind 4 + daisyUI 5, dans `blog/src/styles.css`.

- Les utilitaires `font-basic` / `font-gravesend` viennent du bloc `@theme` : une
  police ajoutée doit y être déclarée, sinon la classe n'existe pas.
- Attention aux noms de classes daisyUI 4 périmés (`btm-nav`, `card-compact`) :
  utiliser `dock` / `dock-active` / `dock-label` et `card-sm`.
- Les composants de page portent leur grille dans `host.class`.

## Formulaire de contact

Le formulaire de `/contact` poste sur `/api/contact`, une route du Worker interceptée
dans `blog/src/server.ts` **avant** Angular, et traitée par
`blog/src/contact.endpoint.ts`.

- Les règles de validation vivent dans `blog/src/shared/contact/contact.model.ts` et
  sont appliquées **des deux côtés** : le navigateur pour les erreurs en ligne, le
  Worker parce que rien n'empêche de poster directement sur l'endpoint. Ne pas
  dupliquer une règle d'un seul côté.
- Les champs sur une ligne sont normalisés avant l'envoi : sans cela, un CR ou un LF
  dans le nom ou l'objet permettrait d'injecter des en-têtes dans le courriel.
- L'envoi passe par le binding `send_email` de Cloudflare Email Routing, pas par un
  prestataire tiers : `env.SEND_EMAIL.send({from, to, subject, text})` laisse workerd
  composer le MIME, donc aucune librairie mail n'est nécessaire.
- **Le destinataire n'est pas `contact@zonasulacademy.fr`.** Le binding n'accepte
  qu'une _adresse de destination vérifiée_ du compte (Email Routing → Destination
  addresses), ce qui n'est pas la même chose qu'une adresse personnalisée de la
  zone : `contact@` est une règle de routage qui forwarde vers
  `zonasulacademy@gmail.com`, et lui écrire échoue avec `destination address is not
a verified address`. Le Worker écrit donc à la boîte derrière, même boîte de
  réception. `CONTACT_EMAIL` reste l'adresse publique affichée aux visiteurs, et
  `RECIPIENT` dans `contact.endpoint.ts` doit rester égal à `destination_address`
  de `wrangler.jsonc`.
- L'expéditeur (`formulaire@zonasulacademy.fr`) n'a pas besoin d'exister comme boîte,
  seulement d'être sur la zone. Le visiteur est joignable via `Reply-To`.
- L'anti-robot est Cloudflare Turnstile. La _site key_ est publique et vit dans
  `blog/src/shared/turnstile/turnstile.config.ts` ; la _secret key_ est un secret
  Worker (`wrangler secret put TURNSTILE_SECRET_KEY`). La vérification échoue
  fermée : erreur réseau ou réponse illisible comptent comme un échec.
- `ng serve` n'a ni binding ni secret : l'endpoint y répond 503 et le formulaire
  affiche le repli mailto. Pour l'essayer réellement, `npm run preview -w blog`
  (wrangler dev) avec un `blog/.dev.vars` copié depuis `blog/.dev.vars.example`.

## Déploiement

`blog/wrangler.jsonc` décrit un Worker avec assets statiques.

- `public/_headers` ne s'applique **qu'aux assets statiques**. Cloudflare ne
  l'applique pas aux réponses générées par le Worker, donc les en-têtes de
  sécurité des pages SSR sont définis dans `blog/src/server.ts`. Garder les deux
  cohérents.
- Tout nouvel hôte servant le site doit être ajouté à `security.allowedHosts`
  dans `angular.json`, sinon le SSR répond 400.
- Après modification de `wrangler.jsonc`, relancer `npm run cf-typegen -w blog`.
