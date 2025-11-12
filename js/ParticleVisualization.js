import { AudioVisualization } from "./AudioVisualization.js";
class ParticleVisualization extends AudioVisualization {
  constructor(canvas, audioProcessor) {
    super(canvas, audioProcessor);
    this.name = "Partículas";
    this.particles = [];
    this.lastTime = 0;

    // Inicializar propriedades específicas Partículas (podem ser ajustadas com os gliders que aparece na GUI)
    this.properties.particleCount = { value: 100, min: 50, max: 200, step: 1 }; //quantas particulas ha
    this.properties.connectionDistance = {
      //a distancia pra haver conexao
      value: 100, //valor maximo default
      min: 50, //valor minimo do range
      max: 200, // valor maximo do range
      step: 10, //passo
    };
    this.properties.particleSize = { value: 2, min: 1, max: 3, step: 0.5 }; //tamanho base da particula
    this.properties.particleSpeed = { value: 0.5, min: 0.5, max: 1, step: 0.1 }; //velocidade da aprticula
    this.properties.particleBrightness = {
      value: 1,
      min: 0.1,
      max: 2,
      step: 0.1,
    }; //brilho da particula

    // Inicializar partículas
    this.initParticles();
  }

  draw() {
    // desenha partículas e conexões no canvas
    this.clearCanvas();
    this.drawParticles();
    this.drawConnections();
  }

  update() {
    // atualiza estado das partículas baseado nos dados de áudio
    super.update();
    this.updateParticles();
  }

  getProperties() {
    // TODO: obter propriedades específicas
    return super.getProperties();
  }

  initParticles() {
    //criar particulas com pos e vel aleatorias
    this.particles = [];
    const count = this.properties.particleCount.value;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 2, // vel horizontal
        vy: (Math.random() - 0.5) * 2, //vel vertical
        radius: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`, // cores aleatórias no espectro HSL
      });
    }
  }

  updateParticles() {
    //atualiza movimento das partículas baseado nos dados de frequência
    const data = this.audioProcessor
      ? this.audioProcessor.getFrequencyData()
      : this.testData;
    const normalizedData = this.normalizeData(data);
    const audioLevel = this.audioProcessor
      ? this.audioProcessor.calculateAudioLevel()
      : 0.5;

    const speed = this.properties.particleSpeed.value; //PROPRIEDADE para velocidade
    const size = this.properties.particleSize.value; //PROPRIEDADE para o tamanho base da particula

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.radius = size * (1 + audioLevel * 0.1); //aplicar PROPRIEDADE do tamanho base e o nível de áudio para um efeito de pulsação (pulso do bite)
      // mover partícula consoante velocidade- aplicar PROPRIEDADE speed
      p.x += p.vx * speed;
      p.y += p.vy * speed;

      //rebater nas bordas do canvas
      if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

      const freqIndex = Math.floor(
        (i / this.particles.length) * normalizedData.length
      );
      const intensity = normalizedData[freqIndex];
      //influência do áudio - adiciona mov aleatorio consoante a intensidade do audio
      p.vx += (Math.random() - 0.5) * intensity;
      p.vy += (Math.random() - 0.5) * intensity;
    }
  }

  drawParticles() {
    // desenhar cada particula como circulos
    for (const p of this.particles) {
      const brightness = this.properties.particleBrightness.value; // PROPRIEDADE
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2); //arco completo = circulo
      //this.ctx.fillStyle = p.color;
      this.ctx.fillStyle = `rgba(255, 0, 127, ${brightness * 0.5})`;
      this.ctx.fill();
    }
  }

  drawConnections() {
    //desenhar linhas que conectam partículas próximas (efeito de rede)
    const maxDistance = this.properties.connectionDistance.value; //dist max para conexao

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];

        const dx = p1.x - p2.x; // Diferença em x
        const dy = p1.y - p2.y; // Diferença em y
        const distance = Math.sqrt(dx * dx + dy * dy); // distância euclidiana

        if (distance < maxDistance) {
          const opacity = 1 - distance / maxDistance; //opacidade cresce com a dist
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = `rgba(76, 201, 240, ${opacity * 0.5})`; // azul com opacidade variável
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }
    }
  }
  updateProperty(property, value) {
    const result = super.updateProperty(property, value);
    if (property === "particleCount" && result) {
      this.initParticles(); // Recriar partículas quando o count muda
    }
    return result;
  }
}

export { ParticleVisualization };
