// Gestão de UI
class UIManager {
  constructor(app) {
    this.app = app;
    this.visualizationEngine = app.visualizationEngine;
    this.audioProcessor = app.audioProcessor;

    this.setupEventListeners();
    this.setupAudioLevels();
  }

  updatePropertiesPanel() {
    // TODO: atualizar painel de propriedades
    const $propertiesContainer = $("#properties-container");
    $propertiesContainer.empty();

    const properties = this.visualizationEngine.getVisualizationProperties();

    Object.entries(properties).forEach(([property, config]) => {
      if (config.min !== undefined) {
        // para as propriedades numéricas
        const control = this.createPropertyControl(property, config);
        $propertiesContainer.append(control);
      }
    });
    console.log("Atualizando painel de propriedades...");
  }

  updateAudioInfo(info, isError = false) {
    // TODO: atualizar informações de áudio
    const $audioStatus = $("#audioStatus");
    const $audioLevel = $("#audioLevel");

    if (isError) {
      $audioStatus.text(`Erro: ${info.status || info}`).css("color", "#f72585");
    } else {
      $audioStatus
        .text(`Áudio: ${info.status || "ON"}`)
        .css("color", "#e6e6e6");
      $audioLevel.text(`Nível: ${info.level || 0}%`);

      this.updateLevelMeter(info.level || 0); // atualizar o medidor visual
    }
  }

  setButtonStates(playing) {
    // TODO: atualizar estados dos botões baseado no status de reprodução
    const $startMicBtn = $("#startMic");
    const $stopAudioBtn = $("#stopAudio");

    $startMicBtn.prop("disabled", playing);
    $stopAudioBtn.prop("disabled", !playing);
  }

  showError(message) {
    // TODO: mostrar mensagem de erro
    console.error("ERRO UI:", message);

    const $errorModal = $("#errorModal");
    const $errorMessage = $("#errorMessage");

    if ($errorModal.length > 0 && $errorMessage.length > 0) {
      $errorMessage.text(message);
      $errorModal.removeClass("hidden");
    }

    // Fechar modal ao clicar no X
    document.querySelector(".close").onclick = () => {
      $errorModal.addClass("hidden");
    };

    // Fechar modal ao clicar fora
    window.onclick = (event) => {
      if (event.target === errorModal) {
        $errorModal.addClass("hidden");
      }
    };
  }

  setupEventListeners() {
    // TODO: configurar event listeners
    // tratamento de eventos

    // Iniciar Microfone
    $("#startMic").on("click", () => {
      this.app.startMicrophone();
    });

    // Parar Áudio
    $("#stopAudio").on("click", () => {
      this.app.stopAudio();
    });

    // Carregar Ficheiro de Áudio
    $("#audioFile").on("change", (e) => {
      if (e.target.files.length > 0) {
        this.app.loadAudioFile(e.target.files[0]);
      }
    });

    // Tipo de Visualização
    $("#visualizationType").on("change", (e) => {
      this.app.setVisualization(e.target.value);
    });

    // Formato de Exportação
    $("#exportPNG").on("click", () => {
      this.app.exportFrame("png");
    });

    $("#exportJPEG").on("click", () => {
      this.app.exportFrame("jpeg");
    });
  }

  setupAudioLevels() {
    // TODO: configurar monitorização de níveis de áudio
    //guardar referência para atualização
    this.$levelBar = $("#audioInfo").find(".level-bar");
    this.$levelText = $("#audioInfo").find(".level-text");
  }

  updateLevelMeter(level) {
    if (this.$levelBar && this.$levelText) {
      // Usar requestAnimationFrame para updates suaves
      requestAnimationFrame(() => {
        this.$levelBar.css("width", level + "%");
        this.$levelText.text(level + "%");

        // Mudar cor baseado no nível
        if (level > 80) {
          this.$levelBar.css("background-color", "#f72585");
        } else if (level > 50) {
          this.$levelBar.css("background-color", "#ffaa00");
        } else {
          this.$levelBar.css("background-color", "#4cc9f0");
        }
      });
    }
  }

  createPropertyControl(property, config) {
    // TODO: criar controlo de propriedade
    const $container = $("<div>").addClass("property-control"); //o conteiner e a sua class

    const $label = $("<label>")
      .attr("for", `prop-${property}`)
      .text(`${property}: ${config.value.toFixed(1)}`);

    const $input = $("<input>").attr({
      //criar o range slider (input) e definir attributes
      type: "range",
      id: `prop-${property}`,
      min: config.min,
      max: config.max,
      step: config.step,
      value: config.value,
    });

    // Atualiza propriedade em tempo real durante interação
    $input.on("input", (e) => {
      const value = parseFloat(e.target.value);

      // Atualiza o texto da label
      $label.text(`${property}: ${value.toFixed(1)}`);

      // Atualiza a propriedade na engine
      this.visualizationEngine.updateVisualizationProperty(property, value);
    });

    $container.append($label, $input);

    return $container;
  }
}

export { UIManager };
