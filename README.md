# projeto3

# Sistema de Visualização de Áudio

## Identificação

- Autores: Inê Martins A52816 | Carolina Canto A52688
- Data: [Data atual]
- Tecnologias: HTML5, CSS3, JavaScript (ES6+), jQuery, Web Audio API

## Instruções de Instalação e Uso

### Instalação

(Ter um Browser com suporte a Web Audio API)

1. Descarregar a pasta com ficheiros do projeto
2. Abrir o ficheiro index.html diretamente no browser

### Utilização

1. Iniciar Microfone: Clicar em "Iniciar Microfone" para capturar áudio do microfone
2. Carregar Ficheiro: Selecione um ficheiro MP3 ou WAV e clicar em "Reproduzir Áudio"
3. Visualizações: Escolher entre Espectro, Forma de Onda ou Partículas
4. Personalização: Ajustar cores, sensibilidade e propriedades específicas
5. Exportação: Exportar visualizações como PNG ou JPEG

## Funcionalidades Implementadas

### Funcionalidades Principais

- Captura de Áudio em Tempo Real: Microfone e ficheiros (MP3/WAV)
- Três Tipos de Visualização:
  - Espectro de Frequências (barras verticais)
  - Forma de Onda (linha contínua)
  - Partículas (sistema de partículas com conexões)
- Controlos de Visualização: Sensibilidade, cores, gradientes
- Exportação de Imagens: PNG e JPEG
- Interface Responsiva: Painéis de controlo organizados

### Processamento de Áudio

- Análise FFT para dados de frequência
- Dados de waveform em tempo real
- Cálculo de nível de áudio (RMS)
- Suporte a fontes diferentes (mic/ficheiro)

### Personalização

- Cores personalizáveis (primária, secundária, fundo)
- Modo gradiente
- Cores dinâmicas baseadas no nível de áudio
- Propriedades específicas por visualização

## Propriedades Específicas por Visualização

### Spectrum Visualization (Espectro de Frequências)

- Bar Spacing: Ajusta a espessura das barras verticais no espectro

### Waveform Visualization (Forma de Onda)

- Line Thickness: Ajusta a espessura da linha do sinal de áudio
- Zoom Level: Aproxima ou afasta a area de visualização

### Particle Visualization (Sistema de Partículas)

- Particle Count: Define o número total de partículas na visualização, controlando a densidade do sistema de partículas
- Connection Distance: Determina a distância máxima para criar conexões entre partículas, controlando quantas ligações são formadas entre partículas próximas
- Particle Size: Ajusta o tamanho base (raio) de cada partícula
- Particle Speed: Controla a velocidade de movimento das partículas
- Particle Brightness: Ajusta a intensidade luminosa (brilho e opacidade) das partículas

### Propriedades Comuns a Todas as Visualizações

- Audio Sensitivity: Sensibilidade geral do áudio; amplifica ou atenua a resposta visual ao áudio

## Arquitetura do Projeto

### Estrutura de Classes Principais

#### Class App

- Coordena todos os componentes
- Gestão do ciclo de vida da aplicação
- Loop principal de renderização

#### Class AudioProcessor

- Gestão do Web Audio API
- Captura de microfone via getUserMedia
- Carregamento e decodificação de ficheiros MP3/WAV
- Análise FFT e processamento de dados de áudio
- Cálculo de níveis de volume

#### Class VisualizationEngine

- Motor de renderização central
- Gestão de múltiplos tipos de visualização
- Coordenação do canvas e animação
- Interface para propriedades das visualizações

#### Sistema de Visualizações (Herança)

- AudioVisualization (Classe Abstrata)
  - SpectrumVisualization (Espectro de frequências)
  - WaveformVisualization (Forma de onda)
  - ParticleVisualization (Sistema de partículas)

#### Class UIManager

- Gestão da interface com jQuery
- Controlo de estados de botões
- Atualização de painéis de propriedades
- Gestão de eventos de utilizador

#### Class ExportManager

- Exportação de frames para PNG/JPEG
- Gestão de download de imagens

### Características Técnicas

- Web Audio API: Processamento de áudio nativo
- RequestAnimationFrame: Animação suave a 60fps
- Canvas 2D: Renderização gráfica de alto desempenho
