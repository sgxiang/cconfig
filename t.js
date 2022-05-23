
const $ = API("opensea");

var info = {};
var accounts = [
  "beanzofficial",
  "bobutoken",
  "twintigersjacket",
  "https://api.opensea.io/api/v1/asset/0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949/12511/offers?limit=20",
  "https://api.opensea.io/api/v1/asset/0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949/2684/offers?limit=20",
  "https://api.opensea.io/api/v1/asset/0x306b1ea3ecdf94ab739f1910bbda052ed4a9f949/16267/offers?limit=20",
  "arcade-land",
  "azuki",
  "cheers-up-period",
  "pxnghostdivision",
];
var all = 7.36569214 + 1.6568 + 7.87203079 - 0.3867;
var buy = {
  beanzofficial: {
    count: 4,
    price: 7 + 2.22 + 1.12 + 1.11,
    c: 1 - 0.075,
  },
  bobutoken: {
    count: 2,
    price: 0.23 + 0.062,
    c: 1 - 0.075,
  },
  "arcade-land": {
    count: 4,
    price: 4,
    c: 1 - 0.075,
  },
  twintigersjacket: {
    count: 1,
    price: 0.288,
    c: 1 - 0.125,
  },
};
function getInfo(name, tmp) {
  $.http
    .get({
      url:
        name.indexOf("http") != -1
          ? name
          : `https://api.opensea.io/api/v1/collection/${name}`,
      headers: {
        "content-type": "application/json",
        "X-API-KEY": "",
      },
    })
    .then((response) => {
      const data = JSON.parse(response.body);
      if (data) {
        if (data.offers) {
          info[name] = data.offers
            .filter((v) => {
              return v.payment_token_contract.symbol === "WETH";
            })
            .flatMap((v) => {
              let r = parseFloat(v.current_price) / 1000000000000000000;
              return r.toFixed(6);
            })
            .sort()
            .reverse();
          if (info[name] && info[name].length > 0) {
            info[name] = info[name][0];
          } else {
            info[name] = 0;
          }
        } else {
          // console.log(data.collection.stats.floor_price);
          info[name] = {
            price: data.collection.stats.floor_price,
            name: data.collection.name,
          };
        }
      }
      sinfo();
    })
    .catch((err) => {
      // console.log(err);
      if (tmp) {
        sinfo();
      } else {
        setTimeout(() => {
          getInfo(name, true);
        }, 400);
      }
    });
}

var count = 0;

function sinfo() {
  count++;
  if (count < accounts.length) {
    return;
  }
  var msg = "";
  for (let i of accounts) {
    let inf = info[i];
    if (!inf) {
      continue;
    }
    if (inf["price"]) {
      msg += `${inf["name"]}: ${inf["price"]}\n`;
    }
  }
  msg += `\n`;
  for (let i of accounts) {
    let inf = info[i];
    if (!inf) {
      continue;
    }
    if (inf["price"]) {
      // msg += `${inf["name"]}: ${inf["price"]}\n`;
    } else {
      msg += `${i}: ${inf}\n`;
    }
  }
  msg += `\n所有: ${all}\n\n`;
  var _p = 0;
  for (let i of accounts) {
    let inf = buy[i];
    if (!inf || !info[i]) {
      continue;
    }
    if (info[i]["price"]) {
      msg += `${info[i]["name"]}: ${(
        inf["count"] *
        info[i]["price"] *
        inf["c"]
      ).toFixed(6)} - ${inf["price"]} = ${(
        inf["count"] * info[i]["price"] * inf["c"] -
        inf["price"]
      ).toFixed(6)}\n`;
      _p += inf["count"] * info[i]["price"] * inf["c"];
    }
  }
  msg += `\n利润: ${(_p - all).toFixed(6)}`;
  console.log(msg);
  $.notify(`[opensea监控]`, ``, `${msg}`);
  $.done();
}

for (let a of accounts) {
  getInfo(a);
}

