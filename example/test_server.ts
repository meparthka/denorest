import { bodyParse, Req, Res, Router, WebApp } from "../mod.ts";
import v2 from "./test_hand.ts";

let PORT: number = 8888;
let sysPORT = Deno.env.get("PORT");

if (sysPORT !== undefined) {
  PORT = parseInt(sysPORT);
}

let app = new WebApp();
app.allowMoreExp(true);

app.headers({
  "Content-Type": "application/json",
  author: "pka",
  "x-powered-by": "DenoFS/Denorest",
  "Set-Cookie": "LESTTIME=" + Date(),
});
let mainRoute = new Router();
let secRout = new Router();
let v1API = new Router();

v1API.use((_, res: Res) => {
  //res.reply = "Not Available";
});

v1API.all("/user", async (req: any, res: any) => {
  res.reply = "hello, world";
});

v1API.all("/login", async (req: Req, res: Res) => {
  let file;
  try {
    file = await Deno.open("/home/parthka/Videos/q.mkv", { read: true });
  } catch (e) {
    console.log(e);
    return;
  }
  const readableStream = file.readable;
  res.headers = {
    "Content-Type": "video/mp4",
    "Content-Length": String((await file.stat()).size),
  };
  res.reply = readableStream;
});

let numBlocksPerRequest = 30;
let blockSize = 16_384;
let videoBlockSize = blockSize * numBlocksPerRequest;

v1API.all("/login1", async (req: Req, res: Res) => {
  console.log("123");

  let file;
  try {
    file = await Deno.open("/home/parthka/Videos/video.mp4", { read: true });
  } catch (e) {
    console.log(e);
    return;
  }
  const readableStream = file.readable;

  let videoSize = (await file.stat()).size;

  const startIndex = req.headers?.has("range")
    ? Number(req.headers?.get("range")?.replace(/\D/g, "")?.trim())
    : 0;

  const endIndex = Math.min(startIndex + videoBlockSize, videoSize);

  if (startIndex > 0) {
    await Deno.seek(file.rid, startIndex, Deno.SeekMode.Start);
  }

  res.status = 206;
  res.headers = {
    "Accept-Ranges": "bytes",
    "Content-Type": "video/mp4",
    "Content-Length": `${endIndex - startIndex}`,
    "Content-Range": `bytes ${startIndex}-${endIndex}/${videoSize}`,
  };
  res.reply = file.readable;
});

mainRoute.use((req: Req, res: Res) => {
  req.state.token = "ad8adkmdw";
  //console.log(`path: ${req.url?.pathname} time: ${Date()}`);
});

await mainRoute.get("/", async (req: any, res: any) => {
  /* console.log(pathParse(req)); */
  /* user.insertOne({
    username: "parthka",
    password: "123"
  }) */
  res.reply = "pathParse(req)";
  res.headers = {
    "Content-Type": "text/html",
  };
});

mainRoute.get("/123", async (req: any, res: any) => {
  res.status = 200;
  res.headers = {
    "Content-Type": "text/html",
    "Set-Cookie": "USER_TOKN=de87df",
  };
  res.reply = `
        <html>
            <body>
                <form action="/helloworld" method="post">
                    <input type="text" name="f_name">
                    <input type="text" name="l_name">
                    <input type="submit" name="submit">
                </form>
                <form enctype="multipart/form-data" action="/helloworld" method="post">
                    <input type="text" name="f_name">
                    <input type="text" name="l_name">
                    <input type="submit" name="submit">
                </form>
            </body>
        </html>
    `;
});

mainRoute.all("/123", async (req: any, res: any) => {
  res.reply = "Hello, World! 123";
});

mainRoute.post("/", async (req: any, res: any) => {
  let p = await bodyParse(req);
  console.log(p.text);
  res.status = 200;
  res.headers = {
    "Content-Type": "text/html",
    "Set-Cookie": "USER_TOKN=de87df",
    "X-Firefox-Spdy": "h2",
  };
  res.reply = p;
});

mainRoute.all("/helloworld", async (req: any, res: any) => {
  res.headers = {
    "Content-Type": "text/html",
    "Set-Cookie": "AUTHOR=parthka",
  };
  let s = await bodyParse(req);
  res.reply = `${s.values("f_name")[0]}`;
});

secRout.all("/", (req: Req, res: Res) => {
  res.reply = "Hello, World";
});

secRout.pre("/v1", v1API);

secRout.pre("/v2", v2);

secRout.all("/v3", async () => {
}, [async (req: Req, res: Res) => {
  console.log(req);
}, async (_, res: Res) => {
  res.reply = "v3";
}]);

mainRoute.all("/apix", (req: Req, res: Res) => {
  console.log("apix");
});
mainRoute.pre("/:api", secRout);

app.set(mainRoute);

app.listen(PORT);

app.set404((_req: Req, res: Res) => {
  res.status = 404;
  res.headers = {
    "Content-Type": "text/html",
  };
  res.reply = "hello, I Am 404!";
});

app.set500((_req: Req, res: Res) => {
  res.headers = {
    "Content-Type": "application/json",
  };
  res.reply = JSON.stringify({ error: "Request error" });
});
