/*!
 * SyncPulse Links — renderizador compartilhado (página pública e prévia do admin).
 * Monta o DOM com textContent/atributos (nunca innerHTML com dados do banco).
 */
(function (global) {
  'use strict';

  var HEX = /^#[0-9a-fA-F]{6}$/;
  var SAFE_URL = /^(https?:\/\/|mailto:|tel:)/i;

  function color(value, fallback) {
    return typeof value === 'string' && HEX.test(value) ? value : fallback;
  }

  function initials(name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'SP';
    var first = parts[0].charAt(0);
    var last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function normalizeHandle(handle) {
    var h = String(handle || '').trim();
    if (!h) return '';
    return h.charAt(0) === '@' ? h : '@' + h;
  }

  function render(container, data, options) {
    options = options || {};
    var profile = (data && data.profile) || {};
    var sections = (data && data.sections) || [];

    var bg = color(profile.bg_color, '#0b1b46');
    var bg2 = color(profile.bg_color_2, '#1e3a8a');
    var fg = color(profile.text_color, '#ffffff');
    var btnBg = color(profile.button_bg_color, '#2563eb');
    var btnFg = color(profile.button_text_color, '#ffffff');

    var page = el('div', 'spl-page');
    page.style.setProperty('--spl-bg', bg);
    page.style.setProperty('--spl-bg-2', bg2);
    page.style.setProperty('--spl-fg', fg);

    var inner = el('div', 'spl-inner');
    page.appendChild(inner);

    var header = el('header', 'spl-header');
    var avatar = el('div', 'spl-avatar');
    if (profile.photo_url && /^https:\/\//i.test(profile.photo_url)) {
      var img = el('img');
      img.src = profile.photo_url;
      img.alt = 'Foto de ' + (profile.name || 'perfil');
      img.width = 112;
      img.height = 112;
      img.decoding = 'async';
      avatar.appendChild(img);
    } else {
      avatar.classList.add('spl-avatar-initials');
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = initials(profile.name);
    }
    header.appendChild(avatar);
    header.appendChild(el('h1', 'spl-name', profile.name || 'Kadson Pedro'));

    var bioText = String(profile.bio || '').trim();
    if (bioText) {
      var bio = el('div', 'spl-bio');
      bioText.split(/\r?\n/).forEach(function (line) {
        if (line.trim()) bio.appendChild(el('p', null, line.trim()));
      });
      header.appendChild(bio);
    }
    var handle = normalizeHandle(profile.handle);
    if (handle) header.appendChild(el('p', 'spl-handle', handle));
    inner.appendChild(header);

    var visibleSections = sections.filter(function (s) {
      return s && s.active !== false;
    });

    visibleSections.forEach(function (section) {
      var items = (section.items || []).filter(function (it) {
        return it && it.active !== false && SAFE_URL.test(String(it.url || ''));
      });
      if (!items.length && !options.showEmpty) return;
      var block = el('section', 'spl-section');
      if (section.title) block.appendChild(el('h2', 'spl-section-title', section.title));
      var list = el('div', 'spl-buttons');
      items.forEach(function (item) {
        var a = el('a', 'spl-btn', item.label || 'Link');
        a.href = item.url;
        a.style.background = color(item.bg_color, btnBg);
        a.style.color = color(item.text_color, btnFg);
        if (/^https?:/i.test(item.url)) {
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
        }
        if (options.disableLinks) {
          a.addEventListener('click', function (e) { e.preventDefault(); });
        }
        list.appendChild(a);
      });
      if (!items.length) list.appendChild(el('p', 'spl-empty', 'Nenhum link ativo nesta seção.'));
      block.appendChild(list);
      inner.appendChild(block);
    });

    var footer = el('footer', 'spl-footer');
    var brand = el('a', null, 'SyncPulse');
    brand.href = 'https://www.syncpulse.com.br';
    brand.target = '_blank';
    brand.rel = 'noopener noreferrer';
    if (options.disableLinks) brand.addEventListener('click', function (e) { e.preventDefault(); });
    footer.appendChild(brand);
    inner.appendChild(footer);

    container.replaceChildren(page);
    return page;
  }

  global.SyncPulseLinks = { render: render, initials: initials, safeUrl: SAFE_URL, hex: HEX };
})(window);
