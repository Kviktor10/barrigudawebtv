// main.js
document.addEventListener('DOMContentLoaded', () => {
    renderizarGaleria();
});

function renderizarGaleria() {
    const grid = document.getElementById('galeria');
    grid.innerHTML = bancoDeImagens.map(item => `
        <div class="asset-card">
            <div class="preview-container ratio-${item.formato.replace(':', '-')}">
                <img src="${item.url}" alt="${item.nome}" loading="lazy">
            </div>
            <div class="card-content">
                <span class="format-badge">${item.formato}</span>
                <h3>${item.nome}</h3>
                <div class="actions">
                    <button class="btn btn-download" onclick="executarDownload('${item.url}', '${item.nome}')">
                        <i class="fa-solid fa-arrow-down"></i> Baixar
                    </button>
                    <button class="btn btn-share" onclick="executarPartilha('${item.url}', '${item.nome}')">
                        <i class="fa-solid fa-share-nodes"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Lógica de Download Forçado (Blob)
async function executarDownload(url, nome) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.download = `${nome.replace(/\s+/g, '_').toLowerCase()}.jpg`;
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        
        window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
        console.error("Erro no download:", err);
        // Fallback caso o CORS bloqueie o fetch
        window.open(url, '_blank');
    }
}

// Lógica de Compartilhamento de Arquivo Real
async function executarPartilha(url, nome) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const file = new File([blob], `${nome}.jpg`, { type: blob.type });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: nome,
                text: `Confira este asset: ${nome}`
            });
        } else {
            // Fallback: Copiar link se não suportar partilha de ficheiros
            await navigator.clipboard.writeText(url);
            alert("Link copiado! Seu navegador não suporta envio direto de arquivos.");
        }
    } catch (err) {
        console.error("Erro ao compartilhar:", err);
    }
}
