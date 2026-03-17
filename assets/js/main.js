document.addEventListener("DOMContentLoaded", () => {
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
                    <a href="${item.download}" download="${item.nome}" class="btn-download">
                        <i class="fa-solid fa-download"></i> Baixar
                    </a>
                    <button class="btn-share" onclick="compartilhar('${item.nome}', '${item.download}')">
                        <i class="fa-solid fa-share-nodes"></i>
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
});

// Função de Compartilhamento
async function compartilhar(titulo, url) {
    if (navigator.share) {
        try {
            await navigator.share({
                title: titulo,
                text: `Confira esta imagem: ${titulo}`,
                url: url, // Link que será compartilhado
            });
            console.log('Compartilhado com sucesso!');
        } catch (err) {
            console.log('Erro ao compartilhar:', err);
        }
    } else {
        // Caso o navegador não suporte Web Share (ex: Desktops antigos)
        // Podemos copiar o link para a área de transferência como fallback
        navigator.clipboard.writeText(url);
        alert("Link copiado para a área de transferência! O seu navegador não suporta compartilhamento direto.");
    }
}
