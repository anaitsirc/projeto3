// Visualizações Concretas
import { AudioVisualization } from "./AudioVisualization.js";
class SpectrumVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Espectro de Frequências";
    // Inicializar propriedades específicas - Espectro de Frequências
    this.properties.barSpacing = { value: 1, min: 1, max: 3, step: 0.1 };
  }

  draw() {
    //desenha espectro de frequências como barras verticais
    this.clearCanvas();

    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;

    const normalizedData = this.normalizeData(data);
    const barWidth =
      (this.canvas.width / data.length) * this.properties.barSpacing.value; //largura de cada barra com PROPRIEDADE aplicada

    // gradiente
    const gradient = this.createGradient([
      "#ff00bfff",
      "#b700ffff",
      "#00c3ffff",
      "#00ff77ff",
      "#ffbb00ff",
    ]);

    for (let i = 0; i < data.length; i++) {
      const barHeight = normalizedData[i] * this.canvas.height; //altura normalizada e uso da PROPRIEDADE do brilho
      const x = i * barWidth;
      const y = this.canvas.height - barHeight; //posição y (base na parte inferior)

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(x, y, barWidth - 1, barHeight);
    }
  }

  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties();
  }
}

export { SpectrumVisualization };
