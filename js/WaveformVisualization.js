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

    // Implementação básica para teste
    const data = this.audioProcessor
      ? this.audioProcessor.getWaveformData()
      : this.testData;

    const normalizedData = this.normalizeData(data);
    const lineWidth = this.properties.lineThickness.value; //PROPRIEDADE espessura da linha
    const zoomLevel = this.properties.zoomLevel.value; //PROPRIEDADE  o nível de zoom

    //gradient
    const gradient = this.createGradient(["#4cc9f0", "#f72585"]);

    this.ctx.beginPath(); //inicia o rabisco
    this.ctx.moveTo(0, this.canvas.height / 2); // ponto inicial no centro

    for (let i = 0; i < data.length; i++) {
      const v = (normalizedData[i] - 0.5) * 2; // normaliza dados de waveform (0-255 para -1 a +1)
      const y =
        this.canvas.height / 2 + ((v * this.canvas.height) / 2) * zoomLevel; //calculo: amp max (metado do canvas); aplicar valor (v) normalizado; multiplicar pela PROPRIEDADE zoomLevel (pra expandir/diminuir a onda)
      const x = i * (this.canvas.width / data.length); //calcula posição x

      /*if (i === 0) {
        this.ctx.moveTo(x, y); //1º ponto
      } else {*/
      this.ctx.lineTo(x, y); //conecta pontos restantes
      /*}*/
    }

    //this.ctx.strokeStyle = "#4cc9f0";
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
  }

  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties();
  }
}

export { WaveformVisualization };
