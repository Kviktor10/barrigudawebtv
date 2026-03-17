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

// Lógica de Download Melhorada (Detecta se é PNG ou JPG)
async function executarDownload(url, nome) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const extension = url.split('.').pop(); // Pega 'png' ou 'jpg' da URL automaticamente
        
        const blobUrl = window.URL.createObjectURL(blob);
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        
        // Usa a extensão correta do arquivo original
        tempLink.download = `${nome.replace(/\s+/g, '_').toLowerCase()}.${extension}`;
        
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
        window.open(url, '_blank');
    }
}

// Lógica de Compartilhamento Melhorada
async function executarPartilha(url, nome) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const extension = url.split('.').pop();
        const file = new File([blob], `${nome}.${extension}`, { type: blob.type });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: nome,
            });
        } else {
            await navigator.clipboard.writeText(url);
            alert("Link copiado!");
        }
    } catch (err) {
        console.error(err);
    }
}
