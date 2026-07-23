/* ====================================================================
   GRAMEIRA KONS — CONFIGURAÇÃO DE CONTATO
   Mude só aqui quando tiver os dados reais. O site inteiro (botões de
   WhatsApp, telefone, e-mail e o formulário) usa estas informações.
   ==================================================================== */
const CONFIG = {
  // Apenas números, com código do país (55) + DDD. Ex: "5548999998888"
  whatsappNumber: "5548984540699",
  phoneDisplay: "(48) 98454-0699",
  email: "contato@grameirakons.com.br",
};

/* ---------------------------------------------------------------------
   Preenche todos os links de contato da página a partir do CONFIG acima
   --------------------------------------------------------------------- */
function aplicarContatos() {
  document.querySelectorAll(".wa-link").forEach((el) => {
    const msg = el.getAttribute("data-msg") || "Olá! Vim pelo site da Grameira Kons.";
    el.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    el.target = "_blank";
    el.rel = "noopener";
  });

  document.querySelectorAll("[data-wa-display]").forEach((el) => {
    el.textContent = CONFIG.phoneDisplay + " (WhatsApp)";
  });

  document.querySelectorAll("[data-tel-link]").forEach((el) => {
    el.href = `tel:+${CONFIG.whatsappNumber}`;
  });
  document.querySelectorAll("[data-phone-display]").forEach((el) => {
    el.textContent = CONFIG.phoneDisplay;
  });

  document.querySelectorAll("[data-email-link]").forEach((el) => {
    el.href = `mailto:${CONFIG.email}`;
  });
  document.querySelectorAll("[data-email-display]").forEach((el) => {
    el.textContent = CONFIG.email;
  });
}

/* ---------------------------------------------------------------------
   Placeholder visual para fotos que ainda não foram adicionadas
   --------------------------------------------------------------------- */
function handleImgError(img) {
  const wrapper = img.closest(".ph, .ph-tall, .media-box, .product-media, .quality-media");
  if (!wrapper) return;
  img.style.display = "none";
  wrapper.classList.add("img-missing");
  if (!wrapper.querySelector(".ph-label")) {
    const label = document.createElement("span");
    label.className = "ph-label";
    label.textContent = wrapper.getAttribute("data-label") || img.alt || "Foto em breve";
    wrapper.appendChild(label);
  }
}
window.handleImgError = handleImgError;

/* ---------------------------------------------------------------------
   Header fixo com fundo ao rolar + menu mobile
   --------------------------------------------------------------------- */
function configurarHeader() {
  const header = document.getElementById("header");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", () => {
    links.classList.toggle("open");
  });
  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => links.classList.remove("open"));
  });
}

/* ---------------------------------------------------------------------
   Animação de revelar ao rolar a página
   --------------------------------------------------------------------- */
function configurarReveal() {
  const alvos = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("in-view");
          observer.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  alvos.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------------
   Contadores animados (ex: 40 anos)
   --------------------------------------------------------------------- */
function configurarContadores() {
  const contadores = document.querySelectorAll(".counter");
  if (!contadores.length) return;

  const anima = (el) => {
    const alvo = parseInt(el.getAttribute("data-target"), 10) || 0;
    const duracao = 1400;
    const inicio = performance.now();
    function passo(agora) {
      const progresso = Math.min((agora - inicio) / duracao, 1);
      el.textContent = Math.floor(progresso * alvo);
      if (progresso < 1) requestAnimationFrame(passo);
      else el.textContent = alvo;
    }
    requestAnimationFrame(passo);
  };

  const observer = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          anima(entrada.target);
          observer.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  contadores.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------------
   Lightbox para os vídeos da galeria
   --------------------------------------------------------------------- */
function configurarLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxVideo = document.getElementById("lightboxVideo");
  const btnFechar = document.getElementById("lightboxClose");

  document.querySelectorAll(".video-item").forEach((item) => {
    item.addEventListener("click", () => {
      const src = item.getAttribute("data-video");
      lightboxVideo.src = src;
      lightbox.classList.add("open");
      lightboxVideo.play();
    });
  });

  const fechar = () => {
    lightbox.classList.remove("open");
    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.load();
  };
  btnFechar.addEventListener("click", fechar);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) fechar();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fechar();
  });
}

/* ---------------------------------------------------------------------
   Formulário de orçamento -> abre o WhatsApp com a mensagem pronta
   --------------------------------------------------------------------- */
function configurarFormulario() {
  const form = document.getElementById("quoteForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = new FormData(form);
    const nome = dados.get("nome") || "";
    const telefone = dados.get("telefone") || "";
    const cidade = dados.get("cidade") || "";
    const metragem = dados.get("metragem") || "não informada";
    const grama = dados.get("grama") || "";
    const mensagem = dados.get("mensagem") || "";

    const texto =
      `Olá! Gostaria de um orçamento de grama.\n\n` +
      `Nome: ${nome}\n` +
      `Telefone: ${telefone}\n` +
      `Cidade: ${cidade}\n` +
      `Metragem aproximada: ${metragem}\n` +
      `Tipo de grama: ${grama}` +
      (mensagem ? `\nMensagem: ${mensagem}` : "");

    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(texto)}`, "_blank");
  });
}

/* ---------------------------------------------------------------------
   Init
   --------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  aplicarContatos();
  configurarHeader();
  configurarReveal();
  configurarContadores();
  configurarLightbox();
  configurarFormulario();
  const anoEl = document.getElementById("year");
  if (anoEl) anoEl.textContent = new Date().getFullYear();
});
