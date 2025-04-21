function addComment() {
    const comment = document.getElementById("comment").value;
    if (comment.trim() !== "") {
      let comments = JSON.parse(localStorage.getItem("comments")) || [];
      comments.push(comment);
      localStorage.setItem("comments", JSON.stringify(comments));
      document.getElementById("comment").value = "";
      displayComments();
    }
  }
  
  function displayComments() {
    const commentContainer = document.getElementById("comments");
    commentContainer.innerHTML = "";
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.forEach(c => {
      const p = document.createElement("p");
      p.textContent = "📝 " + c;
      commentContainer.appendChild(p);
    });
  }
  
  window.onload = displayComments;
  

function createFallingAvocados() {
    const container = document.querySelector('.falling-avocados');
    const totalAvocados = 100; // Número de abacates caindo

    for (let i = 0; i < totalAvocados; i++) {
        const avocado = document.createElement('div');
        avocado.classList.add('avocado');
        avocado.textContent = '🥑'; // Emoji de abacate

        // Posicionamento aleatório
        avocado.style.left = Math.random() * 100 + 'vw';
        avocado.style.animationDuration = Math.random() * 3 + 2 + 's'; // Duração aleatória
        avocado.style.animationDelay = Math.random() * 5 + 's'; // Atraso aleatório

        container.appendChild(avocado);
    }
}

// Inicia os abacates caindo
createFallingAvocados();

async function loadGitHubProjects() {
    const username = 'nertonm'; // Substitua pelo seu nome de usuário do GitHub
    const projectListElement = document.getElementById('project-list');

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar repositórios: ${response.status}`);
        }

        const repos = await response.json();

        // Filtra repositórios que não são forks ou têm pelo menos 2 estrelas
        const filteredRepos = repos.filter(repo => !repo.fork || repo.stargazers_count >= 2);

        // Ordena os repositórios por estrelas (opcional) e limita a 10 projetos
        const topRepos = filteredRepos
            .sort((a, b) => b.stargazers_count - a.stargazers_count)
            .slice(0, 100);

        // Limpa a lista antes de adicionar os projetos
        projectListElement.innerHTML = '';

        topRepos.forEach(repo => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a> - ${repo.description || 'Sem descrição'}`;
            projectListElement.appendChild(listItem);
        });

        // Armazena a lista de projetos carregados
        projectList = topRepos;
    } catch (error) {
        console.error('Erro ao carregar repositórios:', error);
        projectListElement.innerHTML = '<li>Não foi possível carregar os projetos.</li>';
    }
}

// Carregar projetos ao iniciar
loadGitHubProjects();


// Alternar entre tema claro e escuro
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    // Salva a preferência do tema no localStorage
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
});

// Carregar o tema salvo
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
});


const hireMe = document.getElementById('hire-me');
let hireMeX = 100;
let hireMeY = 100;
let direction = { x: 1, y: 1 }; // Movimento inicial na diagonal
let capturedAvocados = [];
let avocadoCount = 0;
let speed = 10; // Velocidade inicial do movimento
const colors = ['#16a085', '#1abc9c', '#f39c12', '#e74c3c', '#9b59b6'];

// Atualiza a cor do "Hire Me" a cada 500ms
setInterval(() => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    hireMe.style.color = randomColor;
}, 500);

// Função para mover o "Hire Me"
function moveHireMe() {
    hireMeX += direction.x * speed;
    hireMeY += direction.y * speed;

    // Rebater nas bordas da tela visível
    const maxWidth = window.innerWidth - hireMe.offsetWidth;
    const maxHeight = window.innerHeight - hireMe.offsetHeight;

    if (hireMeX <= 0 || hireMeX >= maxWidth) {
        direction.x *= -1; // Inverte a direção horizontal
        hireMeX = Math.max(0, Math.min(hireMeX, maxWidth)); // Garante que não ultrapasse os limites
    }
    if (hireMeY <= 0 || hireMeY >= maxHeight) {
        direction.y *= -1; // Inverte a direção vertical
        hireMeY = Math.max(0, Math.min(hireMeY, maxHeight)); // Garante que não ultrapasse os limites
    }

    hireMe.style.transform = `translate(${hireMeX}px, ${hireMeY}px)`;
}

