import { AudioProcessor } from "./AudioProcessor.js";
import { VisualizationEngine } from "./VisualizationEngine.js";
import { UIManager } from "./UIManager.js";
import { ExportManager } from "./ExportManager.js";

console.log("🔍 AudioProcessor importado:", !!AudioProcessor);
console.log("🔍 VisualizationEngine importado:", !!VisualizationEngine);
console.log("🔍 UIManager importado:", !!UIManager);

// Classe principal da aplicação
class App {
  constructor() {
    console.log("🔵 CONSTRUTOR - Iniciando...");

    this.audioProcessor = new AudioProcessor();
    console.log("🔵 AudioProcessor criado");

    this.visualizationEngine = new VisualizationEngine("audioCanvas");
    console.log("🔵 VisualizationEngine criado");

    // CORREÇÃO: Conectar as duas partes
    this.visualizationEngine.setAudioProcessor(this.audioProcessor);
    console.log("🔵 AudioProcessor conectado ao VisualizationEngine");

    this.uiManager = new UIManager(this);
    console.log("🔵 UIManager criado");

    this.exportManager = new ExportManager(this.visualizationEngine);
    console.log("🔵 ExportManager criado");

    this.animationFrameId = null;

    // Inicialização
    this.init();
    console.log("🔵 CONSTRUTOR - Finalizado");
  }

  init() {
    console.log("🟡 INIT - Iniciando...");

    // Verificar se elementos existem
    const canvas = document.getElementById("audioCanvas");
    const startBtn = document.getElementById("startMic");
    console.log("🟡 Canvas encontrado:", !!canvas);
    console.log("🟡 Botão start encontrado:", !!startBtn);

    this.uiManager.updateAudioInfo({ status: "Parado", level: 0 });
    this.uiManager.setButtonStates(false);

    this.startUpdateLoop();
    console.log("🟡 INIT - Finalizado");
  }

  async startMicrophone() {
    console.log("🎤 START MICROPHONE - Clicado!");
    try {
      console.log("🎤 1. Parando áudio anterior...");
      this.stopAudio();

      console.log("🎤 2. AudioProcessor existe?", !!this.audioProcessor);
      console.log(
        "🎤 3. audioProcessor.startMicrophone existe?",
        !!this.audioProcessor.startMicrophone
      );

      console.log("🎤 4. A chamar audioProcessor.startMicrophone()...");
      await this.audioProcessor.startMicrophone();

      console.log("🎤 5. Microfone iniciado com sucesso!");
      this.uiManager.updateAudioInfo({ status: "Microfone Ativo" });
      this.uiManager.setButtonStates(true);
    } catch (error) {
      console.error("🎤 ❌ ERRO no microfone:", error);
      this.uiManager.showError("Erro: " + error.message);
    }
  }

  async loadAudioFile(file) {
    console.log("Carregando ficheiro de áudio...");
  }

  stopAudio() {
    console.log("⏹️ STOP AUDIO - Chamado");
    if (this.audioProcessor.isPlaying) {
      this.audioProcessor.stop();
    }
    this.uiManager.updateAudioInfo({ status: "Parado", level: 0 });
    this.uiManager.setButtonStates(false);
  }

  setVisualization(type) {
    console.log(`Definindo visualização: ${type}`);
  }

  exportFrame(format) {
    console.log("Exportando frame...");
  }

  destroy() {
    console.log("Destruindo aplicação...");
  }

  startUpdateLoop() {
    console.log("🔄 START UPDATE LOOP - Iniciando loop de animação");
    const update = () => {
      this.audioProcessor.update();

      if (this.audioProcessor.isPlaying) {
        const freqData = this.audioProcessor.getFrequencyData();
        const waveData = this.audioProcessor.getWaveformData();
        const level = this.audioProcessor.calculateAudioLevel();

        this.visualizationEngine.draw(freqData, waveData);
        this.uiManager.updateAudioInfo({ level: level });
      } else {
        this.visualizationEngine.clearCanvas();
      }

      this.animationFrameId = requestAnimationFrame(update);
    };

    this.animationFrameId = requestAnimationFrame(update);
  }
}

export { App };

window.onload = () => {
  console.log("📄 WINDOW.LOAD - Página carregada");
  window.app = new App();
  console.log("📄 App criada e guardada em window.app");
};
