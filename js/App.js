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

    // USAR JQUERY PARA ENCONTRAR O CANVAS e seu pai (container)
    window.addEventListener("resize", () => {
      const $canvas = $("#audioCanvas");
      // Usamos jQuery .get(0) para obter o elemento nativo, se necessário, mas aqui usamos .parent() e .width()
      const $container = $canvas.parent();
      this.visualizationEngine.resize($container.width() - 40, 400);
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
      this.uiManager.updateAudioInfo({ status: "ON" });
      this.uiManager.setButtonStates(true);
    } catch (error) {
      this.uiManager.showError("Erro: " + error.message);
    }
  }

  //Carregar e reproduzir ficheiro de áudio
  async loadAudioFile(file) {
    try {
      this.stopAudio();
      this.uiManager.updateAudioInfo({ status: "LOADING..." });

      // Chama o método atualizado no AudioProcessor que lida com MP3/WAV e reprodução.
      await this.audioProcessor.loadAudioFile(file);

      this.uiManager.updateAudioInfo({ status: `PLAYING: ${file.name}` });
      this.uiManager.setButtonStates(true);
    } catch (error) {
      // Captura o erro (incluindo o erro de formato MP3/WAV)
      this.uiManager.showError(error.message);
      this.uiManager.updateAudioInfo({ status: "OFF", level: 0 });
      this.uiManager.setButtonStates(false);
    }
  }

  stopAudio() {
    if (this.audioProcessor.isPlaying) {
      this.audioProcessor.stop(); //para o processamento de audio
    }
    this.uiManager.updateAudioInfo({ status: "OFF", level: 0 });
    this.uiManager.setButtonStates(false); //desativar os botoes
  }

  setVisualization(type) {
    // definir tipo de visualização
    if (this.visualizationEngine.setVisualization(type)) {
      // Atualiza painel de propriedades quando muda visualização
      this.uiManager.updatePropertiesPanel();
    }
    console.log(`Definindo visualização: ${type}`);
  }

  exportFrame(format) {
    //  exportar frame atual
    console.log(`Exportando frame como ${format.toUpperCase()}...`);
    if (format === "png") {
      this.exportManager.exportAsPNG();
    } else if (format === "jpeg") {
      this.exportManager.exportAsJPEG(0.9);
    }
  }

  destroy() {
    //  limpar recursos
    console.log("Destruindo aplicação...");
  }

  startRender() {
    // Loop principal de animação usando requestAnimationFrame para performance
    const update = () => {
      this.audioProcessor.update(); //atualizar os dados do audio

      if (this.audioProcessor.isPlaying) {
        /*const freqData = this.audioProcessor.getFrequencyData(); //dados fft (frequencia) //nao usado
        const waveData = this.audioProcessor.getWaveformData(); // dados da forma da onda*/
        const level = this.audioProcessor.calculateAudioLevel(); //nivel RMS de volumeS

        this.visualizationEngine.draw(); //representa visualmente no canvas
        this.uiManager.updateAudioInfo({ level: level });
      } else {
        // Verifica se o áudio terminou para garantir que o nível é resetado
        if (
          this.audioProcessor.source &&
          this.audioProcessor.source.buffer &&
          this.audioProcessor.source.buffer.duration > 0
        ) {
          // Se o áudio do ficheiro terminou, garante que o stop é completo.
          // A verificação é mais robusta no AudioProcessor, mas aqui limpamos o UI.
          this.uiManager.updateAudioInfo({ status: "OFF", level: 0 });
        }
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
