// Processamento de Áudio

class AudioProcessor {
  constructor() {
    // AudioContext | contexto de audio (sound) - controla tudo relacionado com audio "You need to create an AudioContext before you do anything else, as everything happens inside a context. (...) reuse it"
    this.audioContext = new AudioContext();
    // AnalyserNode | permite representar/visualizar o audio "expose audio time and frequency data and create data visualizations"
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256; // fftSize = precisão da análise (maior -> mais amostras -> mais detalhe)
    // arrays para guardar os dados (atualizados em tempo real)
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount); //freqs     Uint8Array - Guarda valores inteiros entre 0–255
    this.waveformData = new Uint8Array(this.analyser.frequencyBinCount); //amps

    this.mediaStream = null;
    this.isPlaying = false;
    this.source = null;

    this.frequencyData.fill(0);
    this.waveformData.fill(128);
  }

  //Devolver Promise é garantir que a função retorna algo que o js pode esperar terminar no futuro; ao usar async, isso já acontece automaticamente
  // (via async/await) - permite lidar com operações assíncronas como pedir o microfone ou ler ficheiros

  //Captura de áudio via microfone com tratamento de permissões
  async startMicrophone() {
    // TODO: iniciar captura do microfone (ou fonte de som MediaStreamSource)

    //verifica se o áudio está suspenso e acorda-o
    if (this.audioContext.state !== "running") {
      await this.audioContext.resume();
    }
    // espera poder capturar micro - getUserMedia API
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    this.source = this.audioContext.createMediaStreamSource(this.mediaStream); // cria fonte (MediaStream) referente ao micro - "prompts the user for permission to use a media input which produces a MediaStream"
    this.source.connect(this.analyser); // ligar fonte com o analisador
    this.analyser.connect(this.audioContext.destination); // Ligado à saída de som (colunas)

    this.isPlaying = true; //atualizar estado

    console.log("Iniciando captura do microfone...");
    // Devolver Promise - "representa a conclusão eventual:descreve o fato de que a operação assíncrona terminou (seja audio ou um falha) de uma operação assíncrona e seu valor resultante."
  }

  // Carregamento e análise de ficheiros de áudio (WAV/MP3)
  async loadAudioFile(file) {
    // TODO: carregar ficheiro de áudio

    const promiseBuffer = await file.arrayBuffer(); // le o file em bin: retorna uma Promise que se resolve com o conteúdo do blob(objeto que representa um arquivo ou dado bruto imutável) como dados binários contidos num ArrayBuffer."
    const audioBuffer = await this.audioContext.decodeAudioData(promiseBuffer); //decodifica o áudio (transforma em dados compreensíveis pelo AudioContext)

    this.source = this.audioContext.createBufferSource(); // cria fonte (BufferSource) referente ao file decodificado
    this.source.buffer = audioBuffer;

    this.source.connect(this.analyser); //liga a fonte com o analisador
    this.analyser.connect(this.audioContext.destination); // liga à saida, Destination (as colunas - onde o som sai)
    this.source.start(); //tocar

    this.isPlaying = true; //atualizar estado

    console.log("Carregando ficheiro de áudio...");
    // Devolver Promise
  }

  stop() {
    // TODO: parar processamento de áudio

    if (this.mediaStream) {
      // pra som de micro - mediaStream contém uma ou mais tracks
      this.mediaStream.getTracks().forEach((track) => track.stop()); //parar cada track -> parar realmente a captação de som, libertar o hardware, e evitar que o microfone continue ativo em background

      this.mediaStream = null;
    }
    // Se houver uma fonte de áudio ativa (do microfone ou de um ficheiro)
    if (this.source) {
      // Desconectar o source do analyser
      this.source.disconnect(this.analyser);
      if (this.source.stop) this.source.stop(); //para BufferSouce
      this.source = null;
    }

    // Desconectar o analyser do destino (necessário para o Audio File)
    if (this.analyser.numberOfOutputs > 0) {
      this.analyser.disconnect(this.audioContext.destination);
    }

    this.isPlaying = false;

    console.log("Parando processamento de áudio...");
  }

  //Processamento de dados de frequência e waveform em tempo real
  update() {
    // TODO: atualizar dados de áudio
    if (!this.analyser || !this.isPlaying) return;

    this.analyser.getByteFrequencyData(this.frequencyData); //atualiza freqs - preenche um Uint8Array com valores 0–255 das freqs
    this.analyser.getByteTimeDomainData(this.waveformData); //atualiza amps - preenche um Uint8Array com valores que representam a forma de onda
  }

  getFrequencyData() {
    // TODO: obter dados de frequência
    return this.frequencyData;
  }

  getWaveformData() {
    // TODO: obter dados de forma de onda
    return this.waveformData;
  }

  calculateAudioLevel() {
    // TODO: calcular nível de áudio

    // Soma todas as intensidades
    let result = 0;
    for (let i = 0; i < this.frequencyData.length; i++) {
      result += this.frequencyData[i];
    }

    // Média e conversão para percentagem (0–100)
    const media = result / this.frequencyData.length;
    const level = Math.round((media / 255) * 100);

    return level;
  }
}

export { AudioProcessor };
