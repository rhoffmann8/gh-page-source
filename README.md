# gh-page-source

Build system for my main Github page. Uses Gulp as the task runner and Angular for the site itself.

Run test server:

```
npm run serve
npm run serve:prod
```

Build files to `dist` folder:

```
npm run build
npm run build:prod
```

`src` dir should include `data` (for content JSON files), `posts`, and `images` folders, but since these are subject to change more than the actual code they are .gitignored here.