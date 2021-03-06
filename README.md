# Denorest

![Denorest](https://raw.githubusercontent.com/slectgit/denorest-docs/master/denologo.png)

Lightweight, Minimalist Framework For REST API 🦕 🚀

```console
$ deno run --allow-net https://deno.land/x/denorest@v4.2/example/hello.ts
```

```typescript
import {
  Req,
  Res,
  Router,
  WebApp,
} from "https://deno.land/x/denorest@v4.2/mod.ts";

const app = new WebApp();
const router = new Router();

router.get("/", (_req: Req, res: Res) => {
  res.reply = "Hello, Deno!";
});

app.set(router);
app.listen(8080);
```

## Features

- Robust routing
- Focus on high performance
- Content negotiation

## Documentation

[Website and Documentation](https://denorest.deno.dev/)

## Philosophy

The Denorest philosophy is to provide small, robust tooling for HTTP servers,
making it a great solution for HTTP APIs.

## Examples

#### Example

```typescript
import {
  Req,
  Res,
  Router,
  WebApp,
} from "https://deno.land/x/denorest@v4.2/mod.ts";

const app = new WebApp();
const router = new Router();

router.get("/", (_req: Req, res: Res) => {
  res.reply = "Hello, TypeScript!";
});

app.set(router);
app.listen(8080);
```

## People

The original author of Denorest is [Parthka](https://github.com/meparthka)

## License

[MIT](https://github.com/slectgit/denorest/blob/main/LICENSE)
