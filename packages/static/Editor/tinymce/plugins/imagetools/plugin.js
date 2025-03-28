/**
 * imagetools (Enhancement 1.1v)
 * The tinymce-plugins is used to import imagetools (Enhancement)
 *
 * https://github.com/Five-great/tinymce-plugins
 *
 * Copyright 2020, Five(Li Hailong) The Chengdu, China https://www.fivecc.cn/
 *
 * Licensed under MIT
 */
(function (n) {
    function K(a, b) { var c = n.document.createElement("canvas"); c.width = a; c.height = b; return c } function Ba(a) { var b = K(a.width, a.height); b.getContext("2d").drawImage(a, 0, 0); return b } function Y(a) {
        return new B(function (b, c) {
            function d() { k(); b(h) } function e() { k(); c("Unable to load data of type " + a.type + ": " + f) } var f = n.URL.createObjectURL(a), h = new n.Image, k = function () { h.removeEventListener("load", d); h.removeEventListener("error", e) }; h.addEventListener("load", d); h.addEventListener("error", e); h.src =
                f; h.complete && d()
        })
    } function Ca(a) { return new B(function (b, c) { var d = new n.XMLHttpRequest; d.open("GET", a, !0); d.responseType = "blob"; d.onload = function () { 200 === this.status && b(this.response) }; d.onerror = function () { if (0 === this.status) { var e = Error("No access to download image"); e.code = 18; e.name = "SecurityError" } else e = Error("Error " + this.status + " downloading image"); c(e) }; d.send() }) } function Da(a) {
        var b = a.split(","); a = /data:([^;]+)/.exec(b[0]); if (!a) return y.none(); a = a[1]; b = n.atob(b[1]); for (var c = b.length,
            d = Math.ceil(c / 1024), e = Array(d), f = 0; f < d; ++f) { for (var h = 1024 * f, k = Math.min(h + 1024, c), r = Array(k - h), w = 0; h < k; ++w, ++h)r[w] = b[h].charCodeAt(0); e[f] = new Uint8Array(r) } return y.some(new n.Blob(e, { type: a }))
    } function Z(a) { return new B(function (b, c) { Da(a).fold(function () { c("uri is not base64: " + a) }, b) }) } function aa(a, b, c) { b = b || "image/png"; return n.HTMLCanvasElement.prototype.toBlob ? new B(function (d, e) { a.toBlob(function (f) { f ? d(f) : e() }, b, c) }) : Z(a.toDataURL(b, c)) } function Ea(a) {
        return Y(a).then(function (b) {
            n.URL.revokeObjectURL(b.src);
            var c = K(b.naturalWidth || b.width, b.naturalHeight || b.height); c.getContext("2d").drawImage(b, 0, 0); return c
        })
    } function Fa(a) { return new B(function (b) { var c = new n.FileReader; c.onloadend = function () { b(c.result) }; c.readAsDataURL(a) }) } function ba(a, b, c) {
        function d(e, f) { return a.then(function (h) { return h.toDataURL(e || "image/png", f) }) } return {
            getType: l(b.type), toBlob: function () { return B.resolve(b) }, toDataURL: function () { return c }, toBase64: function () { return c.split(",")[1] }, toAdjustedBlob: function (e, f) {
                return a.then(function (h) {
                    return aa(h,
                        e, f)
                })
            }, toAdjustedDataURL: d, toAdjustedBase64: function (e, f) { return d(e, f).then(function (h) { return h.split(",")[1] }) }, toCanvas: function () { return a.then(Ba) }
        }
    } function Ga(a) { return Fa(a).then(function (b) { return ba(Ea(a), a, b) }) } function ca(a, b) { return aa(a, b).then(function (c) { return ba(B.resolve(a), c, a.toDataURL()) }) } function Ha(a, b) {
        return a.toCanvas().then(function (c) {
            var d = a.getType(), e = b, f = K(c.width, c.height), h = f.getContext("2d"), k = 0, r = 0; e = 0 > e ? 360 + e : e; if (90 === e || 270 === e) {
                var w = f.width; f.width = f.height;
                f.height = w
            } if (90 === e || 180 === e) k = f.width; if (270 === e || 180 === e) r = f.height; h.translate(k, r); h.rotate(e * Math.PI / 180); h.drawImage(c, 0, 0); return ca(f, d)
        })
    } function Ia(a, b) { return a.toCanvas().then(function (c) { var d = a.getType(), e = K(c.width, c.height), f = e.getContext("2d"); "v" === b ? (f.scale(1, -1), f.drawImage(c, 0, -e.height)) : (f.scale(-1, 1), f.drawImage(c, -e.width, 0)); return ca(e, d) }) } function da(a, b) {
        return E.requestUrlAsBlob(a, {}, b).then(function (c) {
            return 200 > c.status || 300 <= c.status ? ea.handleHttpError(c.status) :
                z.resolve(c.blob)
        })
    } var L = function (a) { var b = a; return { get: function () { return b }, set: function (c) { b = c }, clone: function () { return L(b) } } }, Ja = tinymce.util.Tools.resolve("tinymce.PluginManager"), M = tinymce.util.Tools.resolve("tinymce.util.Tools"), Ka = function () { }, l = function (a) { return function () { return a } }, F = l(!1), R = l(!0), N = function () { return S }, S = function () {
        var a = function (d) { return d.isNone() }, b = function (d) { return d() }, c = function (d) { return d }; a = {
            fold: function (d, e) { return d() }, is: F, isSome: F, isNone: R, getOr: c, getOrThunk: b,
            getOrDie: function (d) { throw Error(d || "error: getOrDie called on none."); }, getOrNull: l(null), getOrUndefined: l(void 0), or: c, orThunk: b, map: N, each: Ka, bind: N, exists: F, forall: R, filter: N, equals: a, equals_: a, toArray: function () { return [] }, toString: l("none()")
        }; Object.freeze && Object.freeze(a); return a
    }(), T = function (a) {
        var b = l(a), c = function () { return e }, d = function (f) { return f(a) }, e = {
            fold: function (f, h) { return h(a) }, is: function (f) { return a === f }, isSome: R, isNone: F, getOr: b, getOrThunk: b, getOrDie: b, getOrNull: b, getOrUndefined: b,
            or: c, orThunk: c, map: function (f) { return T(f(a)) }, each: function (f) { f(a) }, bind: d, exists: d, forall: d, filter: function (f) { return f(a) ? e : S }, toArray: function () { return [a] }, toString: function () { return "some(" + a + ")" }, equals: function (f) { return f.is(a) }, equals_: function (f, h) { return f.fold(F, function (k) { return h(a, k) }) }
        }; return e
    }, y = { some: T, none: N, from: function (a) { return null === a || void 0 === a ? S : T(a) } }, t = function () {
        function a(g, m) { return function () { return g.apply(m, arguments) } } function b(g) {
            var m = this; null === this._state ?
                this._deferreds.push(g) : r(function () { var p = m._state ? g.onFulfilled : g.onRejected; if (null === p) (m._state ? g.resolve : g.reject)(m._value); else { try { var q = p(m._value) } catch (x) { g.reject(x); return } g.resolve(q) } })
        } function c(g) { try { if (g === this) throw new TypeError("A promise cannot be resolved with itself."); if (g && ("object" === typeof g || "function" === typeof g)) { var m = g.then; if ("function" === typeof m) { h(a(m, g), a(c, this), a(d, this)); return } } this._state = !0; this._value = g; e.call(this) } catch (p) { d.call(this, p) } } function d(g) {
            this._state =
            !1; this._value = g; e.call(this)
        } function e() { for (var g = 0, m = this._deferreds; g < m.length; g++)b.call(this, m[g]); this._deferreds = [] } function f(g, m, p, q) { this.onFulfilled = "function" === typeof g ? g : null; this.onRejected = "function" === typeof m ? m : null; this.resolve = p; this.reject = q } function h(g, m, p) { var q = !1; try { g(function (x) { q || (q = !0, m(x)) }, function (x) { q || (q = !0, p(x)) }) } catch (x) { q || (q = !0, p(x)) } } var k = function (g) {
            if ("object" !== typeof this) throw new TypeError("Promises must be constructed via new"); if ("function" !== typeof g) throw new TypeError("not a function");
            this._value = this._state = null; this._deferreds = []; h(g, a(c, this), a(d, this))
        }, r = k.immediateFn || "function" === typeof window.setImmediate && window.setImmediate || function (g) { n.setTimeout(g, 1) }, w = Array.isArray || function (g) { return "[object Array]" === Object.prototype.toString.call(g) }; k.prototype.catch = function (g) { return this.then(null, g) }; k.prototype.then = function (g, m) { var p = this; return new k(function (q, x) { b.call(p, new f(g, m, q, x)) }) }; k.all = function () {
            for (var g = [], m = 0; m < arguments.length; m++)g[m] = arguments[m];
            var p = Array.prototype.slice.call(1 === g.length && w(g[0]) ? g[0] : g); return new k(function (q, x) { function fa(ha, C) { try { if (C && ("object" === typeof C || "function" === typeof C)) { var ia = C.then; if ("function" === typeof ia) { ia.call(C, function (U) { fa(ha, U) }, x); return } } p[ha] = C; 0 === --La && q(p) } catch (U) { x(U) } } if (0 === p.length) return q([]); for (var La = p.length, O = 0; O < p.length; O++)fa(O, p[O]) })
        }; k.resolve = function (g) { return g && "object" === typeof g && g.constructor === k ? g : new k(function (m) { m(g) }) }; k.reject = function (g) {
            return new k(function (m,
                p) { p(g) })
        }; k.race = function (g) { return new k(function (m, p) { for (var q = 0; q < g.length; q++)g[q].then(m, p) }) }; return k
    }, B = window.Promise ? window.Promise : t(), ja = function (a) { return Ga(a) }, ka = tinymce.util.Tools.resolve("tinymce.util.Delay"), z = tinymce.util.Tools.resolve("tinymce.util.Promise"), V = tinymce.util.Tools.resolve("tinymce.util.URI"), G = {
        getImageSize: function (a) {
            var b = a.style.width; var c = a.style.height; if (b || c) return /^[0-9\.]+px$/.test(b) && /^[0-9\.]+px$/.test(c) ? { w: parseInt(b, 10), h: parseInt(c, 10) } : null;
            b = a.width; c = a.height; return b && c ? { w: parseInt(b, 10), h: parseInt(c, 10) } : null
        }, setImageSize: function (a, b) { if (b) { var c = a.style.width; var d = a.style.height; if (c || d) a.style.width = b.w + "px", a.style.height = b.h + "px", a.removeAttribute("data-mce-style"); c = a.width; d = a.height; if (c || d) a.setAttribute("width", b.w), a.setAttribute("height", b.h) } }, getNaturalImageSize: function (a) { return { w: a.naturalWidth, h: a.naturalHeight } }
    }, P = function (a, b) { for (var c = 0, d = a.length; c < d; c++) { var e = a[c]; if (b(e, c)) return y.some(e) } return y.none() };
    (function (a) { return function (b) { if (null === b) b = "null"; else { var c = typeof b; b = "object" === c && (Array.prototype.isPrototypeOf(b) || b.constructor && "Array" === b.constructor.name) ? "array" : "object" === c && (String.prototype.isPrototypeOf(b) || b.constructor && "String" === b.constructor.name) ? "string" : c } return b === a } })("function")(Array.from); var E = {
        traverse: function (a, b) { a = b.reduce(function (c, d) { return null !== c && void 0 !== c ? c[d] : void 0 }, a); return null !== a && void 0 !== a ? a : null }, readBlob: function (a) {
            return new z(function (b) {
                var c =
                    new n.FileReader; c.onload = function (d) { b(d.target.result) }; c.readAsText(a)
            })
        }, requestUrlAsBlob: function (a, b, c) { return new z(function (d) { var e = new n.XMLHttpRequest; e.onreadystatechange = function () { 4 === e.readyState && d({ status: e.status, blob: this.response }) }; e.open("GET", a, !0); e.withCredentials = c; M.each(b, function (f, h) { e.setRequestHeader(h, f) }); e.responseType = "blob"; e.send() }) }, parseJson: function (a) { try { var b = JSON.parse(a) } catch (c) { } return b }
    }, Ma = [{ code: 404, message: "Could not find Image Proxy" }, {
        code: 403,
        message: "Rejected request"
    }, { code: 0, message: "Incorrect Image Proxy URL" }], Na = [{ type: "key_missing", message: "The request did not include an api key." }, { type: "key_not_found", message: "The provided api key could not be found." }, { type: "domain_not_trusted", message: "The api key is not valid for the request origins." }], la = function (a) { return "ImageProxy HTTP error: " + P(Ma, function (b) { return a === b.code }).fold(l("Unknown ImageProxy error"), function (b) { return b.message }) }, ma = function (a) { a = la(a); return z.reject(a) },
        na = function (a) { return P(Na, function (b) { return b.type === a }).fold(l("Unknown service error"), function (b) { return b.message }) }, Oa = function (a, b) { return E.readBlob(b).then(function (c) { c = E.parseJson(c); c = E.traverse(c, ["error", "type"]); c = "ImageProxy Service error: " + (c ? na(c) : "Invalid JSON in service error message"); return z.reject(c) }) }, ea = { handleServiceErrorResponse: function (a, b) { return 400 === a || 403 === a || 500 === a ? Oa(a, b) : ma(a) }, handleHttpError: ma, getHttpErrorMsg: la, getServiceErrorMsg: na }, Pa = function (a, b) {
            var c =
                -1 === a.indexOf("?") ? "?" : "&"; return /[?&]apiKey=/.test(a) || !b ? a : a + c + "apiKey=" + encodeURIComponent(b)
        }, Qa = function (a, b) { var c = { "Content-Type": "application/json;charset=UTF-8", "tiny-api-key": b }; return E.requestUrlAsBlob(Pa(a, b), c, !1).then(function (d) { return 200 > d.status || 300 <= d.status ? ea.handleServiceErrorResponse(d.status, d.blob) : z.resolve(d.blob) }) }, oa = function () { return W(0, 0) }, W = function (a, b) { return { major: a, minor: b } }, Q = {
            nu: W, detect: function (a, b) {
                b = String(b).toLowerCase(); if (0 === a.length) a = oa(); else {
                    a: {
                        for (var c =
                            0; c < a.length; c++) { var d = a[c]; if (d.test(b)) { a = d; break a } } a = void 0
                    } a = a ? W(Number(b.replace(a, "$1")), Number(b.replace(a, "$2"))) : { major: 0, minor: 0 }
                } return a
            }, unknown: oa
        }, D = function (a, b) { return function () { return b === a } }, pa = function (a) { var b = a.current; return { current: b, version: a.version, isEdge: D("Edge", b), isChrome: D("Chrome", b), isIE: D("IE", b), isOpera: D("Opera", b), isFirefox: D("Firefox", b), isSafari: D("Safari", b) } }, Ra = function () { return pa({ current: void 0, version: Q.unknown() }) }; l("Edge"); l("Chrome"); l("IE"); l("Opera");
    l("Firefox"); l("Safari"); var A = function (a, b) { return function () { return b === a } }, qa = function (a) { var b = a.current; return { current: b, version: a.version, isWindows: A("Windows", b), isiOS: A("iOS", b), isAndroid: A("Android", b), isOSX: A("OSX", b), isLinux: A("Linux", b), isSolaris: A("Solaris", b), isFreeBSD: A("FreeBSD", b), isChromeOS: A("ChromeOS", b) } }, Sa = function () { return qa({ current: void 0, version: Q.unknown() }) }; l("Windows"); l("iOS"); l("Android"); l("Linux"); l("OSX"); l("Solaris"); l("FreeBSD"); l("ChromeOS"); var ra = function (a,
        b) { var c = String(b).toLowerCase(); return P(a, function (d) { return d.search(c) }) }, sa = { detectBrowser: function (a, b) { return ra(a, b).map(function (c) { var d = Q.detect(c.versionRegexes, b); return { current: c.name, version: d } }) }, detectOs: function (a, b) { return ra(a, b).map(function (c) { var d = Q.detect(c.versionRegexes, b); return { current: c.name, version: d } }) } }, v = function (a, b) { return -1 !== a.indexOf(b) }, H = /.*?version\/ ?([0-9]+)\.([0-9]+).*/; t = function (a) { return function (b) { return v(b, a) } }; H = [{
            name: "Edge", versionRegexes: [/.*?edge\/ ?([0-9]+)\.([0-9]+)$/],
            search: function (a) { return v(a, "edge/") && v(a, "chrome") && v(a, "safari") && v(a, "applewebkit") }
        }, { name: "Chrome", versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/, H], search: function (a) { return v(a, "chrome") && !v(a, "chromeframe") } }, { name: "IE", versionRegexes: [/.*?msie ?([0-9]+)\.([0-9]+).*/, /.*?rv:([0-9]+)\.([0-9]+).*/], search: function (a) { return v(a, "msie") || v(a, "trident") } }, { name: "Opera", versionRegexes: [H, /.*?opera\/([0-9]+)\.([0-9]+).*/], search: t("opera") }, {
            name: "Firefox", versionRegexes: [/.*?firefox\/ ?([0-9]+)\.([0-9]+).*/],
            search: t("firefox")
        }, { name: "Safari", versionRegexes: [H, /.*?cpu os ([0-9]+)_([0-9]+).*/], search: function (a) { return (v(a, "safari") || v(a, "mobile/")) && v(a, "applewebkit") } }]; t = [{ name: "Windows", search: t("win"), versionRegexes: [/.*?windows nt ?([0-9]+)\.([0-9]+).*/] }, { name: "iOS", search: function (a) { return v(a, "iphone") || v(a, "ipad") }, versionRegexes: [/.*?version\/ ?([0-9]+)\.([0-9]+).*/, /.*cpu os ([0-9]+)_([0-9]+).*/, /.*cpu iphone os ([0-9]+)_([0-9]+).*/] }, { name: "Android", search: t("android"), versionRegexes: [/.*?android ?([0-9]+)\.([0-9]+).*/] },
        { name: "OSX", search: t("mac os x"), versionRegexes: [/.*?mac os x ?([0-9]+)_([0-9]+).*/] }, { name: "Linux", search: t("linux"), versionRegexes: [] }, { name: "Solaris", search: t("sunos"), versionRegexes: [] }, { name: "FreeBSD", search: t("freebsd"), versionRegexes: [] }, { name: "ChromeOS", search: t("cros"), versionRegexes: [/.*?chrome\/([0-9]+)\.([0-9]+).*/] }]; var ta = { browsers: l(H), oses: l(t) }; t = L(function (a, b) {
            var c = ta.browsers(), d = ta.oses(); c = sa.detectBrowser(c, a).fold(Ra, pa); d = sa.detectOs(d, a).fold(Sa, qa); var e = d.isiOS() && !0 ===
                /ipad/i.test(a), f = d.isiOS() && !e, h = d.isiOS() || d.isAndroid(), k = h || b("(pointer:coarse)"); b = e || !f && h && b("(min-device-width:768px)"); h = f || h && !b; a = c.isSafari() && d.isiOS() && !1 === /safari/i.test(a); var r = !h && !b && !a; a = { isiPad: l(e), isiPhone: l(f), isTablet: l(b), isPhone: l(h), isTouch: l(k), isAndroid: d.isAndroid, isiOS: d.isiOS, isWebView: l(a), isDesktop: l(r) }; return { browser: c, os: d, deviceType: a }
        }(n.navigator.userAgent, function (a) { return n.window.matchMedia(a).matches })); var I = function (a) {
            if (null === a || void 0 === a) throw Error("Node cannot be null or undefined");
            return { dom: l(a) }
        }, J = { fromHtml: function (a, b) { b = (b || n.document).createElement("div"); b.innerHTML = a; if (!b.hasChildNodes() || 1 < b.childNodes.length) throw n.console.error("HTML does not have a single root node", a), Error("HTML must have a single root node"); return I(b.childNodes[0]) }, fromTag: function (a, b) { a = (b || n.document).createElement(a); return I(a) }, fromText: function (a, b) { a = (b || n.document).createTextNode(a); return I(a) }, fromDom: I, fromPoint: function (a, b, c) { a = a.dom(); return y.from(a.elementFromPoint(b, c)).map(I) } },
            Ta = n.Node.ELEMENT_NODE, Ua = function (a, b) { a = a.dom(); if (a.nodeType !== Ta) return !1; if (void 0 !== a.matches) return a.matches(b); if (void 0 !== a.msMatchesSelector) return a.msMatchesSelector(b); if (void 0 !== a.webkitMatchesSelector) return a.webkitMatchesSelector(b); if (void 0 !== a.mozMatchesSelector) return a.mozMatchesSelector(b); throw Error("Browser lacks native selectors"); }; t.get().browser.isIE(); "undefined" !== typeof n.window || Function("return this;")(); var Va = function (a, b) { return P(a.dom().childNodes, function (c) { return b(J.fromDom(c)) }).map(J.fromDom) },
                ua = function (a, b) { return Va(a, function (c) { return Ua(c, b) }) }, Wa = 0, X = function (a) { var b = a.selection.getNode(); return a.dom.is(b, "figure") ? ua(J.fromDom(b), "img") : y.some(J.fromDom(b)) }, Xa = function (a, b) { return (b = b.match(/\/([^\/\?]+)?\.(?:jpeg|jpg|png|gif)(?:\?|$)/i)) ? a.dom.encode(b[1]) : null }, va = function (a, b) { b = b.src; return 0 === b.indexOf("data:") || 0 === b.indexOf("blob:") || (new V(b)).host === a.documentBaseURI.host }, wa = function (a, b) { return -1 !== M.inArray(a.getParam("imagetools_cors_hosts", [], "string[]"), (new V(b.src)).host) },
                Ya = function (a, b) { return y.from(a.getParam("imagetools_fetch_image", null, "function")).fold(function () { var c = b.src; if (wa(a, b)) { var d = b.src; c = -1 !== M.inArray(a.getParam("imagetools_credentials_hosts", [], "string[]"), (new V(b.src)).host); d = da(d, c) } else va(a, b) ? (d = b.src, d = 0 === d.indexOf("data:") ? Z(d) : Ca(d)) : (c += (-1 === c.indexOf("?") ? "?" : "&") + "url=" + encodeURIComponent(b.src), d = (d = a.getParam("api_key", a.getParam("imagetools_api_key", "", "string"), "string")) ? Qa(c, d) : da(c, !1)); return d }, function (c) { return c(b) }) },
                xa = function (a, b) { var c; return (c = a.editorUpload.blobCache.getByUri(b.src)) ? z.resolve(c.blob()) : Ya(a, b) }, Za = function (a, b) { var c = ka.setEditorTimeout(a, function () { a.editorUpload.uploadImagesAuto() }, a.getParam("images_upload_timeout", 3E4, "number")); b.set(c) }, ya = function (a) { ka.clearTimeout(a.get()) }, za = function (a, b, c, d, e, f) {
                    return b.toBlob().then(function (h) {
                        var k; var r = a.editorUpload.blobCache; var w = e.src; if (a.getParam("images_reuse_filename", !1, "boolean")) if (k = r.getByUri(w)) { w = k.uri(); var g = k.name() } else g =
                            Xa(a, w); k = r.create({ id: "imagetools" + Wa++, blob: h, base64: b.toBase64(), uri: w, name: g }); r.add(k); a.undoManager.transact(function () { function m() { a.$(e).off("load", m); a.nodeChanged(); c ? a.editorUpload.uploadImagesAuto() : (ya(d), Za(a, d)) } a.$(e).on("load", m); f && a.$(e).attr({ width: f.w, height: f.h }); a.$(e).attr({ src: k.blobUri() }).removeAttr("data-mce-src") }); return k
                    })
                }, Aa = function (a, b, c, d) {
                    return function () {
                        return X(a).fold(function () { a.notificationManager.open({ text: "Could not find selected image", type: "error" }) },
                            function (e) { return a._scanForImages().then(function () { return xa(a, e.dom()) }).then(ja).then(c).then(function (f) { return za(a, f, !1, b, e.dom(), d) }, function (f) { a.notificationManager.open({ text: f, type: "error" }) }) })
                    }
                }, u = {
                    rotate: function (a, b, c) { return function () { var d = X(a).fold(function () { return null }, function (e) { return (e = G.getImageSize(e.dom())) ? { w: e.h, h: e.w } : null }); return Aa(a, b, function (e) { return Ha(e, c) }, d)() } }, flip: function (a, b, c) { return function () { return Aa(a, b, function (d) { return Ia(d, c) })() } }, getEditableImage: function (a,
                        b) { var c = function (d) { return a.dom.is(d, "img:not([data-mce-object],[data-mce-placeholder])") && (va(a, d) || wa(a, d) || a.settings.imagetools_proxy | 1) }; return a.dom.is(b, "figure") ? ua(J.fromDom(b), "img").map(function (d) { return c(d.dom()) ? y.some(d.dom()) : y.none() }) : c(b) ? y.some(b) : y.none() }, cancelTimedUpload: ya, findBlob: xa, getSelectedImage: X, handleDialogBlob: function (a, b, c, d, e) {
                            return new z(function (f) {
                                Y(e).then(function (h) {
                                    var k = G.getNaturalImageSize(h); (d.w !== k.w || d.h !== k.h) && G.getImageSize(c) && G.setImageSize(c,
                                        k); n.URL.revokeObjectURL(h.src); return e
                                }).then(ja).then(function (h) { return za(a, h, !0, b, c) }, function () { })
                            })
                        }
                }, $a = l("save-state"), ab = l("disable"), bb = l("enable"), cb = {
                    makeOpen: function (a, b) {
                        return function () {
                            var c = function (f) {
                                return {
                                    title: "Edit Image", size: "large", body: { type: "panel", items: [{ type: "imagetools", name: "imagetools", label: "Edit Image", currentState: f }] }, buttons: [{ type: "cancel", name: "cancel", text: "Cancel" }, { type: "submit", name: "save", text: "Save", primary: !0, disabled: !0 }], onSubmit: function (h) {
                                        var k =
                                            h.getData().imagetools.blob; d.each(function (r) { e.each(function (w) { u.handleDialogBlob(a, b, r.dom(), w, k) }) }); h.close()
                                    }, onCancel: function () { }, onAction: function (h, k) { switch (k.name) { case $a(): k.value ? h.enable("save") : h.disable("save"); break; case ab(): h.disable("save"); h.disable("cancel"); break; case bb(): h.enable("cancel") } }
                                }
                            }, d = u.getSelectedImage(a), e = d.map(function (f) { return G.getNaturalImageSize(f.dom()) }); u.getSelectedImage(a).each(function (f) {
                                u.getEditableImage(a, f.dom()).each(function (h) {
                                    u.findBlob(a,
                                        f.dom()).then(function (k) { k = { blob: k, url: n.URL.createObjectURL(k) }; a.windowManager.open(c(k)) })
                                })
                            })
                        }
                    }
                }, db = { register: function (a, b) { M.each({ mceImageRotateLeft: u.rotate(a, b, -90), mceImageRotateRight: u.rotate(a, b, 90), mceImageFlipVertical: u.flip(a, b, "v"), mceImageFlipHorizontal: u.flip(a, b, "h"), mceEditImage: cb.makeOpen(a, b) }, function (c, d) { a.addCommand(d, c) }) } }, eb = {
                    setup: function (a, b, c) {
                        a.on("NodeChange", function (d) {
                            var e = c.get(); e && e.src !== d.element.src && (u.cancelTimedUpload(b), a.editorUpload.uploadImagesAuto(),
                                c.set(null)); u.getEditableImage(a, d.element).each(c.set)
                        })
                    }
                }, fb = {
                    register: function (a) {
                        var b = function (c) { return function () { return a.execCommand(c) } }; a.ui.registry.addButton("rotateleft", { tooltip: "Rotate counterclockwise", icon: "rotate-left", onAction: b("mceImageRotateLeft") }); a.ui.registry.addButton("rotateright", { tooltip: "Rotate clockwise", icon: "rotate-right", onAction: b("mceImageRotateRight") }); a.ui.registry.addButton("flipv", { tooltip: "Flip vertically", icon: "flip-vertically", onAction: b("mceImageFlipVertical") });
                        a.ui.registry.addButton("fliph", { tooltip: "Flip horizontally", icon: "flip-horizontally", onAction: b("mceImageFlipHorizontal") }); a.ui.registry.addButton("editimage", { tooltip: "Edit image", icon: "edit-image", onAction: b("mceEditImage"), onSetup: function (c) { var d = function () { u.getSelectedImage(a).each(function (e) { e = u.getEditableImage(a, e.dom()).isNone(); c.setDisabled(e) }) }; a.on("NodeChange", d); return function () { a.off("NodeChange", d) } } }); a.ui.registry.addButton("imageoptions", {
                            tooltip: "Image options", icon: "image-options",
                            onAction: b("mceImage")
                        }); a.ui.registry.addContextMenu("", { update: function (c) { return u.getEditableImage(a, c).fold(function () { return [] }, function (d) { return [{ text: "Edit image", icon: "edit-image", onAction: b("mceEditImage") }] }) } })
                    }
                }, gb = {
                    register: function (a) {
                        a.ui.registry.addContextToolbar("imagetools", {
                            items: a.getParam("imagetools_toolbar", "alignleft aligncenter alignright rotateleft rotateright flipv fliph editimage imageoptions"), predicate: function (b) { return u.getEditableImage(a, b).isSome() },
                            position: "node", scope: "node"
                        })
                    }
                }; (function () { Ja.add("imagetools", function (a) { var b = L(0), c = L(null); db.register(a, b); fb.register(a); gb.register(a); eb.setup(a, b, c) }) })()
})(window);
