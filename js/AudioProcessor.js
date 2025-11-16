// Processamento de Áudio

class AudioProcessor {
  constructor() {
    // AudioContext | contexto de audio (sound) - controla tudo relacionado com audio
    this.audioContext = new AudioContext(); // AnalyserNode | permite representar/visualizar o audio
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256; // precisão da análise // arrays para guardar os dados (atualizados em tempo real)
    // arrays para guardar os dados (atualizados em tempo real)
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount); //freqs     Uint8Array - Guarda valores inteiros entre 0–255
    this.waveformData = new Uint8Array(this.analyser.frequencyBinCount); //amps

    this.mediaStream = null;
    this.isPlaying = false;
    this.source = null;

    this.frequencyData.fill(0);
    this.waveformData.fill(128);
  } //Captura de áudio via microfone com tratamento de permissões

  //Devolver Promise é garantir que a função retorna algo que o js pode esperar terminar no futuro; ao usar async, isso já acontece automaticamente
  // (via async/await) - permite lidar com operações assíncronas como pedir o microfone ou ler ficheiros

  //Captura de áudio via microfone com tratamento de permissões
  async startMicrophone() {
    //iniciar captura do microfone (ou fonte de som MediaStreamSource)

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
    //this.analyser.connect(this.audioContext.destination); // Ligado à saída de som (colunas) CAUSA FEEDBACK

    this.isPlaying = true; //atualizar estado

    console.log("Iniciando captura do microfone...");
    // Devolver Promise - "representa a conclusão eventual:descreve o fato de que a operação assíncrona terminou (seja audio ou um falha) de uma operação assíncrona e seu valor resultante."
  }

  //Carregamento e análise de ficheiros de áudio (WAV/MP3)
  async loadAudioFile(file) {
    //VALIDAÇÃO DO TIPO DE FICHEIRO: lança erro se não for MP3 ou WAV
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith(".mp3") && !fileName.endsWith(".wav")) {
      throw new Error(` O ficheiro "${file.name}" não é formato MP3 ou WAV.`);
    } // Parar qualquer fonte anterior

    this.stop();

    // Ativar o contexto se estiver suspenso
    if (this.audioContext.state !== "running") {
      await this.audioContext.resume();
    }

    const promiseBuffer = await file.arrayBuffer(); // le o file em bin
    const audioBuffer = await this.audioContext.decodeAudioData(promiseBuffer); //decodifica o áudio

    this.source = this.audioContext.createBufferSource(); // cria fonte (BufferSource)
    this.source.buffer = audioBuffer; // Ligar

    this.source.connect(this.analyser); // liga a fonte com o analisador
    this.analyser.connect(this.audioContext.destination); // liga à saida, Destination (as colunas)
    //  Definir o que acontece quando o áudio termina
    this.source.onended = () => {
      // Se a reprodução terminou naturalmente, para o processamento de áudio (chamará stop() da App)
      // Usamos setTimeout para garantir que a notificação é assíncrona, não interferindo no AudioContext
      console.log("Áudio do ficheiro terminou.");
      // Não podemos chamar App.stopAudio() diretamente daqui, mas o loop de renderização (App.startRender)
      // deixará de ver isPlaying=true e parará de desenhar/atualizar, e a App.stopAudio() será chamada
      // se o utilizador clicar no botão. Para garantir o reset total, chamamos o disconnect aqui:
      if (this.isPlaying) {
        this.isPlaying = false; // Parar o loop de update
        // O loop de update na App irá limpar o canvas e resetar o UI Level.
      }
    };

    this.source.start(); //tocar
    this.isPlaying = true; //atualizar estado

    console.log("Carregando ficheiro de áudio...");
  }

  stop() {
    //parar processamento de áudio

    if (this.mediaStream) {
      // pra som de micro - mediaStream contém uma ou mais tracks
      this.mediaStream.getTracks().forEach((track) => track.stop()); //parar cada track
      this.mediaStream = null;
    } // Se houver uma fonte de áudio ativa (do microfone ou de um ficheiro)
    if (this.source) {
      // Desconectar o source do analyser
      this.source.disconnect(this.analyser);
      if (this.source.stop) {
        try {
          this.source.stop(); // para BufferSouce
        } catch (e) {
          // Fonte já parada
        }
      }
      this.source = null;
    } // Desconectar o analyser do destino (necessário para o Audio File)

    if (this.analyser.numberOfOutputs > 0) {
      try {
        this.analyser.disconnect(this.audioContext.destination);
      } catch (e) {
        // Analyser já desconectado
      }
    }

    this.isPlaying = false;

    // Limpar buffers para não desenhar lixo no canvas
    this.frequencyData.fill(0);
    this.waveformData.fill(128);

    console.log("Parando processamento de áudio...");
  } //Processamento de dados de frequência e waveform em tempo real

  update() {
    //  atualizar dados de áudio
    if (!this.analyser || !this.isPlaying) return;

    this.analyser.getByteFrequencyData(this.frequencyData); //atualiza freqs
    this.analyser.getByteTimeDomainData(this.waveformData); //atualiza amps
  }

  getFrequencyData() {
    //  obter dados de frequência
    return this.frequencyData;
  }

  getWaveformData() {
    // obter dados de forma de onda
    return this.waveformData;
  }

  calculateAudioLevel() {
    // calcular nível de áudio

    // Soma todas as intensidades
    let result = 0;
    for (let i = 0; i < this.frequencyData.length; i++) {
      result += this.frequencyData[i];
    } // Média e conversão para percentagem (0–100)

    const media = result / this.frequencyData.length;
    const level = Math.round((media / 255) * 100);

    return level;
  }
}

export { AudioProcessor };
