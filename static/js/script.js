let origemSelecionada = null;

// Cores para os discos
const coresDiscos = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

window.onload = function() {
    carregarEstado();
};

function carregarEstado() {
    fetch('/estado_jogo')
        .then(response => response.json())
        .then(data => {
            atualizarTorres(data);
            verificarVitoria(data); // Verifica se o jogador venceu
        });
}

function atualizarTorres(torres) {
    for (let torre in torres) {
        let torreDiv = document.getElementById(torre);
        torreDiv.innerHTML = '<div class="pino"></div>'; // Limpa e recria o pino

        torres[torre].forEach((disco, index) => {
            let discoDiv = document.createElement('div');
            discoDiv.className = 'disco';
            discoDiv.style.width = `${disco * 20}px`; // Tamanho do disco
            discoDiv.style.bottom = `${index * 20}px`; // Altura do disco
            discoDiv.style.backgroundColor = coresDiscos[disco - 1]; // Atribui cor ao disco
            torreDiv.appendChild(discoDiv);
        });

        // Adiciona evento de clique à torre (não aos discos)
        torreDiv.onclick = () => selecionarTorre(torre);
    }
}

function selecionarTorre(torre) {
    if (origemSelecionada === null) {
        // Seleciona a torre de origem
        origemSelecionada = torre;
        document.getElementById('mensagem').textContent = `Selecionado: ${torre}. Escolha uma torre de destino.`;
    } else {
        // Seleciona a torre de destino e move o disco
        moverDisco(origemSelecionada, torre);
        origemSelecionada = null;
    }
}

function moverDisco(origem, destino) {
    fetch('/mover_disco', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ origem: origem, destino: destino })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            carregarEstado();  // Atualiza o estado das torres após o movimento
            document.getElementById('mensagem').textContent = '';
        } else {
            document.getElementById('mensagem').textContent = 'Movimento inválido!';
        }
    });
}

function verificarVitoria(torres) {
    const nDiscos = torres.Torre1.length + torres.Torre2.length + torres.Torre3.length;
    // Verifica se todos os discos estão em Torre2 ou Torre3
    if (torres.Torre2.length === nDiscos || torres.Torre3.length === nDiscos) {
        document.getElementById('mensagem').textContent = 'Parabéns! Você venceu o jogo!';
    }
}

function recomecarJogo() {
    fetch('/recomecar', {
        method: 'POST'
    })
    .then(() => {
        carregarEstado();  // Recarrega o estado inicial do jogo após o reinício
        document.getElementById('mensagem').textContent = 'Jogo reiniciado!';
    });
}
