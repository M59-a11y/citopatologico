/* =========================================================
   ✅ INJETA FUNDO COM LOGO ATRÁS DO CARD (sem quebrar layout)
========================================================= */

(function aplicarLogoFundoTelaPrincipal() {

  const root =
    document.querySelector(".tela-principal") ||
    document.querySelector(".main-content") ||
    document.querySelector(".container-principal") ||
    document.querySelector("main") ||
    document.body;

  if (!root) return;

  // Evita duplicar se já existir
  if (root.querySelector(".fundo-logo-bg")) return;

  // Root precisa ser relativo
  const styleRoot = window.getComputedStyle(root);
  if (styleRoot.position === "static") {
    root.style.position = "relative";
  }

  const fundo = document.createElement("div");
  fundo.className = "fundo-logo-bg";

  // coloca atrás
  root.insertBefore(fundo, root.firstChild);

})();