// Função para atualizar a velocidade, tamanho e adicionar novos projetos
function updateHireMe() {
    speed = 10 + avocadoCount * 2; // Incrementa a velocidade com base no número de abacates

    // Adiciona novos projetos conforme o número de abacates capturados
    if (avocadoCount > 0 && avocadoCount % 5 === 0) { // Adiciona um novo projeto a cada 5 abacates
        addNewProjectFromList();
    }
}

// Lista de projetos carregados da API
let projectList = [];

// Função para adicionar um novo projeto da lista carregada
function addNewProjectFromList() {
    if (projectList.length === 0) return; // Não faz nada se não houver projetos

    // Remove o primeiro projeto da lista
    const repo = projectList.shift();

    // Verifica se o projeto é um fork com menos de 3 estrelas e ignora
    if (repo.fork && repo.stargazers_count < 3) {
        addNewProjectFromList(); // Tenta adicionar o próximo projeto
        return;
    }

    // Cria o elemento do projeto
    const newProject = document.createElement('div');
    newProject.classList.add('project');
    newProject.textContent = repo.name; // Nome do projeto

    // Define o tamanho dinâmico com base no texto
    newProject.style.position = 'absolute';
    newProject.style.padding = '10px'; // Adiciona padding para espaçamento interno
    newProject.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    newProject.style.color = '#fff';
    newProject.style.display = 'flex';
    newProject.style.alignItems = 'center';
    newProject.style.justifyContent = 'center';
    newProject.style.borderRadius = '10px';
    newProject.style.cursor = 'pointer';
    newProject.style.whiteSpace = 'nowrap'; // Garante que o texto não quebre em várias linhas

    // Define a largura e altura automáticas para caber o texto
    newProject.style.width = 'auto';
    newProject.style.height = 'auto';

    // Obtém as dimensões da "box" do portfólio
    const portfolioBox = document.getElementById('portfolio-box'); // Substitua pelo ID da sua "box"
    const portfolioRect = portfolioBox.getBoundingClientRect();

    let left, top;

    // Gera posições aleatórias até que o elemento não sobreponha a "box"
    do {
        left = Math.random() * (window.innerWidth - newProject.offsetWidth);
        top = Math.random() * (window.innerHeight - newProject.offsetHeight);
    } while (
        left < portfolioRect.right &&
        left + newProject.offsetWidth > portfolioRect.left &&
        top < portfolioRect.bottom &&
        top + newProject.offsetHeight > portfolioRect.top
    );

    // Define a posição do elemento
    newProject.style.left = `${left}px`;
    newProject.style.top = `${top}px`;

    // Adiciona evento de clique para redirecionar ao link do projeto e remover o bloco
    newProject.addEventListener('click', (event) => {
        event.preventDefault(); // Previne o comportamento padrão do clique
        window.open(repo.html_url, '_blank'); // Abre o link do projeto em uma nova guia
        newProject.remove(); // Remove o bloco clicado
    });

    document.body.appendChild(newProject);
}

