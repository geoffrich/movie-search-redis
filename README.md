# movie-search-redis

Demo for a blog post about SvelteKit + Serverless Redis using [Upstash](https://www.upstash.com/).

To run locally, you will need to create a `.env` files with the required keys. See `sample.env` for an example.

You will need a [TMDB API](https://developers.themoviedb.org/3/getting-started/introduction) key. If no Redis connection string is provided, the app will attempt to connect to a local Redis server.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
