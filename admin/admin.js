(function () {
  'use strict';

  var cfg = window.SYNCPULSE_LINKS_CONFIG;
  var SPL = window.SyncPulseLinks;
  var sb = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' }
  });

  var T = { profile: 'syncpulse_links_profile', sections: 'syncpulse_links_sections', items: 'syncpulse_links_items' };
  var PROFILE_DEFAULTS = {
    id: 1, name: 'Kadson Pedro', bio: '', handle: '', photo_url: null, page_title: '',
    bg_color: '#0b1b46', bg_color_2: '#1e3a8a', text_color: '#ffffff',
    button_bg_color: '#2563eb', button_text_color: '#ffffff'
  };

  var state = { profile: null, sections: [], items: [], user: null };
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  document.getElementById('public-link').href = cfg.publicPageUrl;
  document.getElementById('public-link-2').href = cfg.publicPageUrl;

  // ---------- utilidades ----------
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k.slice(0, 2) === 'on') node.addEventListener(k.slice(2), v);
      else if (k in node && typeof v !== 'string') node[k] = v;
      else node.setAttribute(k, v === true ? '' : v);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return node;
  }

  var toastTimer;
  function toast(msg, kind) {
    var t = $('#toast');
    t.textContent = msg;
    t.className = 'adm-toast' + (kind ? ' is-' + kind : '');
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, kind === 'error' ? 6000 : 2200);
  }

  function errText(error) {
    if (!error) return 'Erro desconhecido.';
    if (error.code === '42501') return 'Sem permissão para salvar.';
    if (error.code === '23514') return 'Valor inválido. Confira o link (https://, mailto: ou tel:) e as cores.';
    return error.message || String(error);
  }

  function setStatus(id, text, kind) {
    var s = document.getElementById(id);
    if (!s) return;
    s.textContent = text;
    s.className = 'adm-status' + (kind ? ' is-' + kind : '');
  }

  function normalizeUrl(raw) {
    var u = String(raw || '').trim();
    if (!u) return '';
    if (SPL.safeUrl.test(u)) return u;
    if (/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(u)) return 'mailto:' + u;
    if (/^\+?[\d\s().-]{8,}$/.test(u)) return 'tel:' + u.replace(/[^\d+]/g, '');
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return ''; // outros esquemas (javascript:, data:…) não são aceitos
    return 'https://' + u.replace(/^\/+/, '');
  }

  function bySort(a, b) { return (a.position - b.position) || String(a.created_at).localeCompare(String(b.created_at)); }
  function sectionItems(sectionId) { return state.items.filter(function (i) { return i.section_id === sectionId; }).sort(bySort); }

  // ---------- views ----------
  function showView(name) {
    ['loading', 'login', 'denied', 'app'].forEach(function (v) { $('#view-' + v).hidden = v !== name; });
    $('#topbar-actions').hidden = name !== 'app';
  }

  // ---------- prévia ----------
  function renderPreview() {
    var data = {
      profile: state.profile,
      sections: state.sections.slice().sort(bySort).map(function (s) {
        return Object.assign({}, s, { items: sectionItems(s.id) });
      })
    };
    SPL.render($('#preview'), data, { disableLinks: true });
    renderPhoto();
  }

  function renderPhoto() {
    var box = $('#photo-preview');
    box.replaceChildren();
    if (state.profile && state.profile.photo_url) {
      box.appendChild(el('img', { src: state.profile.photo_url, alt: 'Foto atual' }));
    } else {
      box.appendChild(el('span', { text: SPL.initials(state.profile && state.profile.name) }));
    }
    $('#btn-photo-remove').hidden = !(state.profile && state.profile.photo_url);
  }

  // ---------- perfil ----------
  function fillProfileForm() {
    $$('[data-profile]').forEach(function (input) {
      var key = input.getAttribute('data-profile');
      input.value = state.profile[key] == null ? '' : state.profile[key];
    });
  }

  function saveProfile(patch) {
    setStatus('status-profile', 'Salvando…');
    return sb.from(T.profile).update(patch).eq('id', 1).select().single().then(function (res) {
      if (res.error) { setStatus('status-profile', 'Erro ao salvar', 'error'); toast(errText(res.error), 'error'); return; }
      state.profile = res.data;
      setStatus('status-profile', 'Salvo ✓', 'ok');
    });
  }

  $$('[data-profile]').forEach(function (input) {
    var key = input.getAttribute('data-profile');
    input.addEventListener('input', function () { state.profile[key] = input.value; renderPreview(); });
    input.addEventListener('change', function () {
      var val = input.value.trim();
      if (key === 'name' && !val) { toast('O nome não pode ficar vazio.', 'error'); input.value = state.profile.name = 'Kadson Pedro'; }
      var patch = {};
      patch[key] = key === 'name' ? (val || 'Kadson Pedro') : (val || null);
      if (input.type === 'color') patch[key] = input.value;
      saveProfile(patch);
    });
  });

  $('#photo-input').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type)) { toast('Formato não suportado. Use PNG, JPG, WEBP ou GIF.', 'error'); return; }
    if (file.size > 5 * 1024 * 1024) { toast('A imagem passa de 5 MB.', 'error'); return; }
    var ext = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' }[file.type];
    var path = 'profile/avatar-' + Date.now() + '.' + ext;
    setStatus('status-profile', 'Enviando foto…');
    var oldUrl = state.profile.photo_url;
    sb.storage.from(cfg.storageBucket).upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false })
      .then(function (res) {
        if (res.error) throw res.error;
        var url = sb.storage.from(cfg.storageBucket).getPublicUrl(path).data.publicUrl;
        return saveProfile({ photo_url: url }).then(function () { removeStoredPhoto(oldUrl); renderPreview(); toast('Foto atualizada.'); });
      })
      .catch(function (err) { setStatus('status-profile', 'Erro no envio', 'error'); toast(errText(err), 'error'); });
  });

  function removeStoredPhoto(url) {
    var marker = '/storage/v1/object/public/' + cfg.storageBucket + '/';
    if (!url || url.indexOf(marker) === -1) return;
    var path = decodeURIComponent(url.split(marker)[1].split('?')[0]);
    sb.storage.from(cfg.storageBucket).remove([path]);
  }

  $('#btn-photo-remove').addEventListener('click', function () {
    if (!confirm('Remover a foto do perfil? As iniciais voltam a aparecer.')) return;
    var oldUrl = state.profile.photo_url;
    saveProfile({ photo_url: null }).then(function () { removeStoredPhoto(oldUrl); renderPreview(); });
  });

  // ---------- seções e links ----------
  function renumber(list, table) {
    var updates = [];
    list.forEach(function (row, idx) {
      if (row.position !== idx) {
        row.position = idx;
        updates.push(sb.from(table).update({ position: idx }).eq('id', row.id));
      }
    });
    return Promise.all(updates).then(function (results) {
      var bad = results.filter(function (r) { return r.error; })[0];
      if (bad) { toast(errText(bad.error), 'error'); return reload(); }
    });
  }

  function move(list, index, delta, table) {
    var target = index + delta;
    if (target < 0 || target >= list.length) return;
    var tmp = list[index]; list[index] = list[target]; list[target] = tmp;
    list.forEach(function (row, idx) { row.position = -1 - idx; }); // força renumeração
    renumber(list, table).then(function () { renderSections(); renderPreview(); });
  }

  function updateRow(table, row, patch, statusEl) {
    if (statusEl) { statusEl.textContent = 'Salvando…'; statusEl.className = 'adm-status'; }
    return sb.from(table).update(patch).eq('id', row.id).select().single().then(function (res) {
      if (res.error) {
        if (statusEl) { statusEl.textContent = 'Erro'; statusEl.className = 'adm-status is-error'; }
        toast(errText(res.error), 'error');
        return false;
      }
      Object.assign(row, res.data);
      if (statusEl) { statusEl.textContent = 'Salvo ✓'; statusEl.className = 'adm-status is-ok'; }
      return true;
    });
  }

  function iconBtn(label, title, onclick, disabled) {
    return el('button', { type: 'button', class: 'adm-icon-btn', title: title, 'aria-label': title, onclick: onclick, disabled: !!disabled, text: label });
  }

  function toggle(checked, label, onchange) {
    var input = el('input', { type: 'checkbox', checked: !!checked, onchange: onchange });
    return el('label', { class: 'adm-toggle' }, [input, el('span', { class: 'adm-toggle-ui', 'aria-hidden': 'true' }), el('span', { text: label })]);
  }

  function colorField(value, fallback, label, oninput, onchange) {
    var input = el('input', { type: 'color', value: value || fallback, oninput: oninput, onchange: onchange });
    return el('label', { class: 'adm-color-mini', title: label }, [input, el('span', { text: label })]);
  }

  function renderItem(section, item, idx, list) {
    var status = el('span', { class: 'adm-status' });
    var label = el('input', { value: item.label, maxlength: '80', 'aria-label': 'Texto do botão',
      oninput: function () { item.label = label.value; renderPreview(); },
      onchange: function () {
        var v = label.value.trim();
        if (!v) { toast('O texto do botão não pode ficar vazio.', 'error'); return reload(); }
        updateRow(T.items, item, { label: v }, status);
      } });
    var url = el('input', { value: item.url, maxlength: '2000', inputmode: 'url', 'aria-label': 'Link (URL)', placeholder: 'https://…',
      onchange: function () {
        var v = normalizeUrl(url.value);
        if (!v) { toast('Link inválido. Use https://, mailto: ou tel:.', 'error'); url.value = item.url; return; }
        url.value = v;
        updateRow(T.items, item, { url: v }, status).then(renderPreview);
      } });

    var p = state.profile;
    var bg = colorField(item.bg_color, p.button_bg_color, 'Fundo',
      function (e) { item.bg_color = e.target.value; renderPreview(); },
      function (e) { updateRow(T.items, item, { bg_color: e.target.value }, status); });
    var fg = colorField(item.text_color, p.button_text_color, 'Texto',
      function (e) { item.text_color = e.target.value; renderPreview(); },
      function (e) { updateRow(T.items, item, { text_color: e.target.value }, status); });

    var sectionSelect = null;
    if (state.sections.length > 1) {
      sectionSelect = el('select', { 'aria-label': 'Mover para a seção', onchange: function () {
        var newId = sectionSelect.value;
        var pos = sectionItems(newId).length;
        updateRow(T.items, item, { section_id: newId, position: pos }, status).then(function () {
          renumber(sectionItems(section.id), T.items).then(function () { renderSections(); renderPreview(); });
        });
      } }, state.sections.slice().sort(bySort).map(function (s) {
        return el('option', { value: s.id, selected: s.id === section.id, text: s.id === section.id ? 'Seção: ' + s.title : 'Mover para: ' + s.title });
      }));
    }

    return el('div', { class: 'adm-item' + (item.active ? '' : ' is-off') }, [
      el('div', { class: 'adm-item-swatch', style: 'background:' + (item.bg_color || p.button_bg_color) + ';color:' + (item.text_color || p.button_text_color), text: 'Aa' }),
      el('div', { class: 'adm-item-fields' }, [
        label, url,
        el('div', { class: 'adm-item-meta' }, [
          bg, fg,
          toggle(item.active, 'Visível', function (e) {
            updateRow(T.items, item, { active: e.target.checked }, status).then(function () { renderSections(); renderPreview(); });
          }),
          sectionSelect,
          status
        ])
      ]),
      el('div', { class: 'adm-item-actions' }, [
        iconBtn('↑', 'Subir link', function () { move(list, idx, -1, T.items); }, idx === 0),
        iconBtn('↓', 'Descer link', function () { move(list, idx, 1, T.items); }, idx === list.length - 1),
        iconBtn('🗑', 'Apagar link', function () {
          if (!confirm('Apagar o link "' + item.label + '"?')) return;
          sb.from(T.items).delete().eq('id', item.id).then(function (res) {
            if (res.error) return toast(errText(res.error), 'error');
            state.items = state.items.filter(function (i) { return i.id !== item.id; });
            renumber(sectionItems(section.id), T.items).then(function () { renderSections(); renderPreview(); toast('Link apagado.'); });
          });
        })
      ])
    ]);
  }

  function renderAddItemForm(section) {
    var label = el('input', { placeholder: 'Texto do botão (ex.: Instagram)', maxlength: '80', 'aria-label': 'Texto do novo botão', required: true });
    var url = el('input', { placeholder: 'Link (ex.: instagram.com/seuusuario)', maxlength: '2000', inputmode: 'url', 'aria-label': 'Link do novo botão', required: true });
    var form = el('form', { class: 'adm-add-item', novalidate: true, onsubmit: function (e) {
      e.preventDefault();
      var l = label.value.trim();
      var u = normalizeUrl(url.value);
      if (!l) { toast('Escreva o texto do botão.', 'error'); label.focus(); return; }
      if (!u) { toast('Link inválido. Use https://, mailto: ou tel:.', 'error'); url.focus(); return; }
      var pos = sectionItems(section.id).length;
      sb.from(T.items).insert({ section_id: section.id, label: l, url: u, position: pos, active: true }).select().single().then(function (res) {
        if (res.error) return toast(errText(res.error), 'error');
        state.items.push(res.data);
        renderSections(); renderPreview(); toast('Link adicionado.');
      });
    } }, [label, url, el('button', { type: 'submit', class: 'adm-btn adm-btn-secondary', text: '+ Adicionar link' })]);
    return form;
  }

  function renderSections() {
    var wrap = $('#sections');
    wrap.replaceChildren();
    var sections = state.sections.sort(bySort);
    if (!sections.length) {
      wrap.appendChild(el('div', { class: 'adm-card adm-center adm-muted', text: 'Nenhuma seção ainda. Clique em “+ Nova seção”.' }));
    }
    sections.forEach(function (section, idx) {
      var status = el('span', { class: 'adm-status' });
      var title = el('input', { class: 'adm-section-title', value: section.title, maxlength: '60', 'aria-label': 'Título da seção',
        oninput: function () { section.title = title.value; renderPreview(); },
        onchange: function () {
          var v = title.value.trim();
          if (!v) { toast('O título da seção não pode ficar vazio.', 'error'); return reload(); }
          updateRow(T.sections, section, { title: v }, status);
        } });
      var items = sectionItems(section.id);
      var card = el('div', { class: 'adm-card adm-section' + (section.active ? '' : ' is-off') }, [
        el('div', { class: 'adm-section-head' }, [
          title,
          el('div', { class: 'adm-item-actions' }, [
            iconBtn('↑', 'Subir seção', function () { move(sections, idx, -1, T.sections); }, idx === 0),
            iconBtn('↓', 'Descer seção', function () { move(sections, idx, 1, T.sections); }, idx === sections.length - 1),
            iconBtn('🗑', 'Apagar seção', function () {
              var msg = items.length
                ? 'Apagar a seção "' + section.title + '" e os ' + items.length + ' link(s) dentro dela?'
                : 'Apagar a seção "' + section.title + '"?';
              if (!confirm(msg)) return;
              sb.from(T.sections).delete().eq('id', section.id).then(function (res) {
                if (res.error) return toast(errText(res.error), 'error');
                state.sections = state.sections.filter(function (s) { return s.id !== section.id; });
                state.items = state.items.filter(function (i) { return i.section_id !== section.id; });
                renumber(state.sections.sort(bySort), T.sections).then(function () { renderSections(); renderPreview(); toast('Seção apagada.'); });
              });
            })
          ])
        ]),
        el('div', { class: 'adm-section-meta' }, [
          toggle(section.active, 'Seção visível', function (e) {
            updateRow(T.sections, section, { active: e.target.checked }, status).then(function () { renderSections(); renderPreview(); });
          }),
          el('span', { class: 'adm-muted', text: items.length + (items.length === 1 ? ' link' : ' links') }),
          status
        ]),
        el('div', { class: 'adm-items' }, items.length
          ? items.map(function (item, i) { return renderItem(section, item, i, items); })
          : [el('p', { class: 'adm-muted adm-empty', text: 'Nenhum link nesta seção.' })]),
        renderAddItemForm(section)
      ]);
      wrap.appendChild(card);
    });
  }

  $('#btn-add-section').addEventListener('click', function () {
    var name = prompt('Nome da nova seção (ex.: Redes sociais):');
    if (name == null) return;
    name = name.trim();
    if (!name) return toast('O nome da seção não pode ficar vazio.', 'error');
    sb.from(T.sections).insert({ title: name.slice(0, 60), position: state.sections.length, active: true }).select().single().then(function (res) {
      if (res.error) return toast(errText(res.error), 'error');
      state.sections.push(res.data);
      renderSections(); renderPreview(); toast('Seção criada.');
    });
  });

  // ---------- abas (celular) ----------
  $$('.adm-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      $$('.adm-tab').forEach(function (t) { t.classList.toggle('is-active', t === tab); t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
      $('#layout').setAttribute('data-tab', tab.getAttribute('data-tab'));
    });
  });

  // ---------- carga ----------
  function reload() {
    return Promise.all([
      sb.from(T.profile).select('*').eq('id', 1).maybeSingle(),
      sb.from(T.sections).select('*').order('position').order('created_at'),
      sb.from(T.items).select('*').order('position').order('created_at')
    ]).then(function (res) {
      var bad = res.filter(function (r) { return r.error; })[0];
      if (bad) throw bad.error;
      if (!res[0].data) {
        return sb.from(T.profile).insert(PROFILE_DEFAULTS).select().single().then(function (r) {
          if (r.error) throw r.error;
          return [r, res[1], res[2]];
        });
      }
      return res;
    }).then(function (res) {
      state.profile = Object.assign({}, PROFILE_DEFAULTS, res[0].data);
      state.sections = res[1].data || [];
      state.items = res[2].data || [];
      fillProfileForm();
      renderSections();
      renderPreview();
    }).catch(function (err) { toast('Não foi possível carregar: ' + errText(err), 'error'); });
  }

  // ---------- autenticação ----------
  var redirectTo = location.origin + location.pathname.replace(/index\.html$/, '');
  var routed = null;

  function route(session) {
    var key = session ? session.user.id : 'none';
    if (routed === key) return;
    routed = key;
    if (!session) { state.user = null; showView('login'); return; }
    state.user = session.user;
    $('#user-email').textContent = session.user.email || '';
    sb.rpc('syncpulse_links_is_admin').then(function (res) {
      if (res.error || res.data !== true) {
        $('#denied-email').textContent = session.user.email || 'atual';
        showView('denied');
        return;
      }
      showView('app');
      reload();
    });
  }

  $('#btn-google').addEventListener('click', function () {
    sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: redirectTo } }).then(function (res) {
      if (res.error) $('#login-msg').textContent = 'Erro ao entrar com Google: ' + res.error.message;
    });
  });

  $('#form-magic').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = $('#magic-email').value.trim();
    var msg = $('#login-msg');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = 'Digite um e-mail válido.'; return; }
    msg.textContent = 'Enviando…';
    sb.auth.signInWithOtp({ email: email, options: { emailRedirectTo: redirectTo, shouldCreateUser: false } }).then(function (res) {
      msg.textContent = res.error
        ? 'Não foi possível enviar o link. Confira o e-mail ou use “Entrar com Google”.'
        : 'Pronto! Abra o link que enviamos para ' + email + ' neste mesmo navegador.';
    });
  });

  function logout() { sb.auth.signOut().then(function () { routed = null; route(null); }); }
  $('#btn-logout').addEventListener('click', logout);
  $('#btn-logout-denied').addEventListener('click', logout);

  sb.auth.onAuthStateChange(function (_event, session) { setTimeout(function () { route(session); }, 0); });
  sb.auth.getSession().then(function (res) { route(res.data && res.data.session); });
})();