// prettier-ignore
/*********************************** API *************************************/
function ENV(){const e="undefined"!=typeof $task,t="undefined"!=typeof $loon,s="undefined"!=typeof $httpClient&&!t,i="function"==typeof require&&"undefined"!=typeof $jsbox;return{isQX:e,isLoon:t,isSurge:s,isNode:"function"==typeof require&&!i,isJSBox:i,isRequest:"undefined"!=typeof $request,isScriptable:"undefined"!=typeof importModule}}
function HTTP(e = { baseURL: "" }) {
  const { isQX: t, isLoon: s, isSurge: i, isScriptable: n, isNode: o } = ENV(),
    r =
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/;
  const u = {};
  return (
    ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach(
      (l) =>
        (u[l.toLowerCase()] = (u) =>
          (function (u, l) {
            l = "string" == typeof l ? { url: l } : l;
            const h = e.baseURL;
            h && !r.test(l.url || "") && (l.url = h ? h + l.url : l.url);
            const a = (l = { ...e, ...l }).timeout,
              c = {
                onRequest: () => {},
                onResponse: (e) => e,
                onTimeout: () => {},
                ...l.events,
              };
            let f, d;
            if ((c.onRequest(u, l), t)) f = $task.fetch({ method: u, ...l });
            else if (s || i || o)
              f = new Promise((e, t) => {
                (o ? require("request") : $httpClient)[u.toLowerCase()](
                  l,
                  (s, i, n) => {
                    s
                      ? t(s)
                      : e({
                          statusCode: i.status || i.statusCode,
                          headers: i.headers,
                          body: n,
                        });
                  }
                );
              });
            else if (n) {
              const e = new Request(l.url);
              (e.method = u),
                (e.headers = l.headers),
                (e.body = l.body),
                (f = new Promise((t, s) => {
                  e.loadString()
                    .then((s) => {
                      t({
                        statusCode: e.response.statusCode,
                        headers: e.response.headers,
                        body: s,
                      });
                    })
                    .catch((e) => s(e));
                }));
            }
            const p = a
              ? new Promise((e, t) => {
                  d = setTimeout(
                    () => (
                      c.onTimeout(),
                      t(`${u} URL: ${l.url} exceeds the timeout ${a} ms`)
                    ),
                    a
                  );
                })
              : null;
            return (
              p ? Promise.race([p, f]).then((e) => (clearTimeout(d), e)) : f
            ).then((e) => c.onResponse(e));
          })(l, u))
    ),
    u
  );
}
function API(e = "untitled", t = !1) {
  const {
    isQX: s,
    isLoon: i,
    isSurge: n,
    isNode: o,
    isJSBox: r,
    isScriptable: u,
  } = ENV();
  return new (class {
    constructor(e, t) {
      (this.name = e),
        (this.debug = t),
        (this.http = HTTP()),
        (this.env = ENV()),
        (this.node = (() => {
          if (o) {
            return { fs: require("fs") };
          }
          return null;
        })()),
        this.initCache();
      Promise.prototype.delay = function (e) {
        return this.then(function (t) {
          return ((e, t) =>
            new Promise(function (s) {
              setTimeout(s.bind(null, t), e);
            }))(e, t);
        });
      };
    }
    initCache() {
      if (
        (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")),
        (i || n) &&
          (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")),
        o)
      ) {
        let e = "root.json";
        this.node.fs.existsSync(e) ||
          this.node.fs.writeFileSync(
            e,
            JSON.stringify({}),
            { flag: "wx" },
            (e) => console.log(e)
          ),
          (this.root = {}),
          (e = `${this.name}.json`),
          this.node.fs.existsSync(e)
            ? (this.cache = JSON.parse(
                this.node.fs.readFileSync(`${this.name}.json`)
              ))
            : (this.node.fs.writeFileSync(
                e,
                JSON.stringify({}),
                { flag: "wx" },
                (e) => console.log(e)
              ),
              (this.cache = {}));
      }
    }
    persistCache() {
      const e = JSON.stringify(this.cache, null, 2);
      s && $prefs.setValueForKey(e, this.name),
        (i || n) && $persistentStore.write(e, this.name),
        o &&
          (this.node.fs.writeFileSync(
            `${this.name}.json`,
            e,
            { flag: "w" },
            (e) => console.log(e)
          ),
          this.node.fs.writeFileSync(
            "root.json",
            JSON.stringify(this.root, null, 2),
            { flag: "w" },
            (e) => console.log(e)
          ));
    }
    write(e, t) {
      if ((this.log(`SET ${t}`), -1 !== t.indexOf("#"))) {
        if (((t = t.substr(1)), n || i)) return $persistentStore.write(e, t);
        if (s) return $prefs.setValueForKey(e, t);
        o && (this.root[t] = e);
      } else this.cache[t] = e;
      this.persistCache();
    }
    read(e) {
      return (
        this.log(`READ ${e}`),
        -1 === e.indexOf("#")
          ? this.cache[e]
          : ((e = e.substr(1)),
            n || i
              ? $persistentStore.read(e)
              : s
              ? $prefs.valueForKey(e)
              : o
              ? this.root[e]
              : void 0)
      );
    }
    delete(e) {
      if ((this.log(`DELETE ${e}`), -1 !== e.indexOf("#"))) {
        if (((e = e.substr(1)), n || i)) return $persistentStore.write(null, e);
        if (s) return $prefs.removeValueForKey(e);
        o && delete this.root[e];
      } else delete this.cache[e];
      this.persistCache();
    }
    notify(e, t = "", l = "", h = {}) {
      const a = h["open-url"],
        c = h["media-url"];
      if (
        (s && $notify(e, t, l, h),
        n &&
          $notification.post(e, t, l + `${c ? "\n多媒体:" + c : ""}`, {
            url: a,
          }),
        i)
      ) {
        let s = {};
        a && (s.openUrl = a),
          c && (s.mediaUrl = c),
          "{}" === JSON.stringify(s)
            ? $notification.post(e, t, l)
            : $notification.post(e, t, l, s);
      }
      if (o || u) {
        const s =
          l + (a ? `\n点击跳转: ${a}` : "") + (c ? `\n多媒体: ${c}` : "");
        if (r) {
          require("push").schedule({ title: e, body: (t ? t + "\n" : "") + s });
        } else console.log(`${e}\n${t}\n${s}\n\n`);
      }
    }
    log(e) {
      this.debug && console.log(`[${this.name}] LOG: ${this.stringify(e)}`);
    }
    info(e) {
      console.log(`[${this.name}] INFO: ${this.stringify(e)}`);
    }
    error(e) {
      console.log(`[${this.name}] ERROR: ${this.stringify(e)}`);
    }
    wait(e) {
      return new Promise((t) => setTimeout(t, e));
    }
    done(e = {}) {
      s || i || n
        ? $done(e)
        : o &&
          !r &&
          "undefined" != typeof $context &&
          (($context.headers = e.headers),
          ($context.statusCode = e.statusCode),
          ($context.body = e.body));
    }
    stringify(e) {
      if ("string" == typeof e || e instanceof String) return e;
      try {
        return JSON.stringify(e, null, 2);
      } catch (e) {
        return "[object Object]";
      }
    }
  })(e, t);
}
/*****************************************************************************/
