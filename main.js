// Controle de abas (matérias)
const tabs = document.querySelectorAll('nav button.tab-btn');
const materias = document.querySelectorAll('section.materia');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    materias.forEach(m => m.classList.remove('ativo'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.materia).classList.add('ativo');
  });
});

// Armazenar PDFs em memória (localStorage para persistência simples)
const materiasMap = {};
document.querySelectorAll('section.materia').forEach(sec => {
  materiasMap[sec.id] = [];
});

document.querySelectorAll('.pdf-upload').forEach((input, idx) => {
  const sec = input.closest('section.materia');
  const lista = sec.querySelector('.lista-pdfs');
  const materiaId = sec.id;

  // Carregar PDFs salvos no localStorage
  const saved = localStorage.getItem('pdfs-' + materiaId);
  if (saved) {
    materiasMap[materiaId] = JSON.parse(saved);
    atualizarListaPDFs(materiaId, lista);
  }

  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Por favor, envie apenas arquivos PDF.');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = function(evt) {
      // Salvar pdf no localStorage com nome e base64 (não é recomendado para arquivos grandes)
      const pdfData = {nome: file.name, base64: evt.target.result};
      materiasMap[materiaId].push(pdfData);
      localStorage.setItem('pdfs-' + materiaId, JSON.stringify(materiasMap[materiaId]));
      atualizarListaPDFs(materiaId, lista);
      input.value = '';
      alert('PDF enviado e salvo localmente! (Só no seu navegador)');
    };
    reader.readAsDataURL(file);
  });
});

function atualizarListaPDFs(materiaId, lista) {
  lista.innerHTML = '';
  materiasMap[materiaId].forEach((pdf, i) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = pdf.base64;
    a.target = '_blank';
    a.textContent = pdf.nome;
    li.appendChild(a);

    // Botão remover
    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'X';
    btnRemover.title = 'Remover PDF';
    btnRemover.style.marginLeft = '10px';
    btnRemover.style.background = 'transparent';
    btnRemover.style.border = 'none';
    btnRemover.style.color = 'red';
    btnRemover.style.cursor = 'pointer';
    btnRemover.onclick = () => {
      materiasMap[materiaId].splice(i, 1);
      localStorage.setItem('pdfs-' + materiaId, JSON.stringify(materiasMap[materiaId]));
      atualizarListaPDFs(materiaId, lista);
    };
    li.appendChild(btnRemover);

    lista.appendChild(li);
  });
}

// Formulário comentário - simulação de envio via email (alert)
