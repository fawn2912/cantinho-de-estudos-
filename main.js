// Função para trocar abas
const abas = document.querySelectorAll('nav button.tab-btn');
const materias = document.querySelectorAll('main section.materia');

abas.forEach(aba => {
  aba.addEventListener('click', () => {
    // Remove ativo de todos os botões
    abas.forEach(btn => btn.classList.remove('active'));
    // Ativa o botão clicado
    aba.classList.add('active');

    // Esconde todas as matérias
    materias.forEach(sec => sec.classList.remove('ativo'));

    // Mostra a matéria clicada
    const materiaId = aba.getAttribute('data-materia');
    document.getElementById(materiaId).classList.add('ativo');

    // Atualiza lista de arquivos da matéria atual
    atualizarListaArquivos(materiaId);
  });
});

// Função para salvar e listar arquivos no localStorage por matéria
function salvarArquivo(materia, arquivo) {
  // arquivo = { nome, base64, tipo }
  let arquivos = JSON.parse(localStorage.getItem('arquivos-' + materia)) || [];
  arquivos.push(arquivo);
  localStorage.setItem('arquivos-' + materia, JSON.stringify(arquivos));
}

function removerArquivo(materia, index) {
  let arquivos = JSON.parse(localStorage.getItem('arquivos-' + materia)) || [];
  arquivos.splice(index, 1);
  localStorage.setItem('arquivos-' + materia, JSON.stringify(arquivos));
  atualizarListaArquivos(materia);
}

function atualizarListaArquivos(materia) {
  const lista = document.querySelector(`#${materia} .lista-pdfs`);
  lista.innerHTML = '';

  let arquivos = JSON.parse(localStorage.getItem('arquivos-' + materia)) || [];
  arquivos.forEach((arq, i) => {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.href = arq.base64;
    link.target = '_blank';
    link.textContent = arq.nome;
    li.appendChild(link);

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'X';
    btnExcluir.title = 'Excluir arquivo';
    btnExcluir.addEventListener('click', () => {
      removerArquivo(materia, i);
    });
    li.appendChild(btnExcluir);

    lista.appendChild(li);
  });
}

// Função para ler arquivo e salvar
function handleUpload(event) {
  const input = event.target;
  const materia = input.closest('section.materia').id;
  const file = input.files[0];

  if (!file) return;

  // Aceitar apenas pdf e png
  if (!(file.type === 'application/pdf' || file.type === 'image/png')) {
    alert('Apenas arquivos PDF ou PNG são permitidos!');
    input.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    salvarArquivo(materia, {
      nome: file.name,
      base64: e.target.result,
      tipo: file.type
    });
    atualizarListaArquivos(materia);
    input.value = '';
  };
  reader.readAsDataURL(file);
}

// Configura uploads
const inputsUpload = document.querySelectorAll('.pdf-upload');
inputsUpload.forEach(input => {
  input.addEventListener('change', handleUpload);
});

// Inicializa a lista da matéria ativa ao carregar
document.addEventListener('DOMContentLoaded', () => {
  const ativo = document.querySelector('nav button.tab-btn.active').getAttribute('data-materia');
  atualizarListaArquivos(ativo);
});

// Formulários de comentário
const formsComentario = document.querySelectorAll('.comentario-form');
formsComentario.forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const nome = form.nome.value.trim();
    const email = form.email.value.trim();
    const mensagem = form.mensagem.value.trim();
    const materia = form.closest('section.materia').id;

    if (!nome || !email || !mensagem) {
      alert('Preencha todos os campos do comentário.');
      return;
    }

    // Salvar comentários no localStorage por matéria
    const keyComentarios = 'comentarios-' + materia;
    let comentarios = JSON.parse(localStorage.getItem(keyComentarios)) || [];
    comentarios.push({ nome, email, mensagem, data: new Date().toISOString() });
    localStorage.setItem(keyComentarios, JSON.stringify(comentarios));

    alert('Comentário enviado com sucesso!');
    form.reset();
  });
});
