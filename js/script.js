/* =========================================================
   ✅ INJETA FUNDO COM LOGO ATRÁS DO CARD (sem quebrar layout)
========================================================= */

(function aplicarLogoFundoTelaPrincipal() {

  // Tenta localizar o container principal da tela.
  // (Mantive várias opções porque seu sistema pode ter nomes diferentes)
  const root =
    document.querySelector(".tela-principal") ||
    document.querySelector(".main-content") ||
    document.querySelector(".container-principal") ||
    document.querySelector("main") ||
    document.body;

  if (!root) return;

  // Evita duplicar se já existir
  if (root.querySelector(".fundo-logo-bg")) return;

  // Root precisa ser relativo para o fundo funcionar
  const styleRoot = window.getComputedStyle(root);
  if (styleRoot.position === "static") {
    root.style.position = "relative";
  }

  // Cria o fundo
  const fundo = document.createElement("div");
  fundo.className = "fundo-logo-bg";

  // Coloca como PRIMEIRO elemento dentro do root (para ficar atrás)
  root.insertBefore(fundo, root.firstChild);

})();

