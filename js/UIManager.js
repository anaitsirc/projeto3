// Gestão de UI
class UIManager {
  constructor(app) {
    this.app = app;
    this.visualizationEngine = app.visualizationEngine;
    this.audioProcessor = app.audioProcessor;

    // CORREÇÃO: Esperar que o DOM esteja pronto com jQuery
    $(document).ready(() => {
      console.log("🟢 DOM Pronto - Configurando event listeners...");
      this.setupEventListeners();
    });
  }

  updatePropertiesPanel() {
    // TODO: atualizar painel de propriedades
    console.log("Atualizando painel de propriedades...");
  }

  updateAudioInfo(info, isError = false) {
    // TODO: atualizar informações de áudio
    // CORREÇÃO: Usar jQuery para encontrar elementos
    const $audioStatus = $("#audioStatus");
    const $audioLevel = $("#audioLevel");

    if ($audioStatus.length > 0) {
      if (isError) {
        $audioStatus
          .text(`Erro: ${info.status || info}`)
          .css("color", "#f72585");
      } else {
        $audioStatus
          .text(`Áudio: ${info.status || "Ativo"}`)
          .css("color", "#e6e6e6");
      }
    }

    if ($audioLevel.length > 0) {
      $audioLevel.text(`Nível: ${info.level || 0}%`);
    }
  }

  setButtonStates(playing) {
    // TODO: atualizar estados dos botões
    // CORREÇÃO: Usar jQuery
    const $startMicBtn = $("#startMic");
    const $stopAudioBtn = $("#stopAudio");

    if ($startMicBtn.length > 0) {
      $startMicBtn.prop("disabled", playing);
    }
    if ($stopAudioBtn.length > 0) {
      $stopAudioBtn.prop("disabled", !playing);
    }
  }

  showError(message) {
    // TODO: mostrar mensagem de erro
    console.error("ERRO UI:", message);
    // CORREÇÃO: Usar jQuery
    const $errorModal = $("#errorModal");
    const $errorMessage = $("#errorMessage");

    if ($errorModal.length > 0 && $errorMessage.length > 0) {
      $errorMessage.text(message);
      $errorModal.removeClass("hidden");
    }
  }

  setupEventListeners() {
    // TODO: configurar event listeners
    console.log("🟢 Configurando event listeners com jQuery...");

    // CORREÇÃO: Verificar se elementos existem com jQuery
    console.log("🔍 startMic encontrado:", $("#startMic").length > 0);
    console.log("🔍 stopAudio encontrado:", $("#stopAudio").length > 0);
    console.log("🔍 audioFile encontrado:", $("#audioFile").length > 0);
    console.log(
      "🔍 visualizationType encontrado:",
      $("#visualizationType").length > 0
    );

    // 1. Controles de Áudio - CORREÇÃO: Usar jQuery corretamente

    // Iniciar Microfone
    $("#startMic").on("click", () => {
      console.log("🎤 Botão Iniciar Microfone CLICADO (jQuery)");
      this.app.startMicrophone();
    });

    // Parar Áudio
    $("#stopAudio").on("click", () => {
      console.log("⏹️ Botão Parar Áudio CLICADO");
      this.app.stopAudio();
    });

    // Carregar Ficheiro de Áudio
    $("#audioFile").on("change", (e) => {
      console.log("📁 Ficheiro selecionado");
      if (e.target.files.length > 0) {
        this.app.loadAudioFile(e.target.files[0]);
      }
    });

    // 2. Controles de Visualização
    $("#visualizationType").on("change", (e) => {
      console.log("🎨 Visualização alterada:", e.target.value);
      this.app.setVisualization(e.target.value);
    });

    // 3. Controles de Exportação
    $("#exportPNG").on("click", () => {
      console.log("📸 Exportar PNG");
      this.app.exportFrame("png");
    });

    $("#exportJPEG").on("click", () => {
      console.log("📸 Exportar JPEG");
      this.app.exportFrame("jpeg");
    });

    console.log("🟢 Event listeners jQuery configurados");
  }

  setupAudioLevels() {
    // TODO: configurar monitorização de níveis de áudio
  }

  createPropertyControl(property, value, min, max, step) {
    // TODO: criar controlo de propriedade
    const container = document.createElement("div");
    container.className = "property-control";

    const label = document.createElement("label");
    label.textContent = property;
    label.htmlFor = `prop-${property}`;

    const input = document.createElement("input");
    input.type = "range";
    input.id = `prop-${property}`;
    input.min = min;
    input.max = max;
    input.step = step;
    input.value = value;

    input.addEventListener("input", (e) => {
      this.visualizationEngine.updateVisualizationProperty(
        property,
        parseFloat(e.target.value)
      );
    });

    container.appendChild(label);
    container.appendChild(input);

    return container;
  }
}

export { UIManager };
