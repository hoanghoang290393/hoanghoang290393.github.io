// Mockfit page counter: one "view" per browser session (with the referring site / utm tag) and one "dl" when the
// Mac App Store button is clicked. No cookies, no IDs, no IP stored — the server keeps daily totals only (see privacy.html).
(function () {
  try {
    var E = 'https://check.macappkit.com/v1/web', S = window.sessionStorage, L = location;
    var post = function (o) {
      var b = JSON.stringify(o);
      if (navigator.sendBeacon) navigator.sendBeacon(E, new Blob([b], { type: 'text/plain' }));
      else fetch(E, { method: 'POST', body: b, keepalive: true, mode: 'no-cors' });
    };
    var land = L.pathname, v = null;
    try { v = JSON.parse(S.getItem('mf_v') || 'null'); } catch (e) {}
    if (!v) {
      var q = new URLSearchParams(L.search);
      v = { src: q.get('utm_source') || q.get('ref') || '', cmp: q.get('utm_campaign') || '', ref: document.referrer || '', land: land };
      try { S.setItem('mf_v', JSON.stringify(v)); } catch (e) {}
      post({ app: 'mockfit', ev: 'view', src: v.src, cmp: v.cmp, ref: v.ref, land: v.land, lang: navigator.language || '' });
    }
    document.addEventListener('click', function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a[data-stat="appstore"]') : null;
      if (a) post({ app: 'mockfit', ev: 'dl', src: v.src, cmp: v.cmp, ref: v.ref, land: v.land, lang: navigator.language || '' });
    }, true);
  } catch (e) {}
})();
