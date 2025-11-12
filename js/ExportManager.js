// Gestão de Exportação
class ExportManager {
  constructor(visualizationEngine) {
    this.visualizationEngine = visualizationEngine;
  }

  exportAsPNG() {
    // TODO: exportar como PNG
    console.log("Exportando como PNG...");

    try {
      const canvas = this.visualizationEngine.canvas;
      const $link = $("<a>").attr({
        //criaçao do link
        download: `audio-visualization-${new Date().getTime()}.png`,
        href: canvas.toDataURL("image/png"),
      });
      $link[0].click();
    } catch (error) {
      console.error("Erro ao exportar PNG:", error);
    }
  }

  exportAsJPEG(quality = 0.9) {
    // TODO: exportar como JPEG
    console.log(`Exportando como JPEG com qualidade ${quality}...`);

    try {
      const canvas = this.visualizationEngine.canvas;
      const $link = $("<a>").attr({
        //criaçao do link
        download: `audio-visualization-${new Date().getTime()}.jpg`,
        href: canvas.toDataURL("image/jpeg", quality),
      });
      $link[0].click();
    } catch (error) {
      console.error("Erro ao exportar JPEG:", error);
    }
  }
}

export { ExportManager };
