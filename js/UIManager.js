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
    
    // Adicionar o nome da visualização atual
    const currentVizName = this.visualizationEngine.currentVisualization 
                         ? this.visualizationEngine.currentVisualization.name 
                         : "N/A";

    $("#properties-panel h3").text(`Propriedades: ${currentVizName}`);

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
      
      // Apenas atualiza o nível se for fornecido (para evitar flashes)
      if (info.level !== undefined) {
        $audioLevel.text(`Nível: ${info.level || 0}%`);
        this.updateLevelMeter(info.level || 0); // atualizar o medidor visual
      }
    }
  }

  setButtonStates(playing) {
    // TODO: atualizar estados dos botões baseado no status de reprodução
    const $startMicBtn = $("#startMic");
    const $stopAudioBtn = $("#stopAudio");
    const $playAudioBtn = $("#playAudio");
    const $audioFile = $("#audioFile");
    
    // O botão Parar funciona SEMPRE que está a tocar
    $stopAudioBtn.prop("disabled", !playing);

    if (playing) {
        // Se está a tocar (Mic ou File), desativa tudo o que inicia
        $startMicBtn.prop("disabled", true);
        $playAudioBtn.prop("disabled", true);
        $audioFile.prop("disabled", true);
    } else {
        // Se está parado
        $startMicBtn.prop("disabled", false);
        $audioFile.prop("disabled", false);
        // O botão playAudio só ativa se houver um ficheiro selecionado
        $playAudioBtn.prop("disabled", $audioFile.prop("files").length === 0);
    }
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
    // Tratamento de eventos

    // Iniciar Microfone
    $("#startMic").on("click", () => {
      this.app.startMicrophone();
    });

    // Parar Áudio
    $("#stopAudio").on("click", () => {
      this.app.stopAudio();
    });

    // Carregar Ficheiro de Áudio (seleção)
    $("#audioFile").on("change", (e) => {
      const files = $(e.target).prop("files");
      if (files.length > 0) {
          // Ativa o botão Reproduzir quando um ficheiro é selecionado
          $("#playAudio").prop("disabled", false);
          this.updateAudioInfo({ status: `FILE READY: ${files[0].name}` });
      } else {
          $("#playAudio").prop("disabled", true);
          this.updateAudioInfo({ status: "OFF" });
      }
    });
    
    // ✅ NOVO BOTÃO: Reproduzir Áudio
    $("#playAudio").on("click", () => {
        const files = $("#audioFile").prop("files");
        if (files.length > 0) {
            this.app.loadAudioFile(files[0]);
        } else {
            this.showError("Selecione um ficheiro de áudio primeiro.");
        }
    });

    // Tipo de Visualização
    $("#visualizationType").on("change", (e) => {
      this.app.setVisualization($(e.target).val());
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
    // guardar referência para atualização
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
    const $container = $("<div>").addClass("property-control"); 

    const $label = $("<label>")
      .attr("for", `prop-${property}`)
      .text(`${property}: ${config.value.toFixed(1)}`);

    const $input = $("<input>").attr({
      type: "range",
      id: `prop-${property}`,
      min: config.min,
      max: config.max,
      step: config.step,
      value: config.value,
    });

    // Atualiza propriedade em tempo real durante interação
    $input.on("input", (e) => {
      const value = parseFloat($(e.target).val()); // USAR JQUERY .val()

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