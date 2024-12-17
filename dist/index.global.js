"use strict";
var KodikWrapper = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    Client: () => Client,
    ClientError: () => ClientError,
    KODIK_API_URL: () => KODIK_API_URL,
    KODIK_PLAYER_DOMAIN: () => KODIK_PLAYER_DOMAIN,
    KODIK_VIDEO_INFO_ENDPOINT: () => KODIK_VIDEO_INFO_ENDPOINT,
    VideoLinks: () => VideoLinks,
    VideoLinksError: () => VideoLinksError,
    kodikPlayerLinkRegexp: () => kodikPlayerLinkRegexp
  });

  // src/errors/video-links.ts
  var VideoLinksError = class extends Error {
    static {
      __name(this, "VideoLinksError");
    }
    /** Error code */
    code;
    /** Error stack */
    stack;
    /** Error data */
    data;
    /** Error cause */
    cause;
    constructor({ code, description, data, cause }) {
      super(description);
      this.code = code;
      this.data = data;
      this.name = this.constructor.name;
      this.cause = cause;
      Error.captureStackTrace(this, this.constructor);
    }
    get [Symbol.toStringTag]() {
      return this.constructor.name;
    }
    toJSON() {
      const json = {};
      for (const key of Object.getOwnPropertyNames(this)) {
        json[key] = this[key];
      }
      return json;
    }
  };

  // src/client.ts
  var KODIK_API_URL = "https://kodikapi.com";
  var endpointsArr = ["countries", "genres", "list", "qualities", "search", "translations", "years", "qualitiesV2", "translationsV2"];
  var remapEndpoints = {
    qualitiesV2: "qualities/v2",
    translationsV2: "translations/v2"
  };
  var ClientError = class extends Error {
    static {
      __name(this, "ClientError");
    }
    name = "ClientError";
  };
  var Client = class _Client {
    static {
      __name(this, "Client");
    }
    KODIK_API_URL;
    constructor({ token, kodikApiUrl }) {
      this.KODIK_API_URL = kodikApiUrl ?? KODIK_API_URL;
      for (const endpointKey of endpointsArr) {
        const endpoint = remapEndpoints[endpointKey] ?? endpointKey;
        this[endpointKey] = (params) => fetch(new URL(`${endpoint}?${new URLSearchParams({ token, ...params }).toString()}`, this.KODIK_API_URL), {
          method: "POST"
        }).then(async (res) => {
          if (res.headers.get("content-type") !== "application/json")
            throw new ClientError(`invalid response (expected content-type application/json, but got ${res.headers.get("content-type")})`);
          const json = await res.json();
          if (typeof json !== "object")
            throw new ClientError(`expected json as an object, but got a ${typeof json}`);
          return json;
        }).then(
          (json) => {
            if ("error" in json)
              throw new ClientError(json.error);
            return json;
          }
        );
      }
    }
    static fromToken(token, options) {
      return new _Client({ ...options, token });
    }
  };

  // src/video-links.ts
  var KODIK_PLAYER_DOMAIN = "kodik.info";
  var KODIK_VIDEO_INFO_ENDPOINT = "/ftor";
  var kodikPlayerLinkRegexp = /^(?<protocol>http[s]?:|)\/\/(?<host>[a-z0-9]+\.[a-z]+)\/(?<type>[a-z]+)\/(?<id>\d+)\/(?<hash>[0-9a-z]+)\/(?<quality>\d+p)(?:.*)$/;
  var VideoLinks = class _VideoLinks {
    static {
      __name(this, "VideoLinks");
    }
    static async parseLink({ extended, link }) {
      if (!link)
        throw new VideoLinksError({
          code: "parse-link-invalid",
          description: "link is not provided",
          data: { link }
        });
      const kodikLink = this.normalizeKodikLink(link);
      if (!kodikPlayerLinkRegexp.test(link))
        throw new VideoLinksError({
          code: "parse-link-invalid",
          description: "link is not valid",
          data: { link }
        });
      const linkParams = kodikPlayerLinkRegexp.exec(kodikLink).groups;
      const { host, hash, id, quality, type } = linkParams;
      const parsedLink = {
        host,
        hash,
        id,
        quality,
        type
      };
      if (!extended)
        return parsedLink;
      const page = await fetch(kodikLink).then((res) => res.text());
      const urlParams = page.match(/var\s+urlParams\s*=\s*'(?<urlParams>[^']+)';/)?.groups?.urlParams;
      const translation = page.match(/var\s+translationId\s*=\s*(?<id>\d+);\s*var\s+translationTitle\s*=\s*"(?<title>[^"]+)";/is)?.groups;
      const skipButtons = page.match(/parseSkipButtons?\("(?<data>[^"]+)"\s*,\s*"(?<type>[^"]+)"\)/is)?.groups;
      const playerSingleUrl = page.match(/src="(?<link>\/assets\/js\/app\.player_single\.[a-z0-9]+\.js)"/is)?.groups?.link;
      if (!urlParams)
        throw new VideoLinksError({
          code: "parse-link-ex-invalid",
          description: "cannot get url params",
          data: { link, page }
        });
      if (!translation)
        throw new VideoLinksError({
          code: "parse-link-ex-invalid",
          description: "cannot get translation",
          data: { link, page }
        });
      const extendedParsedLink = {
        ...parsedLink,
        ex: {
          urlParams: JSON.parse(urlParams),
          translation: {
            id: +translation.id,
            title: translation.title
          },
          skipButtons: { ...skipButtons },
          playerSingleUrl
        }
      };
      return extendedParsedLink;
    }
    static normalizeKodikLink(input) {
      if (input.startsWith("//"))
        return `https:${input}`;
      if (!input.startsWith("http"))
        return new URL(input, `https://${KODIK_PLAYER_DOMAIN}`).toString();
      return input;
    }
    static async getActualVideoInfoEndpoint(playerSingleUrl) {
      const response = await fetch(this.normalizeKodikLink(playerSingleUrl)).then((res) => res.text());
      const endpoint = atob(response.match(/type:"POST",url:atob\("(?<b64str>[^"]+)"\)/i)?.groups?.b64str ?? "") || "/kor";
      return endpoint;
    }
    static async getLinks({ link, videoInfoEndpoint = KODIK_VIDEO_INFO_ENDPOINT }) {
      const { host, quality, ...parsed } = await _VideoLinks.parseLink({ link });
      const url = new URL(
        `${videoInfoEndpoint}?${new URLSearchParams(parsed).toString()}`,
        `https://${host}`
      );
      const videoInfoResponse = await fetch(url);
      if (videoInfoResponse.headers.get("content-type") !== "application/json")
        throw new VideoLinksError({
          code: "get-links-invalid-response",
          description: "videoInfoResponse is not json",
          data: { videoInfoResponse }
        });
      const videoInfoJson = await videoInfoResponse.json();
      if (typeof videoInfoJson !== "object" || videoInfoJson === null)
        throw new VideoLinksError({
          code: "get-links-invalid-response",
          description: "videoInfoJson is not object",
          data: { videoInfoResponse, videoInfoJson }
        });
      if (typeof videoInfoJson.links !== "object")
        throw new VideoLinksError({
          code: "get-links-invalid-response",
          description: "videoInfoJson.links is not object",
          data: { videoInfoResponse, videoInfoJson }
        });
      const links = videoInfoJson.links;
      const zCharCode = "Z".charCodeAt(0);
      for (const [, sources] of Object.entries(links)) {
        for (const source of sources) {
          const decryptedBase64 = source.src.replace(/[a-zA-Z]/g, (e) => {
            let eCharCode = e.charCodeAt(0);
            return String.fromCharCode((eCharCode <= zCharCode ? 90 : 122) >= (eCharCode = eCharCode + 13) ? eCharCode : eCharCode - 26);
          });
          source.src = atob(decryptedBase64);
        }
      }
      return links;
    }
    static parseSkipButtons = (skipButtons) => skipButtons.data.split(",").map((timeline) => {
      const [from, to] = timeline.split("-");
      return { from, to };
    });
  };
  return __toCommonJS(src_exports);
})();
