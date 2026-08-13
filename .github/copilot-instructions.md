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

## Déploiement

`blog/wrangler.jsonc` décrit un Worker avec assets statiques.

- `public/_headers` ne s'applique **qu'aux assets statiques**. Cloudflare ne
  l'applique pas aux réponses générées par le Worker, donc les en-têtes de
  sécurité des pages SSR sont définis dans `blog/src/server.ts`. Garder les deux
  cohérents.
- Tout nouvel hôte servant le site doit être ajouté à `security.allowedHosts`
  dans `angular.json`, sinon le SSR répond 400.
- Après modification de `wrangler.jsonc`, relancer `npm run cf-typegen -w blog`.
