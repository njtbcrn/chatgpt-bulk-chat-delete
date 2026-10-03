/* ChatGPT Bulk Chat Delete bookmarklet
 * Tested manually in Chrome, Edge, and Opera (Oct 2026).
 * Unofficial; uses ChatGPT web app internals that may change.
 */
(() => {
  window._cleanerObserver?.disconnect();
  document.getElementById('cleaner-panel')?.remove();
  document.querySelectorAll('.cleaner-select').forEach(x => x.remove());
  window.chatCleanerSelected = new Map();

  const panel = document.createElement('div');
  panel.id = 'cleaner-panel';
  Object.assign(panel.style, {
    position: 'fixed', top: '10px', left: '350px', zIndex: '999999',
    background: '#202123', color: 'white', padding: '9px 12px',
    borderRadius: '10px', display: 'flex', gap: '10px', alignItems: 'center',
    boxShadow: '0 3px 15px rgba(0,0,0,.4)', fontFamily: 'sans-serif'
  });
  panel.innerHTML = '<span id="cleaner-count">0 chats selected</span><button id="cleaner-clear">Clear selection</button><button id="cleaner-delete">🗑 Delete selected</button><button id="cleaner-close">✕</button>';
  document.body.appendChild(panel);

  const count = document.getElementById('cleaner-count');
  const clearBtn = document.getElementById('cleaner-clear');
  const deleteBtn = document.getElementById('cleaner-delete');
  const closeBtn = document.getElementById('cleaner-close');
  [clearBtn, deleteBtn, closeBtn].forEach(b => Object.assign(b.style, {
    cursor: 'pointer', border: '0', borderRadius: '6px', padding: '6px 10px'
  }));
  Object.assign(deleteBtn.style, {background: '#b91c1c', color: 'white', fontWeight: '600'});

  function update() {
    count.textContent = `${chatCleanerSelected.size} chats selected`;
  }

  function scan() {
    document.querySelectorAll('a[href^="/c/"]').forEach(link => {
      const row = link.parentElement;
      if (!row || row.querySelector('.cleaner-select')) return;
      const href = link.getAttribute('href');
      const title = link.querySelector('[dir="auto"]')?.innerText?.trim() || link.innerText.trim();
      const select = document.createElement('button');
      select.className = 'cleaner-select';
      select.textContent = '□';
      select.title = 'Select for deletion';
      Object.assign(select.style, {
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: '26px', height: '26px', minWidth: '26px', marginLeft: '3px',
        marginRight: '4px', padding: '0', border: 'none', borderRadius: '5px',
        background: 'transparent', color: '#aaa', fontSize: '21px',
        lineHeight: '26px', cursor: 'pointer', flexShrink: '0'
      });
      select.onclick = e => {
        e.preventDefault();
        e.stopPropagation();
        if (chatCleanerSelected.has(href)) {
          chatCleanerSelected.delete(href);
          select.textContent = '□';
          select.style.color = '#aaa';
          row.style.background = '';
        } else {
          chatCleanerSelected.set(href, title);
          select.textContent = '☑';
          select.style.color = 'white';
          row.style.background = 'rgba(255,255,255,.10)';
        }
        update();
      };
      row.insertBefore(select, link);
    });
  }

  clearBtn.onclick = () => {
    chatCleanerSelected.clear();
    document.querySelectorAll('.cleaner-select').forEach(b => {
      b.textContent = '□';
      b.style.color = '#aaa';
      if (b.parentElement) b.parentElement.style.background = '';
    });
    update();
  };

  closeBtn.onclick = () => {
    window._cleanerObserver?.disconnect();
    document.querySelectorAll('.cleaner-select').forEach(b => {
      if (b.parentElement) b.parentElement.style.background = '';
      b.remove();
    });
    panel.remove();
  };

  deleteBtn.onclick = async () => {
    const chats = [...chatCleanerSelected.entries()];
    if (!chats.length) { alert('Select at least one chat first.'); return; }
    if (!confirm(`${chats.length} chats will be PERMANENTLY deleted.\n\nContinue?`)) return;

    deleteBtn.disabled = true;
    deleteBtn.textContent = 'Getting authorization...';
    let token;
    try {
      const session = await fetch('/api/auth/session').then(r => r.json());
      token = session.accessToken;
      if (!token) throw new Error('No access token');
    } catch (e) {
      alert('Could not get session authorization. Refresh ChatGPT and try again.');
      deleteBtn.disabled = false;
      deleteBtn.textContent = '🗑 Delete selected';
      return;
    }

    let done = 0, failed = 0;
    for (const [href, title] of chats) {
      const id = href.split('/c/')[1]?.split(/[?#/]/)[0];
      deleteBtn.textContent = `Deleting ${done + failed + 1}/${chats.length}`;
      try {
        const r = await fetch(`/backend-api/conversation/id/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          headers: {Authorization: `Bearer ${token}`},
          credentials: 'same-origin'
        });
        if (r.ok) {
          done++;
          chatCleanerSelected.delete(href);
          document.querySelector(`a[href="${href}"]`)?.parentElement?.remove();
          console.log('Deleted:', title);
        } else {
          failed++;
          console.log(`Failed: ${title}: HTTP ${r.status}`);
        }
      } catch (e) {
        failed++;
        console.error('Failed:', title, e);
      }
      update();
      await new Promise(r => setTimeout(r, 200));
    }
    deleteBtn.disabled = false;
    deleteBtn.textContent = failed ? `⚠ ${done} deleted, ${failed} failed` : `✓ ${done} chats deleted`;
  };

  scan();
  window._cleanerObserver = new MutationObserver(scan);
  window._cleanerObserver.observe(document.body, {childList: true, subtree: true});
})();
