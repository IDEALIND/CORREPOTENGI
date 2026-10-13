/* ==========================================================================
   CORRE POTENGI - MOTOR DE COMPRA & E-COMMERCE MOBILE PIX
   WhatsApp Oficial: (84) 99683-8268 | Chave PIX: bieldamidia.a@outlook.com
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Estado do Pedido
  const state = {
    gender: 'Unissex',
    size: 'M',
    quantity: 1,
    unitPrice: 49.99,
    receiptFileName: '',
    pickupLocation: 'SCOFIELD — Rua Bento Urbano, 163, São Paulo do Potengi/RN'
  };

  const WHATSAPP_NUMBER = '5584986286423';
  const PIX_KEY = 'bieldamidia.a@outlook.com';
  const PIX_RANDOM_KEY = PIX_KEY;
  const PIX_BENEFICIARY = 'AYLSON GABRIEL DA SILVA PEREIRA';

  /* --------------------------------------------------
     GERADOR OFICIAL DO PADRÃO PIX BR CODE COM VALOR AUTOMÁTICO
     (Garante que ao escanear ou copiar, o banco abra com o valor exato do carrinho!)
     -------------------------------------------------- */
  function getCRC16(payload) {
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
      crc ^= (payload.charCodeAt(i) << 8);
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
        } else {
          crc = (crc << 1) & 0xFFFF;
        }
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  function formatField(id, value) {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  }

  function generatePixPayload(amount) {
    const pixKey = PIX_KEY;
    const name = "AYLSON G S PEREIRA";
    const city = "SAO PAULO DO PO";
    const txid = "CORREPOTENGI";

    const formattedAmount = Number(amount).toFixed(2);

    const merchantAccount = formatField('00', 'br.gov.bcb.pix') + formatField('01', pixKey);

    const payloadWithoutCRC = 
      formatField('00', '01') +
      formatField('26', merchantAccount) +
      formatField('52', '0000') +
      formatField('53', '986') +
      formatField('54', formattedAmount) +
      formatField('58', 'BR') +
      formatField('59', name) +
      formatField('60', city) +
      formatField('62', formatField('05', txid)) +
      '6304';

    const crc = getCRC16(payloadWithoutCRC);
    return payloadWithoutCRC + crc;
  }

  /* --------------------------------------------------
     1. VÍDEO VD4K - AUTOPLAY & LOOP SUAVE
     -------------------------------------------------- */
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.playsInline = true;
    const playPromise = heroVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const playOnTouch = () => {
          heroVideo.play();
          document.removeEventListener('touchstart', playOnTouch);
        };
        document.addEventListener('touchstart', playOnTouch, { once: true });
      });
    }
  }

  /* --------------------------------------------------
     2. ALTERNADOR DE VISUALIZAÇÃO DA CAMISA (frente.png / costas.png)
     -------------------------------------------------- */
  const shirtContainer = document.getElementById('shirtContainer');
  const viewToggleBtns = document.querySelectorAll('.view-toggle-btn');

  viewToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewToggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const viewMode = btn.getAttribute('data-view');
      shirtContainer.classList.remove('view-front', 'view-back');

      if (viewMode === 'front') {
        shirtContainer.classList.add('view-front');
      } else if (viewMode === 'back') {
        shirtContainer.classList.add('view-back');
      }
    });
  });

  /* --------------------------------------------------
     3. HEADER DINÂMICO & BARRA STICKY INFERIOR NO SCROLL
     -------------------------------------------------- */
  const stickyBottomBar = document.getElementById('stickyBottomBar');
  const heroCtaMain = document.getElementById('heroCtaMain');

  window.addEventListener('scroll', () => {
    if (heroCtaMain && stickyBottomBar) {
      const heroCtaPos = heroCtaMain.getBoundingClientRect();
      if (heroCtaPos.bottom < 0) {
        stickyBottomBar.classList.add('visible');
      } else {
        stickyBottomBar.classList.remove('visible');
      }
    }
  }, { passive: true });

  /* --------------------------------------------------
     4. CONTADOR REGRESSIVO DO LOTE
     -------------------------------------------------- */
  let remainingSeconds = (3 * 3600) + (48 * 60) + 22;

  const elHours = document.getElementById('timeHours');
  const elMinutes = document.getElementById('timeMinutes');
  const elSeconds = document.getElementById('timeSeconds');

  function updateTimer() {
    if (remainingSeconds <= 0) {
      remainingSeconds = 4 * 3600;
    } else {
      remainingSeconds--;
    }

    const h = Math.floor(remainingSeconds / 3600);
    const m = Math.floor((remainingSeconds % 3600) / 60);
    const s = remainingSeconds % 60;

    if (elHours) elHours.textContent = String(h).padStart(2, '0');
    if (elMinutes) elMinutes.textContent = String(m).padStart(2, '0');
    if (elSeconds) elSeconds.textContent = String(s).padStart(2, '0');
  }

  setInterval(updateTimer, 1000);

  /* --------------------------------------------------
     5. SELEÇÃO DE TAMANHO (APENAS M E G)
     -------------------------------------------------- */
  const sizeBoxes = document.querySelectorAll('.size-box');
  const selectedSizeText = document.getElementById('selectedSizeText');

  sizeBoxes.forEach(box => {
    box.addEventListener('click', () => {
      sizeBoxes.forEach(b => b.classList.remove('active'));
      box.classList.add('active');

      state.size = box.getAttribute('data-size');
      if (selectedSizeText) {
        selectedSizeText.textContent = state.size;
      }
      updateSummaryDisplay();
    });
  });

  /* --------------------------------------------------
     6. CONTROLE DE QUANTIDADE & ATUALIZAÇÃO DINÂMICA
     Gera o QR Code e Código Pix com valor preenchido automaticamente
     -------------------------------------------------- */
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyValue = document.getElementById('qtyValue');
  const cartBadgeCount = document.getElementById('cartBadgeCount');
  const buySectionTotalDisplay = document.getElementById('buySectionTotalDisplay');
  const pixExactAmountDisplay = document.getElementById('pixExactAmountDisplay');
  const modalPixAmountDisplay = document.getElementById('modalPixAmountDisplay');
  const stickyPriceText = document.getElementById('stickyPriceText');
  const pixCopyTipAmount = document.getElementById('pixCopyTipAmount');

  const pixQrImg = document.getElementById('pixQrImg');
  const modalPixQrImg = document.getElementById('modalPixQrImg');

  let currentPixPayload = '';

  if (qtyMinus && qtyPlus) {
    qtyMinus.addEventListener('click', () => {
      if (state.quantity > 1) {
        state.quantity--;
        qtyValue.textContent = state.quantity;
        if (cartBadgeCount) cartBadgeCount.textContent = state.quantity;
        updateSummaryDisplay();
      }
    });

    qtyPlus.addEventListener('click', () => {
      if (state.quantity < 10) {
        state.quantity++;
        qtyValue.textContent = state.quantity;
        if (cartBadgeCount) cartBadgeCount.textContent = state.quantity;
        updateSummaryDisplay();
      }
    });
  }

  function calculateRawTotal() {
    return (state.quantity * state.unitPrice);
  }

  function calculateFormattedTotal() {
    return calculateRawTotal().toFixed(2).replace('.', ',');
  }

  function renderQrCodeImage(imgEl, payload) {
    if (!imgEl) return;
    try {
      if (window.QRCodeGenerator && typeof window.QRCodeGenerator.generateSvg === 'function') {
        const svg = window.QRCodeGenerator.generateSvg(payload, 280);
        imgEl.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
        return;
      }
    } catch (err) {
      console.warn('Erro ao gerar QR Code offline:', err);
    }
    imgEl.src = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(payload)}`;
  }

  function updateSummaryDisplay() {
    const rawTotal = calculateRawTotal();
    const formattedTotal = calculateFormattedTotal();

    // 1. Gera o payload oficial do Pix com o valor EXATO e chave nova (E-mail)
    currentPixPayload = generatePixPayload(rawTotal);

    // 2. Atualiza os QR Codes dinamicamente com o novo padrão
    renderQrCodeImage(pixQrImg, currentPixPayload);
    renderQrCodeImage(modalPixQrImg, currentPixPayload);

    // 3. Atualiza os textos e valores em tela
    if (buySectionTotalDisplay) {
      buySectionTotalDisplay.textContent = `R$ ${formattedTotal}`;
    }

    if (pixExactAmountDisplay) {
      pixExactAmountDisplay.textContent = `R$ ${formattedTotal}`;
    }

    if (modalPixAmountDisplay) {
      modalPixAmountDisplay.textContent = `R$ ${formattedTotal}`;
    }

    if (stickyPriceText) {
      stickyPriceText.textContent = `R$ ${formattedTotal}`;
    }

    if (pixCopyTipAmount) {
      pixCopyTipAmount.textContent = `R$ ${formattedTotal}`;
    }

    const modalSummarySpecsText = document.getElementById('modalSummarySpecsText');
    const modalSummaryTotalText = document.getElementById('modalSummaryTotalText');

    if (modalSummarySpecsText) {
      modalSummarySpecsText.textContent = `Unissex • Tam: ${state.size} • Qtd: ${state.quantity}`;
    }
    if (modalSummaryTotalText) {
      modalSummaryTotalText.textContent = `Total: R$ ${formattedTotal}`;
    }
  }

  /* --------------------------------------------------
     7. COPIAR PIX COPIA E COLA (COM VALOR AUTOMÁTICO)
     -------------------------------------------------- */
  function setupCopiaColaButton(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (!currentPixPayload) {
        currentPixPayload = generatePixPayload(calculateRawTotal());
      }

      navigator.clipboard.writeText(currentPixPayload).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>CÓDIGO COM VALOR COPIADO! ✓</span>';
        btn.style.background = '#22C55E';
        btn.style.borderColor = '#FFFFFF';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
        }, 2500);
      }).catch(() => {
        prompt('Copie o código Pix Copia e Cola com o valor preenchido:', currentPixPayload);
      });
    });
  }

  setupCopiaColaButton('btnCopyPixCopiaCola');
  setupCopiaColaButton('btnCopyPixCopiaColaModal');

  /* --------------------------------------------------
     8. COPIAR CHAVE PIX (E-MAIL) SIMPLES
     -------------------------------------------------- */
  function setupCopyKeyButton(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(PIX_KEY).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'COPIADO! ✓';
        btn.style.backgroundColor = '#22C55E';
        btn.style.color = '#FFFFFF';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = '';
          btn.style.color = '';
        }, 2200);
      }).catch(() => {
        prompt('Copie a chave Pix (e-mail) manualmente:', PIX_KEY);
      });
    });
  }

  setupCopyKeyButton('btnCopyPixDirect');
  setupCopyKeyButton('btnCopyPixModal');

  /* --------------------------------------------------
     9. BANCO DE DADOS LOCAL DO GESTOR (INDEXEDDB + LOCALSTORAGE)
     Armazena pedidos e fotos dos comprovantes em alta resolução
     -------------------------------------------------- */
  const DB_NAME = 'CorrePotengiGestorDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'orders';

  let currentReceiptDataUrl = null;
  let currentReceiptFileName = '';
  let currentReceiptFileType = '';

  function openGestorDB() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        resolve(null);
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('createdAt', 'createdAt', { unique: false });
          store.createIndex('customerPhone', 'customerPhone', { unique: false });
          store.createIndex('size', 'size', { unique: false });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    });
  }

  function saveMetaBackup(order) {
    try {
      const raw = localStorage.getItem('corre_potengi_orders_meta');
      let list = raw ? JSON.parse(raw) : [];
      list = list.filter(item => item.id !== order.id);
      // Salva uma cópia leve no localStorage (sem o DataURL gigantesco se for muito pesado)
      const lightweight = { ...order };
      if (lightweight.receiptDataUrl && lightweight.receiptDataUrl.length > 80000) {
        lightweight.receiptDataUrlStoredInDB = true;
        lightweight.receiptDataUrl = null;
      }
      list.unshift(lightweight);
      localStorage.setItem('corre_potengi_orders_meta', JSON.stringify(list));
    } catch (e) {
      console.warn('Backup local storage avisou:', e);
    }
  }

  function getMetaBackup() {
    try {
      const raw = localStorage.getItem('corre_potengi_orders_meta');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  /* --------------------------------------------------
     SINCRONIZAÇÃO EM NUVEM EM TEMPO REAL (FIREBASE / MULTI-DISPOSITIVO)
     Garante que pedidos feitos de outro celular ou PC apareçam na hora no painel
     -------------------------------------------------- */
  const DEFAULT_CLOUD_URL = 'https://correpotengi-2026-default-rtdb.firebaseio.com';

  function getCloudDatabaseUrl() {
    const custom = localStorage.getItem('corre_potengi_cloud_url');
    return (custom || DEFAULT_CLOUD_URL).trim().replace(/\/+$/, '');
  }

  function setCloudDatabaseUrl(url) {
    if (!url) {
      localStorage.removeItem('corre_potengi_cloud_url');
    } else {
      localStorage.setItem('corre_potengi_cloud_url', url.trim().replace(/\/+$/, ''));
    }
  }

  function playOrderNotificationSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  }

  async function sendOrderToCloud(order) {
    const cloudUrl = getCloudDatabaseUrl();
    if (!cloudUrl) return;

    try {
      // Cria payload seguro para envio em nuvem
      const payload = { ...order };
      // Se tiver anexo de comprovante muito grande, envia thumbnail ou metadados
      await fetch(`${cloudUrl}/orders/${order.id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.warn('Sync com nuvem avisou:', err);
    }
  }

  let cloudPollingInterval = null;

  async function syncOrdersFromCloud(notifyNew = true) {
    const cloudUrl = getCloudDatabaseUrl();
    if (!cloudUrl) return;

    const statusText = document.getElementById('cloudSyncStatusText');
    const statusBadge = document.getElementById('cloudSyncStatusBadge');
    if (statusBadge) statusBadge.classList.add('syncing');
    if (statusText) statusText.textContent = 'Sincronizando...';

    try {
      const res = await fetch(`${cloudUrl}/orders.json`);
      if (!res.ok) throw new Error('Status ' + res.status);
      const data = await res.json();

      if (data && typeof data === 'object') {
        const cloudOrders = Object.values(data);
        let newCount = 0;
        let latestOrder = null;

        for (const cOrder of cloudOrders) {
          if (!cOrder || !cOrder.id) continue;
          const exists = currentLoadedOrders.some(o => o.id === cOrder.id);
          if (!exists) {
            await saveOrderToDB(cOrder, false); // false = não re-enviar para a própria nuvem
            newCount++;
            latestOrder = cOrder;
          }
        }

        if (newCount > 0) {
          currentLoadedOrders = await getAllOrdersFromDB();
          renderMetrics(currentLoadedOrders);
          renderSizeSummary(currentLoadedOrders);
          renderOrdersList();

          if (notifyNew) {
            playOrderNotificationSound();
            showManagerToast(`⚡ NOVO PEDIDO EM TEMPO REAL: ${latestOrder?.customerName || 'Cliente'} (Tam: ${latestOrder?.size || 'M'})!`);
          }
        }
      }

      if (statusBadge) statusBadge.classList.remove('syncing');
      if (statusText) statusText.textContent = 'Nuvem Conectada (Tempo Real)';
    } catch (err) {
      if (statusBadge) statusBadge.classList.remove('syncing');
      if (statusText) statusText.textContent = 'Offline (Memória Local)';
    }
  }

  function startRealtimeCloudPolling() {
    stopRealtimeCloudPolling();
    // Executa uma sincronização imediata
    syncOrdersFromCloud(false);
    // E busca pedidos novos de outros celulares/PCs a cada 3.5 segundos
    cloudPollingInterval = setInterval(() => {
      if (managerDashboardModal && managerDashboardModal.classList.contains('open')) {
        syncOrdersFromCloud(true);
      }
    }, 3500);
  }

  function stopRealtimeCloudPolling() {
    if (cloudPollingInterval) {
      clearInterval(cloudPollingInterval);
      cloudPollingInterval = null;
    }
  }

  async function saveOrderToDB(order, pushToCloud = true) {
    saveMetaBackup(order);
    if (pushToCloud) {
      sendOrderToCloud(order);
    }
    try {
      const db = await openGestorDB();
      if (!db) return true;
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(order);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      });
    } catch (e) {
      console.warn('Erro ao salvar no IndexedDB:', e);
      return true;
    }
  }

  async function getAllOrdersFromDB() {
    try {
      const db = await openGestorDB();
      if (!db) return getMetaBackup();
      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => {
          let list = request.result || [];
          if (list.length === 0) {
            list = getMetaBackup();
          }
          list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          resolve(list);
        };
        request.onerror = () => resolve(getMetaBackup());
      });
    } catch (e) {
      return getMetaBackup();
    }
  }

  async function deleteOrderFromDB(id) {
    try {
      // 1. Remove da Nuvem (Firebase)
      const cloudUrl = getCloudDatabaseUrl();
      if (cloudUrl) {
        try {
          await fetch(`${cloudUrl}/orders/${id}.json`, { method: 'DELETE' });
        } catch (err) {
          console.warn('Erro ao deletar da nuvem:', err);
        }
      }

      // 2. Remove do localStorage
      const raw = localStorage.getItem('corre_potengi_orders_meta');
      if (raw) {
        let list = JSON.parse(raw).filter(item => item.id !== id);
        localStorage.setItem('corre_potengi_orders_meta', JSON.stringify(list));
      }

      // 3. Remove do IndexedDB
      const db = await openGestorDB();
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(id);
      }
    } catch (e) {}
  }

  async function clearAllOrdersFromDB() {
    try {
      // 1. Limpa totalmente da Nuvem (Firebase)
      const cloudUrl = getCloudDatabaseUrl();
      if (cloudUrl) {
        try {
          await fetch(`${cloudUrl}/orders.json`, { method: 'DELETE' });
        } catch (err) {
          console.warn('Erro ao limpar nuvem:', err);
        }
      }

      // 2. Remove do localStorage
      localStorage.removeItem('corre_potengi_orders_meta');

      // 3. Remove do IndexedDB
      const db = await openGestorDB();
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
      }
    } catch (e) {}
  }

  async function updateOrderStatusInDB(id, newStatus) {
    try {
      const orders = await getAllOrdersFromDB();
      const target = orders.find(o => o.id === id);
      if (target) {
        target.status = newStatus;
        await saveOrderToDB(target);
      }
    } catch (e) {}
  }

  /* --------------------------------------------------
     10. UPLOAD DO COMPROVANTE DE PAGAMENTO & AUTO-REGISTRO
     -------------------------------------------------- */
  const receiptFileInput = document.getElementById('receiptFileInput');
  const dropzonePrompt = document.getElementById('dropzonePrompt');
  const dropzoneSelected = document.getElementById('dropzoneSelected');
  const selectedFilename = document.getElementById('selectedFilename');
  const btnRemoveFile = document.getElementById('btnRemoveFile');

  if (receiptFileInput) {
    receiptFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        currentReceiptFileName = file.name;
        currentReceiptFileType = file.type || '';
        state.receiptFileName = file.name;
        selectedFilename.textContent = file.name;
        dropzonePrompt.classList.add('hidden');
        dropzoneSelected.classList.remove('hidden');

        // Lê a imagem/PDF em Base64 para armazenar no painel do gestor
        const reader = new FileReader();
        reader.onload = (event) => {
          currentReceiptDataUrl = event.target.result;
          
          // Se o cliente já preencheu nome e telefone, pré-grava no painel
          const custName = document.getElementById('directCustName')?.value.trim();
          const custPhone = document.getElementById('directCustPhone')?.value.trim();
          if (custName && custPhone) {
            autoRecordOrderDraft(custName, custPhone);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', (e) => {
      e.stopPropagation();
      receiptFileInput.value = '';
      currentReceiptDataUrl = null;
      currentReceiptFileName = '';
      currentReceiptFileType = '';
      state.receiptFileName = '';
      dropzonePrompt.classList.remove('hidden');
      dropzoneSelected.classList.add('hidden');
    });
  }

  async function autoRecordOrderDraft(custName, custPhone) {
    const draftId = 'draft_' + custPhone.replace(/\D/g, '');
    const draft = {
      id: draftId,
      customerName: custName,
      customerPhone: custPhone,
      size: state.size || 'M',
      quantity: state.quantity || 1,
      total: calculateFormattedTotal(),
      totalRaw: calculateRawTotal(),
      pickupLocation: state.pickupLocation,
      timestamp: Date.now(),
      displayDate: new Date().toLocaleDateString('pt-BR'),
      displayTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      hasReceipt: !!currentReceiptDataUrl,
      receiptFileName: currentReceiptFileName || 'comprovante.jpg',
      receiptFileType: currentReceiptFileType,
      receiptDataUrl: currentReceiptDataUrl,
      status: 'Confirmado'
    };
    await saveOrderToDB(draft);
  }

  /* --------------------------------------------------
     11. ENVIO DO PEDIDO PARA O WHATSAPP & GRAVAÇÃO NO PAINEL
     -------------------------------------------------- */
  const submitOrderBtn = document.getElementById('submitOrderBtn');

  if (submitOrderBtn) {
    submitOrderBtn.addEventListener('click', async () => {
      const custName = document.getElementById('directCustName')?.value.trim();
      const custPhone = document.getElementById('directCustPhone')?.value.trim();

      if (!custName) {
        alert('Por favor, preencha o seu Nome Completo antes de prosseguir.');
        document.getElementById('directCustName')?.focus();
        return;
      }

      if (!custPhone) {
        alert('Por favor, informe o seu número de WhatsApp / Telefone.');
        document.getElementById('directCustPhone')?.focus();
        return;
      }

      const total = calculateFormattedTotal();

      // Grava no Painel do Gestor imediatamente
      const orderRecord = {
        id: 'PED_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        customerName: custName,
        customerPhone: custPhone,
        size: state.size || 'M',
        quantity: state.quantity || 1,
        total: total,
        totalRaw: calculateRawTotal(),
        pickupLocation: state.pickupLocation,
        timestamp: Date.now(),
        displayDate: new Date().toLocaleDateString('pt-BR'),
        displayTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        hasReceipt: !!currentReceiptDataUrl,
        receiptFileName: currentReceiptFileName || state.receiptFileName || '',
        receiptFileType: currentReceiptFileType,
        receiptDataUrl: currentReceiptDataUrl || null,
        status: 'Confirmado'
      };

      await saveOrderToDB(orderRecord);

      // Mensagem para o WhatsApp
      let msg = `🏃 *PEDIDO OFICIAL - CORRE POTENGI 2026*\n\n`;
      msg += `Olá! Realizei o pagamento via PIX e quero confirmar minha camisa oficial:\n\n`;
      msg += `👕 *Produto:* Camisa Oficial Corre Potengi (UNISSEX)\n`;
      msg += `📏 *Tamanho Escolhido:* ${state.size}\n`;
      msg += `🔢 *Quantidade:* ${state.quantity} un.\n`;
      msg += `💰 *Valor Total Pago:* R$ ${total}\n`;
      msg += `⚡ *Chave PIX Utilizada:* ${PIX_KEY}\n`;
      msg += `🏦 *Favorecido:* ${PIX_BENEFICIARY}\n\n`;
      msg += `👤 *Nome do Comprador:* ${custName}\n`;
      msg += `📱 *Telefone/WhatsApp:* ${custPhone}\n\n`;
      msg += `📍 *Ponto de Retirada:* ${state.pickupLocation}\n`;
      msg += `🗓️ *Data de Retirada:* Na semana do evento\n`;
      msg += `⚠️ *Aviso de Entrega:* Ciente de que não há entrega em domicílio, apenas retirada no local.\n\n`;

      if (state.receiptFileName) {
        msg += `📎 *Comprovante Anexado:* Sim (${state.receiptFileName})\n`;
        msg += `*(Estou enviando a imagem/PDF do comprovante logo abaixo desta mensagem)*\n\n`;
      } else {
        msg += `📎 *Comprovante:* (Estou enviando o print/comprovante a seguir)\n\n`;
      }

      msg += `#EuTôNoCorre #CorrePotengi #AcunhaAaaa`;

      const encodedMsg = encodeURIComponent(msg);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  /* --------------------------------------------------
     12. GATILHO SECRETO: 3 CLIQUES NA LOGO ABRE O PAINEL DO GESTOR
     -------------------------------------------------- */
  /* --------------------------------------------------
     12. AUTENTICAÇÃO DO GESTOR & GATILHO DE 3 CLIQUES NA LOGO
     Usuário: ADMMASTER | Senha: ADM310280
     -------------------------------------------------- */
  const managerLoginModal = document.getElementById('managerLoginModal');
  const closeManagerLoginBtn = document.getElementById('closeManagerLoginBtn');
  const managerLoginForm = document.getElementById('managerLoginForm');
  const admUserInput = document.getElementById('admUserInput');
  const admPassInput = document.getElementById('admPassInput');
  const admLoginError = document.getElementById('admLoginError');
  const btnTogglePassword = document.getElementById('btnTogglePassword');
  const btnManagerLogout = document.getElementById('btnManagerLogout');

  const managerDashboardModal = document.getElementById('managerDashboardModal');
  const closeManagerBtn = document.getElementById('closeManagerBtn');
  const headerBrandLink = document.getElementById('headerBrandLink');
  const headerBrandLogo = document.getElementById('headerBrandLogo');
  const footerBrandLogo = document.getElementById('footerBrandLogo');
  const footerLogoWrap = document.getElementById('footerLogoWrap');
  const managerToast = document.getElementById('managerToast');

  let logoClickCount = 0;
  let logoClickTimer = null;

  function isManagerAuthenticated() {
    return sessionStorage.getItem('corre_potengi_adm_auth') === 'true';
  }

  function showManagerToast(text) {
    if (!managerToast) return;
    managerToast.textContent = text;
    managerToast.style.display = 'block';
    requestAnimationFrame(() => {
      managerToast.classList.add('show');
    });
    setTimeout(() => {
      managerToast.classList.remove('show');
      setTimeout(() => {
        if (!managerToast.classList.contains('show')) {
          managerToast.style.display = 'none';
        }
      }, 300);
    }, 2800);
  }

  // Alternador de visualização da senha
  if (btnTogglePassword && admPassInput) {
    btnTogglePassword.addEventListener('click', () => {
      if (admPassInput.type === 'password') {
        admPassInput.type = 'text';
        btnTogglePassword.textContent = '🔒';
      } else {
        admPassInput.type = 'password';
        btnTogglePassword.textContent = '👁️';
      }
    });
  }

  // Abre Modal de Login
  function openManagerLoginModal() {
    if (!managerLoginModal) return;
    if (admUserInput) admUserInput.value = '';
    if (admPassInput) admPassInput.value = '';
    if (admLoginError) admLoginError.style.display = 'none';

    managerLoginModal.style.display = 'flex';
    requestAnimationFrame(() => {
      managerLoginModal.classList.add('open');
      managerLoginModal.setAttribute('aria-hidden', 'false');
      if (admUserInput) admUserInput.focus();
    });
  }

  function closeManagerLoginModal() {
    if (!managerLoginModal) return;
    managerLoginModal.classList.remove('open');
    managerLoginModal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      if (!managerLoginModal.classList.contains('open')) {
        managerLoginModal.style.display = 'none';
      }
    }, 280);
  }

  if (closeManagerLoginBtn) closeManagerLoginBtn.addEventListener('click', closeManagerLoginModal);
  if (managerLoginModal) {
    managerLoginModal.addEventListener('click', (e) => {
      if (e.target === managerLoginModal) closeManagerLoginModal();
    });
  }

  // Validação do Login do Gestor (ADMMASTER / ADM310280)
  if (managerLoginForm) {
    managerLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = admUserInput?.value.trim().toUpperCase();
      const pass = admPassInput?.value.trim();

      if (user === 'ADMMASTER' && pass === 'ADM310280') {
        // Autenticado com sucesso
        sessionStorage.setItem('corre_potengi_adm_auth', 'true');
        closeManagerLoginModal();
        showManagerToast('🔓 Acesso autorizado! Bem-vindo, ADMMASTER.');
        openManagerDashboard();
      } else {
        // Erro de credenciais
        if (admLoginError) {
          admLoginError.style.display = 'block';
          admLoginError.textContent = '⚠️ Usuário ou senha incorretos!';
        }
        if (admPassInput) {
          admPassInput.value = '';
          admPassInput.focus();
        }
      }
    });
  }

  // Logout do Gestor
  if (btnManagerLogout) {
    btnManagerLogout.addEventListener('click', () => {
      sessionStorage.removeItem('corre_potengi_adm_auth');
      closeManagerDashboard();
      showManagerToast('🚪 Sessão de administrador encerrada.');
    });
  }

  // Clique Triplo na Logo
  function handleLogoClick(e) {
    logoClickCount++;
    clearTimeout(logoClickTimer);

    if (logoClickCount === 3) {
      e.preventDefault();
      e.stopPropagation();
      logoClickCount = 0;

      if (isManagerAuthenticated()) {
        showManagerToast('⚡ Abrindo Painel do Gestor...');
        openManagerDashboard();
      } else {
        showManagerToast('🔒 Acesso Restrito: Identifique-se.');
        openManagerLoginModal();
      }
    } else {
      logoClickTimer = setTimeout(() => {
        logoClickCount = 0;
      }, 1600); // 1.6 segundos para completar os 3 cliques
    }
  }

  // Ouvinte na logo do cabeçalho e rodapé
  if (headerBrandLink) headerBrandLink.addEventListener('click', handleLogoClick);
  if (headerBrandLogo) headerBrandLogo.addEventListener('click', handleLogoClick);
  if (footerBrandLogo) footerBrandLogo.addEventListener('click', handleLogoClick);
  if (footerLogoWrap) footerLogoWrap.addEventListener('click', handleLogoClick);

  function openManagerDashboard() {
    if (!managerDashboardModal) return;
    managerDashboardModal.style.display = 'flex';
    requestAnimationFrame(() => {
      managerDashboardModal.classList.add('open');
      managerDashboardModal.setAttribute('aria-hidden', 'false');
    });
    loadAndRenderDashboard();
    startRealtimeCloudPolling();
  }

  function closeManagerDashboard() {
    if (!managerDashboardModal) return;
    stopRealtimeCloudPolling();
    managerDashboardModal.classList.remove('open');
    managerDashboardModal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      if (!managerDashboardModal.classList.contains('open')) {
        managerDashboardModal.style.display = 'none';
      }
    }, 280);
  }

  if (closeManagerBtn) closeManagerBtn.addEventListener('click', closeManagerDashboard);

  if (managerDashboardModal) {
    managerDashboardModal.addEventListener('click', (e) => {
      if (e.target === managerDashboardModal) closeManagerDashboard();
    });
  }

  /* Controles da Conexão em Nuvem */
  const cloudConfigModal = document.getElementById('cloudConfigModal');
  const btnOpenCloudConfig = document.getElementById('btnOpenCloudConfig');
  const closeCloudConfigBtn = document.getElementById('closeCloudConfigBtn');
  const cloudConfigForm = document.getElementById('cloudConfigForm');
  const cloudDatabaseUrlInput = document.getElementById('cloudDatabaseUrlInput');
  const btnTestCloudConnection = document.getElementById('btnTestCloudConnection');
  const btnSyncCloudNow = document.getElementById('btnSyncCloudNow');

  function openCloudConfigModal() {
    if (!cloudConfigModal) return;
    if (cloudDatabaseUrlInput) cloudDatabaseUrlInput.value = getCloudDatabaseUrl();
    cloudConfigModal.style.display = 'flex';
    requestAnimationFrame(() => {
      cloudConfigModal.classList.add('open');
      cloudConfigModal.setAttribute('aria-hidden', 'false');
    });
  }

  function closeCloudConfigModal() {
    if (!cloudConfigModal) return;
    cloudConfigModal.classList.remove('open');
    cloudConfigModal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      if (!cloudConfigModal.classList.contains('open')) {
        cloudConfigModal.style.display = 'none';
      }
    }, 250);
  }

  if (btnOpenCloudConfig) btnOpenCloudConfig.addEventListener('click', openCloudConfigModal);
  if (closeCloudConfigBtn) closeCloudConfigBtn.addEventListener('click', closeCloudConfigModal);
  if (cloudConfigModal) {
    cloudConfigModal.addEventListener('click', (e) => {
      if (e.target === cloudConfigModal) closeCloudConfigModal();
    });
  }

  if (btnSyncCloudNow) {
    btnSyncCloudNow.addEventListener('click', async () => {
      showManagerToast('🔄 Sincronizando com outros aparelhos...');
      await syncOrdersFromCloud(true);
    });
  }

  if (cloudConfigForm) {
    cloudConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newUrl = cloudDatabaseUrlInput?.value.trim();
      setCloudDatabaseUrl(newUrl);
      closeCloudConfigModal();
      showManagerToast('☁️ URL da Nuvem salva! Conectando...');
      syncOrdersFromCloud(false);
    });
  }

  if (btnTestCloudConnection) {
    btnTestCloudConnection.addEventListener('click', async () => {
      const testUrl = cloudDatabaseUrlInput?.value.trim() || getCloudDatabaseUrl();
      try {
        btnTestCloudConnection.textContent = 'Testando...';
        const res = await fetch(`${testUrl.replace(/\/+$/, '')}/orders.json`);
        if (res.ok) {
          alert('✅ Conexão bem-sucedida com o banco de dados em nuvem!');
        } else {
          alert(`⚠️ Resposta recebida (Status ${res.status}). Verifique as permissões de leitura/escrita.`);
        }
      } catch (err) {
        alert('❌ Erro de conexão com a URL informada. Certifique-se de que é uma URL válida com acesso liberado.');
      } finally {
        btnTestCloudConnection.textContent = 'Testar';
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (cloudConfigModal && cloudConfigModal.classList.contains('open')) closeCloudConfigModal();
      if (managerLoginModal && managerLoginModal.classList.contains('open')) closeManagerLoginModal();
      if (managerDashboardModal && managerDashboardModal.classList.contains('open')) closeManagerDashboard();
      if (receiptZoomModal && receiptZoomModal.classList.contains('open')) closeReceiptZoom();
    }
  });

  /* --------------------------------------------------
     13. RENDERIZAÇÃO DO PAINEL DO GESTOR & FILTROS
     -------------------------------------------------- */
  const metricTotalCustomers = document.getElementById('metricTotalCustomers');
  const metricTotalShirts = document.getElementById('metricTotalShirts');
  const metricTotalRevenue = document.getElementById('metricTotalRevenue');
  const metricTotalReceipts = document.getElementById('metricTotalReceipts');
  const managerSizeSummaryGrid = document.getElementById('managerSizeSummaryGrid');
  const managerOrdersList = document.getElementById('managerOrdersList');
  const managerOrdersCountLabel = document.getElementById('managerOrdersCountLabel');
  const managerSearchInput = document.getElementById('managerSearchInput');
  const btnClearSearch = document.getElementById('btnClearSearch');
  const btnExportOrdersCsv = document.getElementById('btnExportOrdersCsv');
  const btnAddTestOrder = document.getElementById('btnAddTestOrder');
  const btnClearAllOrders = document.getElementById('btnClearAllOrders');

  let currentLoadedOrders = [];
  let activeFilterSize = 'ALL';
  let activeFilterReceipt = 'ALL';
  let activeSearchQuery = '';

  async function loadAndRenderDashboard() {
    currentLoadedOrders = await getAllOrdersFromDB();
    renderMetrics(currentLoadedOrders);
    renderSizeSummary(currentLoadedOrders);
    renderOrdersList();
  }

  function renderMetrics(orders) {
    const totalCustomers = orders.length;
    let totalShirts = 0;
    let totalRevenueRaw = 0;
    let totalReceipts = 0;

    orders.forEach(o => {
      const q = Number(o.quantity) || 1;
      totalShirts += q;
      totalRevenueRaw += (o.totalRaw ? Number(o.totalRaw) : (q * 49.99));
      if (o.hasReceipt || o.receiptDataUrl) totalReceipts++;
    });

    if (metricTotalCustomers) metricTotalCustomers.textContent = totalCustomers;
    if (metricTotalShirts) metricTotalShirts.textContent = totalShirts;
    if (metricTotalRevenue) metricTotalRevenue.textContent = `R$ ${totalRevenueRaw.toFixed(2).replace('.', ',')}`;
    if (metricTotalReceipts) metricTotalReceipts.textContent = totalReceipts;
  }

  function renderSizeSummary(orders) {
    if (!managerSizeSummaryGrid) return;
    managerSizeSummaryGrid.innerHTML = '';

    // Agrupa e conta por tamanho
    const counts = {};
    let totalPieces = 0;

    orders.forEach(o => {
      const s = (o.size || 'M').toUpperCase();
      const q = Number(o.quantity) || 1;
      counts[s] = (counts[s] || 0) + q;
      totalPieces += q;
    });

    // Se estiver vazio, garante pelo menos os tamanhos padrões M e G visíveis
    if (Object.keys(counts).length === 0) {
      counts['M'] = 0;
      counts['G'] = 0;
    }

    const sizes = Object.keys(counts).sort();

    sizes.forEach(sz => {
      const count = counts[sz];
      const pct = totalPieces > 0 ? Math.round((count / totalPieces) * 100) : 0;

      const item = document.createElement('div');
      item.className = 'size-summary-item';
      item.innerHTML = `
        <span class="size-item-tag">TAM ${sz}</span>
        <div class="size-item-details">
          <div class="size-item-qty">${count} un.</div>
          <div class="size-item-pct">${pct}% da produção</div>
        </div>
      `;
      managerSizeSummaryGrid.appendChild(item);
    });
  }

  function renderOrdersList() {
    if (!managerOrdersList) return;
    managerOrdersList.innerHTML = '';

    // Filtra lista de pedidos
    let filtered = currentLoadedOrders.filter(order => {
      // Filtro de tamanho
      if (activeFilterSize !== 'ALL') {
        if ((order.size || '').toUpperCase() !== activeFilterSize) return false;
      }
      // Filtro de comprovante
      if (activeFilterReceipt === 'WITH') {
        if (!order.hasReceipt && !order.receiptDataUrl) return false;
      } else if (activeFilterReceipt === 'WITHOUT') {
        if (order.hasReceipt || order.receiptDataUrl) return false;
      }
      // Filtro de busca (Nome ou Telefone)
      if (activeSearchQuery) {
        const query = activeSearchQuery.toLowerCase();
        const name = (order.customerName || '').toLowerCase();
        const phone = (order.customerPhone || '').toLowerCase();
        if (!name.includes(query) && !phone.includes(query)) return false;
      }
      return true;
    });

    if (managerOrdersCountLabel) {
      managerOrdersCountLabel.textContent = `${filtered.length} de ${currentLoadedOrders.length} pedido(s) listado(s)`;
    }

    if (filtered.length === 0) {
      managerOrdersList.innerHTML = `
        <div class="manager-empty-state">
          <span class="empty-icon">📋</span>
          <h5 class="empty-title">Nenhum pedido encontrado</h5>
          <p class="empty-sub">
            ${currentLoadedOrders.length === 0 
              ? 'Ainda não há pedidos registrados. Assim que os clientes comprarem e anexarem o comprovante, eles aparecerão aqui automaticamente!' 
              : 'Nenhum resultado corresponde aos filtros selecionados acima.'}
          </p>
        </div>
      `;
      return;
    }

    filtered.forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-card';

      const initial = (order.customerName ? order.customerName.charAt(0) : 'C').toUpperCase();
      const statusClass = (order.status || 'Confirmado').toLowerCase();
      const cleanPhone = (order.customerPhone || '').replace(/\D/g, '');
      const waNumber = cleanPhone.startsWith('55') ? cleanPhone : ('55' + cleanPhone);
      const isPdf = (order.receiptFileType || '').includes('pdf') || (order.receiptFileName || '').toLowerCase().endsWith('.pdf');

      // Área do Comprovante
      let receiptHtml = '';
      if (order.receiptDataUrl) {
        if (isPdf) {
          receiptHtml = `
            <div class="order-receipt-col">
              <div class="order-receipt-info">
                <span class="order-receipt-status-text">📄 PDF do Comprovante</span>
                <span class="order-receipt-filename">${order.receiptFileName || 'comprovante.pdf'}</span>
                <div class="order-receipt-actions">
                  <button type="button" class="btn-view-receipt btn-zoom-action" data-id="${order.id}">Abrir PDF</button>
                </div>
              </div>
            </div>
          `;
        } else {
          receiptHtml = `
            <div class="order-receipt-col">
              <div class="order-receipt-thumb-wrap btn-zoom-action" data-id="${order.id}">
                <img src="${order.receiptDataUrl}" alt="Comprovante" class="order-receipt-thumb">
                <span class="receipt-thumb-badge">🔍</span>
              </div>
              <div class="order-receipt-info">
                <span class="order-receipt-status-text">✓ Comprovante Anexado</span>
                <span class="order-receipt-filename">${order.receiptFileName || 'comprovante.jpg'}</span>
                <div class="order-receipt-actions">
                  <button type="button" class="btn-view-receipt btn-zoom-action" data-id="${order.id}">Ver Foto</button>
                  <a href="${order.receiptDataUrl}" download="${order.receiptFileName || 'comprovante.jpg'}" class="btn-view-receipt">Baixar</a>
                </div>
              </div>
            </div>
          `;
        }
      } else if (order.hasReceipt) {
        receiptHtml = `
          <div class="order-receipt-col">
            <div class="order-receipt-info">
              <span class="order-receipt-status-text">📎 Comprovante Registrado</span>
              <span class="order-receipt-filename">${order.receiptFileName || 'comprovante.jpg'}</span>
            </div>
          </div>
        `;
      } else {
        receiptHtml = `
          <div class="order-receipt-col">
            <div class="no-receipt-warning">
              <span>⚠️ Sem anexo de comprovante</span>
            </div>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="order-card-header">
          <div class="order-customer-info">
            <div class="order-cust-avatar">${initial}</div>
            <div class="order-cust-name-row">
              <span class="order-cust-name">${order.customerName || 'Cliente Anônimo'}</span>
              <span class="order-date-badge">🗓️ ${order.displayDate || ''} às ${order.displayTime || ''}</span>
            </div>
          </div>
          <div class="order-tags-wrap">
            <span class="order-size-badge">TAM: ${order.size || 'M'}</span>
            <span class="order-status-badge status-${statusClass}" data-id="${order.id}" title="Clique para alternar status">
              ${order.status || 'Confirmado'}
            </span>
          </div>
        </div>

        <div class="order-card-body">
          <div class="order-details-col">
            <div class="order-detail-line">
              <span>📱 <strong>WhatsApp:</strong> ${order.customerPhone || 'Não informado'}</span>
            </div>
            ${cleanPhone ? `
              <a href="https://wa.me/${waNumber}?text=${encodeURIComponent(`Olá ${order.customerName}, aqui é da organização do Corre Potengi referente ao seu pedido da camisa!`)}" target="_blank" class="btn-whatsapp-direct">
                <span>💬 Chamar no WhatsApp</span>
              </a>
            ` : ''}
            <div class="order-detail-line" style="margin-top: 4px;">
              <span>👕 <strong>Qtd:</strong> ${order.quantity || 1} un.</span>
              <span>•</span>
              <span>💰 <strong>Total:</strong> R$ ${order.total || '49,99'}</span>
            </div>
            <div class="order-detail-line">
              <span>📍 Retirada: SCOFIELD</span>
            </div>
          </div>

          ${receiptHtml}
        </div>

        <div class="order-card-footer">
          <span>ID: ${order.id}</span>
          <button type="button" class="btn-delete-order" data-id="${order.id}">
            <span>🗑️ Excluir</span>
          </button>
        </div>
      `;

      managerOrdersList.appendChild(card);
    });

    // Eventos dentro dos cards (Zoom, Status, Excluir)
    managerOrdersList.querySelectorAll('.btn-zoom-action').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const found = currentLoadedOrders.find(o => o.id === id);
        if (found && found.receiptDataUrl) {
          openReceiptZoom(found);
        }
      });
    });

    managerOrdersList.querySelectorAll('.order-status-badge').forEach(badge => {
      badge.addEventListener('click', async () => {
        const id = badge.getAttribute('data-id');
        const found = currentLoadedOrders.find(o => o.id === id);
        if (!found) return;

        let nextStatus = 'Confirmado';
        if (found.status === 'Confirmado') nextStatus = 'Entregue';
        else if (found.status === 'Entregue') nextStatus = 'Pendente';
        else nextStatus = 'Confirmado';

        found.status = nextStatus;
        await updateOrderStatusInDB(id, nextStatus);
        renderOrdersList();
      });
    });

    managerOrdersList.querySelectorAll('.btn-delete-order').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        if (confirm('Deseja realmente remover este pedido da listagem do gestor e da nuvem?')) {
          currentLoadedOrders = currentLoadedOrders.filter(o => o.id !== id);
          renderMetrics(currentLoadedOrders);
          renderSizeSummary(currentLoadedOrders);
          renderOrdersList();
          showManagerToast('Excluindo pedido da nuvem...');
          await deleteOrderFromDB(id);
          showManagerToast('Pedido removido com sucesso.');
        }
      });
    });
  }

  // Filtro de Tamanho (TODOS, M, G)
  const sizeFilterBtns = document.querySelectorAll('#managerSizeFilterButtons .filter-btn');
  sizeFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sizeFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilterSize = btn.getAttribute('data-filter-size');
      renderOrdersList();
    });
  });

  // Filtro de Comprovante (TODOS, COM ANEXO, SEM ANEXO)
  const receiptFilterBtns = document.querySelectorAll('#managerReceiptFilterButtons .filter-btn');
  receiptFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      receiptFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilterReceipt = btn.getAttribute('data-filter-receipt');
      renderOrdersList();
    });
  });

  // Busca em tempo real por Nome ou WhatsApp
  if (managerSearchInput) {
    managerSearchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value.trim();
      if (btnClearSearch) {
        if (activeSearchQuery) btnClearSearch.classList.remove('hidden');
        else btnClearSearch.classList.add('hidden');
      }
      renderOrdersList();
    });
  }

  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      managerSearchInput.value = '';
      activeSearchQuery = '';
      btnClearSearch.classList.add('hidden');
      renderOrdersList();
    });
  }

  /* --------------------------------------------------
     14. MODAL DE ZOOM DO COMPROVANTE (LIGHTROOM)
     -------------------------------------------------- */
  const receiptZoomModal = document.getElementById('receiptZoomModal');
  const closeReceiptZoomBtn = document.getElementById('closeReceiptZoomBtn');
  const receiptZoomContent = document.getElementById('receiptZoomContent');
  const receiptZoomMeta = document.getElementById('receiptZoomMeta');
  const receiptZoomTitle = document.getElementById('receiptZoomTitle');
  const receiptZoomDownloadBtn = document.getElementById('receiptZoomDownloadBtn');

  function openReceiptZoom(order) {
    if (!receiptZoomModal || !receiptZoomContent) return;

    const isPdf = (order.receiptFileType || '').includes('pdf') || (order.receiptFileName || '').toLowerCase().endsWith('.pdf');
    receiptZoomMeta.textContent = `Cliente: ${order.customerName} • WhatsApp: ${order.customerPhone}`;
    receiptZoomTitle.textContent = order.receiptFileName || 'Comprovante Oficial';

    if (receiptZoomDownloadBtn) {
      receiptZoomDownloadBtn.href = order.receiptDataUrl;
      receiptZoomDownloadBtn.download = order.receiptFileName || (isPdf ? 'comprovante.pdf' : 'comprovante.jpg');
    }

    if (isPdf) {
      receiptZoomContent.innerHTML = `<iframe src="${order.receiptDataUrl}" class="receipt-pdf-frame"></iframe>`;
    } else {
      receiptZoomContent.innerHTML = `<img src="${order.receiptDataUrl}" alt="Comprovante" class="receipt-zoom-img">`;
    }

    receiptZoomModal.style.display = 'flex';
    requestAnimationFrame(() => {
      receiptZoomModal.classList.add('open');
      receiptZoomModal.setAttribute('aria-hidden', 'false');
    });
  }

  function closeReceiptZoom() {
    if (!receiptZoomModal) return;
    receiptZoomModal.classList.remove('open');
    receiptZoomModal.setAttribute('aria-hidden', 'true');
    setTimeout(() => {
      if (!receiptZoomModal.classList.contains('open')) {
        receiptZoomModal.style.display = 'none';
      }
    }, 250);
    if (receiptZoomContent) receiptZoomContent.innerHTML = '';
  }

  if (closeReceiptZoomBtn) closeReceiptZoomBtn.addEventListener('click', closeReceiptZoom);
  if (receiptZoomModal) {
    receiptZoomModal.addEventListener('click', (e) => {
      if (e.target === receiptZoomModal) closeReceiptZoom();
    });
  }

  /* --------------------------------------------------
     15. EXPORTAR PLANILHA CSV (EXCEL / PRODUÇÃO)
     -------------------------------------------------- */
  if (btnExportOrdersCsv) {
    btnExportOrdersCsv.addEventListener('click', () => {
      if (currentLoadedOrders.length === 0) {
        alert('Não há pedidos registrados para exportar.');
        return;
      }

      // Monta o CSV com BOM UTF-8 para abrir com acentuação correta no Excel
      let csvContent = '\uFEFF';
      csvContent += 'Data;Hora;Nome do Cliente;WhatsApp / Telefone;Tamanho;Quantidade;Valor Total (R$);Possui Comprovante;Nome do Arquivo;Status\n';

      currentLoadedOrders.forEach(o => {
        const row = [
          `"${o.displayDate || ''}"`,
          `"${o.displayTime || ''}"`,
          `"${(o.customerName || '').replace(/"/g, '""')}"`,
          `"${(o.customerPhone || '').replace(/"/g, '""')}"`,
          `"${o.size || 'M'}"`,
          `"${o.quantity || 1}"`,
          `"${o.total || '49,99'}"`,
          `"${(o.hasReceipt || o.receiptDataUrl) ? 'Sim' : 'Não'}"`,
          `"${(o.receiptFileName || '').replace(/"/g, '""')}"`,
          `"${o.status || 'Confirmado'}"`
        ];
        csvContent += row.join(';') + '\n';
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pedidos_corre_potengi_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showManagerToast('📥 Planilha CSV exportada com sucesso!');
    });
  }

  /* --------------------------------------------------
     16. SIMULAÇÃO DE PEDIDO DE TESTE (DEMONSTRAÇÃO RÁPIDA)
     -------------------------------------------------- */
  if (btnAddTestOrder) {
    btnAddTestOrder.addEventListener('click', async () => {
      const demoNames = ['Lucas Medeiros', 'Mariana Costa', 'Gabriel Santana', 'Beatriz Lima', 'Thiago Araújo'];
      const demoSizes = ['M', 'G', 'M', 'M', 'G'];
      const randomIdx = Math.floor(Math.random() * demoNames.length);

      // Cria um canvas pequeno simulando imagem de comprovante PIX
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#081120';
      ctx.fillRect(0, 0, 400, 300);
      ctx.fillStyle = '#FF5500';
      ctx.fillRect(0, 0, 400, 40);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('COMPROVANTE DE PAGAMENTO PIX', 20, 26);
      ctx.fillStyle = '#FFCC00';
      ctx.font = 'bold 24px sans-serif';
      ctx.fillText('R$ 49,99', 20, 90);
      ctx.fillStyle = '#E5E7EB';
      ctx.font = '14px sans-serif';
      ctx.fillText(`Pagador: ${demoNames[randomIdx]}`, 20, 130);
      ctx.fillText('Destinatário: Aylson Gabriel (Corre Potengi)', 20, 160);
      ctx.fillText(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 190);
      ctx.fillText('Status: TRANSFERÊNCIA REALIZADA COM SUCESSO', 20, 230);
      const demoDataUrl = canvas.toDataURL('image/jpeg', 0.85);

      const testOrder = {
        id: 'TEST_' + Date.now(),
        customerName: demoNames[randomIdx],
        customerPhone: '(84) 9' + Math.floor(10000000 + Math.random() * 90000000),
        size: demoSizes[randomIdx],
        quantity: 1,
        total: '49,99',
        totalRaw: 49.99,
        pickupLocation: state.pickupLocation,
        timestamp: Date.now(),
        displayDate: new Date().toLocaleDateString('pt-BR'),
        displayTime: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        hasReceipt: true,
        receiptFileName: 'comprovante_pix_teste.jpg',
        receiptFileType: 'image/jpeg',
        receiptDataUrl: demoDataUrl,
        status: 'Confirmado'
      };

      await saveOrderToDB(testOrder);
      await loadAndRenderDashboard();
      showManagerToast('🧪 Pedido de teste criado com sucesso!');
    });
  }

  /* --------------------------------------------------
     17. LIMPAR HISTÓRICO DE PEDIDOS
     -------------------------------------------------- */
  if (btnClearAllOrders) {
    btnClearAllOrders.addEventListener('click', async () => {
      if (confirm('Tem certeza que deseja apagar TODOS os pedidos do banco de dados do gestor e da nuvem? Esta ação não pode ser desfeita.')) {
        showManagerToast('Limpando todo o histórico da nuvem...');
        await clearAllOrdersFromDB();
        currentLoadedOrders = [];
        renderMetrics(currentLoadedOrders);
        renderSizeSummary(currentLoadedOrders);
        renderOrdersList();
        showManagerToast('🗑️ Histórico totalmente limpo na nuvem e no dispositivo.');
      }
    });
  }

  /* --------------------------------------------------
     11. MODAL: GUIA DE MEDIDAS
     -------------------------------------------------- */
  const sizeGuideModal = document.getElementById('sizeGuideModal');
  const openSizeGuideBtn = document.getElementById('openSizeGuideBtn');
  const closeSizeGuideBtn = document.getElementById('closeSizeGuideBtn');
  const confirmSizeBtn = document.getElementById('confirmSizeBtn');

  function openSizeGuide() {
    sizeGuideModal.classList.add('open');
  }

  function closeSizeGuide() {
    sizeGuideModal.classList.remove('open');
  }

  if (openSizeGuideBtn) openSizeGuideBtn.addEventListener('click', openSizeGuide);
  if (closeSizeGuideBtn) closeSizeGuideBtn.addEventListener('click', closeSizeGuide);
  if (confirmSizeBtn) confirmSizeBtn.addEventListener('click', closeSizeGuide);

  sizeGuideModal.addEventListener('click', (e) => {
    if (e.target === sizeGuideModal) closeSizeGuide();
  });

  /* --------------------------------------------------
     12. MODAL: CARRINHO RÁPIDO
     -------------------------------------------------- */
  const checkoutModal = document.getElementById('checkoutModal');
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCheckoutBtn = document.getElementById('closeCheckoutBtn');
  const goToBuySectionBtn = document.getElementById('goToBuySectionBtn');

  function openCheckout() {
    updateSummaryDisplay();
    checkoutModal.classList.add('open');
  }

  function closeCheckout() {
    checkoutModal.classList.remove('open');
  }

  if (openCartBtn) openCartBtn.addEventListener('click', openCheckout);
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);
  if (goToBuySectionBtn) {
    goToBuySectionBtn.addEventListener('click', () => {
      closeCheckout();
    });
  }

  checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) closeCheckout();
  });

  // Inicializa dados com total inicial
  updateSummaryDisplay();
});
