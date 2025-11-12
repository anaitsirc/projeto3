import { AudioProcessor } from "./AudioProcessor.js";
import { VisualizationEngine } from "./VisualizationEngine.js";
import { UIManager } from "./UIManager.js";
import { ExportManager } from "./ExportManager.js";

class App {
  constructor() {
    this.audioProcessor = new AudioProcessor(); //instacia de AudioProcessor (Web Audio API)
    this.visualizationEngine = new VisualizationEngine("audioCanvas"); //renderizaçao do canvas/ representaçao visual
    this.visualizationEngine.setAudioProcessor(this.audioProcessor); // conecta o processador de audio com a representaçao visual
    this.uiManager = new UIManager(this);
    this.exportManager = new ExportManager(this.visualizationEngine); //exportaçao de dados
    this.animationFrameId = null; //id para controle de loop de animação

    // Inicialização da aplicação
    this.init();

    window.addEventListener("resize", () => {
      //para o resize/ redimensionar as visualizações quando a janela ou o layout muda
      const canvas = document.getElementById("audioCanvas");
      const container = canvas.parentElement;
      this.visualizationEngine.resize(container.clientWidth - 40, 400);
    });
  }

  init() {
    //configura o estado inicial da interface
    this.uiManager.updateAudioInfo({ status: "OFF", level: 0 });
    this.uiManager.setButtonStates(false);
    this.uiManager.updatePropertiesPanel();
    this.startRender(); //loop principl de renderizaçao
  }

  async startMicrophone() {
    try {
      this.stopAudio(); //para qualque audio ativo anter de iniciar
      await this.audioProcessor.startMicrophone(); //
      this.uiManager.updateAudioInfo({ status: "MIC ON" });
      this.uiManager.setButtonStates(true);
    } catch (error) {
      this.uiManager.showError("Erro: " + error.message);
    }
  }

  async loadAudioFile(file) {
    // TODO: carregar ficheiro de áudio
    console.log("Carregando ficheiro de áudio...");
  }

  stopAudio() {
    if (this.audioProcessor.isPlaying) {
      this.audioProcessor.stop(); //para o processamento de audio
    }
    this.uiManager.updateAudioInfo({ status: "OFF", level: 0 });
    this.uiManager.setButtonStates(false); //desativar os botoes
  }

  setVisualization(type) {
    // TODO: definir tipo de visualização
    if (this.visualizationEngine.setVisualization(type)) {
      // Atualiza painel de propriedades quando muda visualização
      this.uiManager.updatePropertiesPanel();
    }
    console.log(`Definindo visualização: ${type}`);
  }

  exportFrame(format) {
    // TODO: exportar frame atual
    console.log(`Exportando frame como ${format.toUpperCase()}...`);
    if (format === "png") {
      this.exportManager.exportAsPNG();
    } else if (format === "jpeg") {
      this.exportManager.exportAsJPEG(0.9);
    }
  }

  destroy() {
    // TODO: limpar recursos
    console.log("Destruindo aplicação...");
  }

  startRender() {
    // Loop principal de animação usando requestAnimationFrame para performance
    const update = () => {
      this.audioProcessor.update(); //atualizar os dados do audio

      if (this.audioProcessor.isPlaying) {
        const freqData = this.audioProcessor.getFrequencyData(); //dados fft (frequencia)
        const waveData = this.audioProcessor.getWaveformData(); // dados da forma da onda
        const level = this.audioProcessor.calculateAudioLevel(); //nivel RMS de volumeS

        this.visualizationEngine.draw(freqData, waveData); //representa visualmente no canvas
        this.uiManager.updateAudioInfo({ level: level });
      } else {
        this.visualizationEngine.clearCanvas(); //limpa o canvas quando nao ha audio
      }

      this.animationFrameId = requestAnimationFrame(update); //proxima frame
    };

    this.animationFrameId = requestAnimationFrame(update); //inicia o loop
  }
}

export { App };

// Inicializa a aplicação quando a página terminar de carregar
window.onload = () => {
  window.app = new App(); //instancia da App acessivel
};
