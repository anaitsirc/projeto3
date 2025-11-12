// Visualizações Concretas
import { AudioVisualization } from "./AudioVisualization.js";
class SpectrumVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Espectro de Frequências";
    // Inicializar propriedades específicas
  }

  draw() {
    // TODO: desenhar espectro de frequências
    this.clearCanvas();

    // Implementação básica para teste
    // obtenção dos DADOS ORIGIGINAIS(valores entre 0 e 255)
    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;
    //
    const barWidth = this.canvas.width / data.length;

    for (let i = 0; i < data.length; i++) {
      const barHeight = (data[i] / 255) * this.canvas.height;
      const x = i * barWidth;
      const y = this.canvas.height - barHeight;
      // ctx é a breviação de contexto , este é o contexto de renderização 2D do HTML
      this.ctx.fillStyle = `hsl(${(i / data.length) * 360}, 100%, 50%)`; //i / data.length) * 360 calculo q gera um nº entre 0 e 360 que representa a cor no irculo cromártico
      //100%: saturação e 50% luminosidade
      this.ctx.fillRect(x, y, barWidth - 1, barHeight);
      //barWidth - 1: largurado retândulo , -1 para deixar um pequeno espaço (margem) entre o retângulo
      //barHeight: altura do retangulo
    }
  }

  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties();
  }
}

export { SpectrumVisualization };
