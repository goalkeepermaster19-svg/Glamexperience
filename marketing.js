/* GLAM Marketing attribution
 * Does not send data to a third party. Captures campaign parameters for this tab/session
 * and appends them to WhatsApp inquiry text so the team can identify the source manually.
 * Analytics pixels are intentionally NOT enabled until GLAM supplies real IDs and consent setup.
 */
(function () {
  'use strict';
  var allowed = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid'];
  var params = new URLSearchParams(window.location.search);
  var attribution = {};
  allowed.forEach(function (key) {
    var value = params.get(key);
    if (value && value.length <= 180) attribution[key] = value.replace(/[<>\r\n]/g, '').trim();
  });
  try {
    var prior = JSON.parse(sessionStorage.getItem('glam_campaign_attribution') || '{}');
    attribution = Object.assign({}, prior, attribution);
    if (Object.keys(attribution).length) sessionStorage.setItem('glam_campaign_attribution', JSON.stringify(attribution));
  } catch (e) { /* session storage can be unavailable in private/restricted contexts */ }

  function campaignText() {
    var keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid'];
    var lines = keys.filter(function (k) { return attribution[k]; }).map(function (k) { return k + ': ' + attribution[k]; });
    return lines.length ? '\n\n— Referencia de campaña —\n' + lines.join('\n') : '';
  }
  document.addEventListener('click', function (event) {
    var link = event.target.closest('a[href*="wa.me/"], a[href*="api.whatsapp.com/"]');
    if (!link || !campaignText()) return;
    try {
      var url = new URL(link.href);
      var msg = url.searchParams.get('text') || '';
      if (!msg.includes('— Referencia de campaña —')) {
        url.searchParams.set('text', msg + campaignText());
        link.href = url.toString();
      }
    } catch (e) { /* leave original WhatsApp link intact */ }
  }, true);

  // También atribuye formularios que construyen el enlace y llaman directamente a window.open().
  var originalOpen = window.open;
  window.open = function (url, target, features) {
    try {
      if (url && campaignText()) {
        var parsed = new URL(String(url), window.location.href);
        if (/wa\.me\/|api\.whatsapp\.com/i.test(parsed.hostname + parsed.pathname)) {
          var message = parsed.searchParams.get('text') || '';
          if (!message.includes('— Referencia de campaña —')) {
            parsed.searchParams.set('text', message + campaignText());
            url = parsed.toString();
          }
        }
      }
    } catch (e) { /* keep original destination */ }
    return originalOpen.call(window, url, target, features);
  };

  // Event hooks are ready for a future analytics integration; no network requests are made here.
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (event) {
    var el = event.target.closest('a,button');
    if (!el) return;
    var label = (el.innerText || el.getAttribute('aria-label') || el.title || '').trim().replace(/\s+/g, ' ').slice(0, 100);
    if (el.matches('a[href*="wa.me/"], a[href*="api.whatsapp.com/"]')) {
      window.dataLayer.push({event:'glam_whatsapp_click', page:location.pathname, label:label});
    }
    if (el.matches('a[href$="invitaciones.html"],a[href$="vajilleria.html"],a[href$="wedding-week.html"]')) {
      window.dataLayer.push({event:'glam_service_navigation', page:location.pathname, destination:el.href});
    }
  });
})();
