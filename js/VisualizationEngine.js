import { SpectrumVisualization } from "./SpectrumVisualization.js";
import { WaveformVisualization } from "./WaveformVisualization.js";
import { ParticleVisualization } from "./ParticleVisualization.js";

// Motor de Visualização
class VisualizationEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.visualizations = new Map();
    this.currentVisualization = null;
    this.animationId = null;
    this.isRunning = false;
    this.audioProcessor = null; // Inicializar como null

    // CORREÇÃO: Não inicializar visualizações aqui - vamos fazer depois
    // this.initVisualizations();
    // this.setVisualization("spectrum");
  }

  setAudioProcessor(audioProcessor) {
    this.audioProcessor = audioProcessor;
    console.log("🟢 AudioProcessor definido no VisualizationEngine");
    
    // CORREÇÃO: Só agora inicializar as visualizações
    this.initVisualizations();
    this.setVisualization("spectrum");
  }

  initVisualizations() {
    // CORREÇÃO: Agora o audioProcessor não é null
    console.log("🟢 Inicializando visualizações com audioProcessor:", !!this.audioProcessor);
    
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
    if (this.visualizations.has(type)) {
      this.currentVisualization = this.visualizations.get(type);
      console.log(`🟢 Visualização alterada para: ${type}`);
      return true;
    }
    console.error(`❌ Tipo de visualização não encontrado: ${type}`);
    return false;
  }

  draw(freqData, waveData) {
    if (this.currentVisualization) {
      this.currentVisualization.update();
      this.currentVisualization.draw();
    }
  }

  clearCanvas() {
    this.ctx.fillStyle = "#121226";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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

  resize() {
    // TODO: redimensionar canvas
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
