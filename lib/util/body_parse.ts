// Copyright 2022 Parthka. All rights reserved. MIT license.

// deno-lint-ignore-file

import {
  MultipartFormData,
  MultipartReader,
} from "https://deno.land/std@0.140.0/mime/mod.ts";
import { StringReader } from "https://deno.land/std@0.140.0/io/readers.ts";
import { Req } from "../types.ts";

/** Get application/json parser function */
class GetJSON {
  public field; // body object
  public text; // body text
  constructor(
    req: Req,
  ) {
    this.text = req.body;
    // parse string to object
    try {
      this.field = JSON.parse(req.body || "");
    } catch (_) {
      this.field = {};
    }
  }
  // return undefined
  files = () => {
    return undefined;
  };
  // return undefined
  values = () => {
    return undefined;
  };
  // return value
  value = (key: string | number) => {
    return this.field[key];
  };
}

/** Get application/x-www-form-urlencoded parser function  */
class GetURL {
  public field: Record<string, string> = {}; // body object
  public text; // body text
  constructor(
    req: Req,
  ) {
    this.text = req.body;
    // parse string to object
    if (req.body) {
      const o = req.body.split("&");
      for (const p of o) {
        const l = p.split("=");
        try {
          this.field[l[0]] = l[1] ? decodeURI(l[1]) : "";
        } catch (_) {
          this.field[l[0]] = l[1] || "";
        }
      }
    }
  }
  // return undefined
  files = () => {
    return undefined;
  };
  // return undefined
  values = () => {
    return undefined;
  };
  // return value
  value = (key: string | number) => {
    return this.field[key];
  };
}

/** Get other body type parser function. */
class GetOther {
  public field: Record<string, string> = {}; // body object
  public text; // body text
  constructor(
    req: Req,
  ) {
    this.text = req.body;
  }
  // return undefined
  files = () => {
    return undefined;
  };
  // return undefined
  values = () => {
    return undefined;
  };
  // return value
  value = (_k: string | number) => {
    return undefined;
  };
}

/** Get multipart/form-data parser function. */
const getForm = async (
  req: Req,
  b: string[],
): Promise<MultipartFormData | string> => {
  if (b[1] && req.body) {
    const sr = new StringReader(req.body);
    const mr = new MultipartReader(sr, b[1].split("=")[1]);
    return await mr.readForm(20 << 20);
  } else {
    return req.body || "";
  }
};

/** Parse Request Payload function. */
export const bodyParse = async (
  req: Req,
): Promise<any> => {
  if (req.body && req.headers) {
    const reqType = String(req.headers.get("content-type")).split("; ");
    switch (reqType[0]) {
      case "application/json":
        return new GetJSON(req); // if content-type is application/json
      case "multipart/form-data":
        return await getForm(req, reqType); // if content-type is multipart/form-data
      case "application/x-www-form-urlencoded":
        return new GetURL(req); // if content-type is x-www-form-urlencoded
      default:
        return new GetOther(req);
    }
  } else {
    return new GetOther(req);
  }
};
