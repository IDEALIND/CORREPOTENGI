/* ==========================================================================
   CORRE POTENGI - MOTOR DE COMPRA & E-COMMERCE MOBILE PIX
   WhatsApp Oficial: (84) 99683-8268 | Chave PIX: 0fc3c151-a306-45d0-9197-937a46b42339
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

  const WHATSAPP_NUMBER = '5584996838268';
  const PIX_RANDOM_KEY = '0fc3c151-a306-45d0-9197-937a46b42339';
  const PIX_BENEFICIARY = 'AYLSON GABRIEL DA SILVA PEREIRA (Banco Inter)';

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
    const pixKey = PIX_RANDOM_KEY;
    const name = "AYLSON GABRIEL D S PEREIR";
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
  const mainHeader = document.getElementById('mainHeader');
  const stickyBottomBar = document.getElementById('stickyBottomBar');
  const heroCtaMain = document.getElementById('heroCtaMain');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }

    if (heroCtaMain) {
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

  function updateSummaryDisplay() {
    const rawTotal = calculateRawTotal();
    const formattedTotal = calculateFormattedTotal();

    // 1. Gera o payload oficial do Pix com o valor EXATO
    currentPixPayload = generatePixPayload(rawTotal);

    // 2. Atualiza o QR Code dinamicamente com o valor embutido
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentPixPayload)}`;
    
    if (pixQrImg) {
      pixQrImg.src = qrUrl;
      pixQrImg.onerror = () => {
        pixQrImg.src = 'assets/qrcode_only.png';
      };
    }

    if (modalPixQrImg) {
      modalPixQrImg.src = qrUrl;
      modalPixQrImg.onerror = () => {
        modalPixQrImg.src = 'assets/qrcode_only.png';
      };
    }

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
     8. COPIAR CHAVE PIX ALEATÓRIA SIMPLES
     -------------------------------------------------- */
  function setupCopyKeyButton(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(PIX_RANDOM_KEY).then(() => {
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
        prompt('Copie a chave Pix aleatória manualmente:', PIX_RANDOM_KEY);
      });
    });
  }

  setupCopyKeyButton('btnCopyPixDirect');
  setupCopyKeyButton('btnCopyPixModal');

  /* --------------------------------------------------
     9. UPLOAD DO COMPROVANTE DE PAGAMENTO
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
        state.receiptFileName = file.name;
        selectedFilename.textContent = file.name;
        dropzonePrompt.classList.add('hidden');
        dropzoneSelected.classList.remove('hidden');
      }
    });
  }

  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', (e) => {
      e.stopPropagation();
      receiptFileInput.value = '';
      state.receiptFileName = '';
      dropzonePrompt.classList.remove('hidden');
      dropzoneSelected.classList.add('hidden');
    });
  }

  /* --------------------------------------------------
     10. ENVIO DO PEDIDO PARA O WHATSAPP COM COMPROVANTE
     -------------------------------------------------- */
  const submitOrderBtn = document.getElementById('submitOrderBtn');

  if (submitOrderBtn) {
    submitOrderBtn.addEventListener('click', () => {
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

      let msg = `🏃 *PEDIDO OFICIAL - CORRE POTENGI 2026*\n\n`;
      msg += `Olá! Realizei o pagamento via PIX e quero confirmar minha camisa oficial:\n\n`;
      msg += `👕 *Produto:* Camisa Oficial Corre Potengi (UNISSEX)\n`;
      msg += `📏 *Tamanho Escolhido:* ${state.size}\n`;
      msg += `🔢 *Quantidade:* ${state.quantity} un.\n`;
      msg += `💰 *Valor Total Pago:* R$ ${total}\n`;
      msg += `⚡ *Chave PIX Utilizada:* ${PIX_RANDOM_KEY}\n`;
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
