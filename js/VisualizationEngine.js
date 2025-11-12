import { SpectrumVisualization } from "./SpectrumVisualization.js";
import { WaveformVisualization } from "./WaveformVisualization.js";
import { ParticleVisualization } from "./ParticleVisualization.js";

// Motor de Visualização
class VisualizationEngine {
  constructor(canvasId) {
    //config canvas para renderizaçao
    this.canvas = $(`#${canvasId}`).get(0); //po elemnto html para desenhar
    this.ctx = this.canvas.getContext("2d"); //o contexto de visualizaçao/renderizaçao
    this.visualizations = new Map(); //mapear diferentes tipos de visualização
    this.currentVisualization = null;
    this.animationId = null; //id para controlar animaçao
    this.isRunning = false;

    this.audioProcessor = null; // Referência ao processador de áudio (inicializado depois)

    // this.initVisualizations();
  }

  setAudioProcessor(audioProcessor) {
    // Define o processador de áudio e inicializa as visualizações

    this.audioProcessor = audioProcessor;

    // Inicializa as visualizações apenas quando o audioProcessor estiver disponível
    this.initVisualizations();
    this.setVisualization("spectrum"); //visualizaçao default
  }

  initVisualizations() {
    // Cria instâncias de cada tipo de visualização passando o canvas e audioProcessor

    this.visualizations.set(
      "spectrum",
      new SpectrumVisualization(this.canvas, this.audioProcessor)
    );
    this.visualizations.set(
      "waveform",
      new WaveformVisualization(this.canvas, this.audioProcessor)
    );
    this.visualizations.set(
      "particles",
      new ParticleVisualization(this.canvas, this.audioProcessor)
    );
  }

  setVisualization(type) {
    // Altera o tipo de visualização ativa

    if (this.visualizations.has(type)) {
      this.currentVisualization = this.visualizations.get(type);
      console.log(`Visualização definida: ${type}`);
      return true;
    }
    return false;
  }

  draw(freqData, waveData) {
    // Método principal de renderização - chamado a cada frame

    if (this.currentVisualization) {
      this.currentVisualization.update(); // atualização dos dados
      this.currentVisualization.draw(); //atualizaçao visual
    }
  }

  clearCanvas() {
    this.ctx.fillStyle = "#121226";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height); //ocupa o canvas todo
  }

  start() {
    // TODO: iniciar animação
    if (!this.isRunning) {
      this.isRunning = true;
      console.log("Motor de visualização iniciado");
    }
  }

  stop() {
    // TODO: parar animação
    if (this.isRunning) {
      this.isRunning = false;
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
      }
      console.log("Motor de visualização parado");
    }
  }

  resize(width, height) {
    // Redimensiona o canvas e todas as visualizações
    this.canvas.width = width;
    this.canvas.height = height;
  }

  getVisualizationProperties() {
    // TODO: obter propriedades da visualização atual
    return this.currentVisualization
      ? this.currentVisualization.getProperties()
      : {};
  }

  updateVisualizationProperty(property, value) {
    // TODO: atualizar propriedade da visualização
    if (this.currentVisualization) {
      return this.currentVisualization.updateProperty(property, value);
    }
    return false;
  }
}

export { VisualizationEngine };
