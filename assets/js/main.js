document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("galeria");
    renderizarCards();
});

function renderizarCards() {
    const container = document.getElementById("galeria");
    container.innerHTML = "";

    bancoDeImagens.forEach(item => {
        const ratioClass = `ratio-${item.formato.replace(":", "-")}`;
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="preview-box ${ratioClass}">
                <img src="${item.preview}" alt="${item.nome}" loading="lazy">
            </div>
            <div class="card-info">
                <span class="formato-tag">${item.formato}</span>
                <h3>${item.nome}</h3>
                <div class="card-actions">
                    <button class="btn-download" onclick="forçarDownload('${item.download}', '${item.nome}')">
                        <i class="fa-solid fa-download"></i> Baixar
                    </button>
                    <button class="btn-share" onclick="compartilharArquivo('${item.download}', '${item.nome}')">
                        <i class="fa-solid fa-share-nodes"></i>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- FUNÇÃO PARA FORÇAR O DOWNLOAD DO ARQUIVO ---
async function forçarDownload(url, nomeArquivo) {
    try {
        const resposta = await fetch(url);
        const blob = await resposta.blob(); // Transforma a resposta em dado binário
        const urlBlob = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = urlBlob;
        link.download = `${nomeArquivo}.jpg`; // Força o nome do arquivo
        document.body.appendChild(link);
        link.click(); // Simula o clique
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(urlBlob); // Limpa a memória
    } catch (erro) {
        console.error("Erro ao baixar arquivo:", erro);
        alert("Não foi possível baixar o arquivo diretamente.");
    }
}

// --- FUNÇÃO PARA COMPARTILHAR O ARQUIVO REAL ---
async function compartilharArquivo(url, nome) {
    try {
        const resposta = await fetch(url);
        const blob = await resposta.blob();
        
        // Criamos um array de arquivos para a API de compartilhamento
        const arquivo = new File([blob], `${nome}.jpg`, { type: blob.type });

        if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
            await navigator.share({
                files: [arquivo],
                title: nome,
                text: `Confira este arquivo: ${nome}`
            });
        } else {
            // Fallback caso o navegador não suporte compartilhar ARQUIVOS
            navigator.clipboard.writeText(url);
            alert("Seu navegador não suporta compartilhamento de arquivos. O link foi copiado!");
        }
    } catch (erro) {
        console.error("Erro ao compartilhar:", erro);
    }
}