// Função para adicionar novos elementos "Hire Me"
function addNewHireMe() {
    const newHireMe = document.createElement('div');
    newHireMe.classList.add('hire-me');
    newHireMe.textContent = 'Hire Me';

    // Define o tamanho com base no tamanho atual do elemento principal
    const size = 50 + avocadoCount * 10;
    newHireMe.style.position = 'absolute';
    newHireMe.style.left = `${Math.random() * (window.innerWidth - size)}px`; // Garante que o elemento não ultrapasse a largura da tela
    newHireMe.style.top = `${Math.random() * (window.innerHeight - size)}px`; // Garante que o elemento não ultrapasse a altura da tela
    newHireMe.style.width = `${size}px`;
    newHireMe.style.height = `${size}px`;
    newHireMe.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    newHireMe.style.color = '#fff';
    newHireMe.style.display = 'flex';
    newHireMe.style.alignItems = 'center';
    newHireMe.style.justifyContent = 'center';
    newHireMe.style.borderRadius = '50%';
    newHireMe.style.cursor = 'pointer';

    // Adiciona evento de clique para o novo "Hire Me"
    newHireMe.addEventListener('click', () => {
        avocadoCount = 0; // Reseta o contador de abacates
        capturedAvocados = []; // Limpa os abacates capturados
        updateHireMe(); // Reseta o tamanho e a velocidade
        newHireMe.remove(); // Remove o novo "Hire Me" ao ser clicado
    });

    document.body.appendChild(newHireMe);
}

// Função para soltar todos os abacates e resetar o tamanho
hireMe.addEventListener('click', () => {
    if (capturedAvocados.length > 0) {
        hireMe.classList.add('exploded');

        // Solta os abacates capturados
        capturedAvocados.forEach(avocado => {
            avocado.style.position = 'absolute';
            avocado.style.left = `${Math.random() * window.innerWidth}px`;
            avocado.style.top = `${Math.random() * window.innerHeight}px`;
            document.body.appendChild(avocado);
        });

        capturedAvocados = []; // Limpa a lista de capturados
        avocadoCount = 0; // Reseta o contador de abacates
        updateHireMe(); // Reseta o tamanho e a velocidade

        // Remove a explosão após 1 segundo
        setTimeout(() => {
            hireMe.classList.remove('exploded');
        }, 1000);
    }
});

// Contador de abacates
const counter = document.getElementById('counter');
const basket = document.getElementById('basket');

// Detecta colisão entre dois elementos
function isColliding(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();
    return !(
        rect1.top > rect2.bottom ||
        rect1.bottom < rect2.top ||
        rect1.left > rect2.right ||
        rect1.right < rect2.left
    );
}

// Adiciona o som de "plim"
const plimSound = new Audio('./plim.mp3'); // Certifique-se de ter o arquivo "plim.mp3" na pasta do projeto
let isMuted = false;

// Botão de mute
const muteButton = document.getElementById('mute-button');
muteButton.addEventListener('click', () => {
    isMuted = !isMuted;
    muteButton.textContent = isMuted ? '🔇' : '🔊'; // Alterna o ícone do botão
});

// Atualiza o contador de abacates e o estado do "Hire Me"
function updateCounter() {
    counter.textContent = `Abacates: ${avocadoCount}`;
    updateHireMe(); // Atualiza o tamanho e a velocidade
}

// Função para tocar o som de "plim"
function playPlimSound() {
    if (!isMuted) {
        const sound = new Audio('./plim.mp3'); // Cria uma nova instância do áudio
        sound.play();
    }
}

// Verifica se os abacates caem na bacia
function checkAvocadoCollision() {
    const avocados = document.querySelectorAll('.avocado');
    avocados.forEach(avocado => {
        if (isColliding(avocado, basket)) {
            avocado.remove(); // Remove o abacate capturado
            avocadoCount++;
            capturedAvocados.push(avocado); // Adiciona o abacate à lista de capturados
            updateCounter();

            // Toca o som de "plim"
            playPlimSound();
        }
    });
}

setInterval(moveHireMe, 50); // Move a cada 50ms para suavizar o movimento
setInterval(checkAvocadoCollision, 100); // Verifica colisões a cada 100ms

// Movimento horizontal da bacia com o mouse
document.addEventListener('mousemove', (event) => {
    const basketWidth = basket.offsetWidth;
    const windowWidth = window.innerWidth;

    // Calcula a posição horizontal da bacia com base no mouse
    let basketX = event.clientX - basketWidth / 2;

    // Garante que a bacia não saia da tela
    if (basketX < 0) basketX = 0;
    if (basketX > windowWidth - basketWidth) basketX = windowWidth - basketWidth;

    basket.style.left = `${basketX}px`;
});