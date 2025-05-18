document.getElementById('pdfInput').addEventListener('change', function() {
  const file = this.files[0];
  const status = document.getElementById('uploadStatus');
  if (file && file.type === "application/pdf") {
    status.textContent = `Arquivo "${file.name}" selecionado com sucesso.`;
    status.style.color = "lightgreen";
  } else {
    status.textContent = "Por favor, selecione um arquivo PDF válido.";
    status.style.color = "red";
  }
});
