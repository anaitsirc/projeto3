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

    //const normalizedData = this.normalizeData(data);
    const sensitiveData = this.getSensitiveData(data); //dados normalizados e com sensibilidade aplicada
    const barWidth =
      (this.canvas.width / data.length) * this.properties.barSpacing.value; //largura de cada barra com PROPRIEDADE aplicada

    // CORES DINÂMICAS
    const audioLevel = this.audioProcessor
      ? this.audioProcessor.calculateAudioLevel() * 100
      : 0;
    const dynamicColors = this.getDynamicColor(audioLevel);
    // gradiente
    const visualizationStyle = this.createGradient([
      dynamicColors.primary,
      dynamicColors.secondary,
    ]);

    for (let i = 0; i < sensitiveData.length; i++) {
      //const barHeight = normalizedData[i] * this.canvas.height;
      const barHeight = sensitiveData[i] * this.canvas.height;
      const x = i * barWidth;
      const y = this.canvas.height - barHeight; //posição y (base na parte inferior)

      this.ctx.fillStyle = visualizationStyle;
      this.ctx.fillRect(x, y, barWidth - 1, barHeight);
    }
  }

  getProperties() {
    //  obter propriedades específicas
    const allProperties = super.getProperties();
    delete allProperties.audioSensitivity;
    return allProperties;
  }
}

export { SpectrumVisualization };
