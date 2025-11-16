import { AudioVisualization } from "./AudioVisualization.js";
class WaveformVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Forma de Onda";
    // Inicializar propriedades específicas Forma de Onda PROPRIEDADES
    this.properties.lineThickness = { value: 2.2, min: 1, max: 6, step: 0.1 };
    this.properties.zoomLevel = { value: 1, min: 0.5, max: 5, step: 0.1 };
  }

  draw() {
    //Desenha forma de onda baseada nos dados temporais de áudio
    this.clearCanvas();

    // grelha (modo osciloscopio)
    this.drawGrid();

    // Implementação básica para teste
    const data = this.audioProcessor
      ? this.audioProcessor.getWaveformData()
      : this.testData;

    //const normalizedData = this.normalizeData(data);
    const sensitiveData = this.getSensitiveData(data); //dados normalizados e com sensibilidade aplicada
    const lineWidth = this.properties.lineThickness.value; //PROPRIEDADE espessura da linha
    const zoomLevel = this.properties.zoomLevel.value; //PROPRIEDADE  o nível de zoom

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

    this.ctx.beginPath(); //inicia o rabisco
    this.ctx.moveTo(0, this.canvas.height / 2); // ponto inicial no centro

    for (let i = 0; i < sensitiveData.length; i++) {
      const v = (sensitiveData[i] - 0.5) * 2; // normaliza dados de waveform (0-255 para -1 a +1)
      const y =
        this.canvas.height / 2 + ((v * this.canvas.height) / 2) * zoomLevel; //calculo: amp max (metado do canvas); aplicar valor (v) normalizado; multiplicar pela PROPRIEDADE zoomLevel (pra expandir/diminuir a onda)
      const x = i * (this.canvas.width / sensitiveData.length); //calcula posição x

      this.ctx.lineTo(x, y); //conecta pontos restantes
    }

    //this.ctx.strokeStyle = "#4cc9f0";
    this.ctx.strokeStyle = visualizationStyle;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
  }

  getProperties() {
    //  obter propriedades específicas
    const allProperties = super.getProperties();
    delete allProperties.audioSensitivity;
    return allProperties;
  }
}

export { WaveformVisualization };
