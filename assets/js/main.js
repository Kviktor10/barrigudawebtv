// --- FUNÇÃO PARA FORÇAR O DOWNLOAD ---
async function getImages(url, nomeArquivo) {
    try {
        // O segredo está no { mode: 'cors' }
        const resposta = await fetch(url, { mode: 'cors' });
        if (!resposta.ok) throw new Error('Erro na rede');

        const blob = await resposta.blob();
        const urlBlob = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = urlBlob;
        link.download = `${nomeArquivo}.jpg`; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(urlBlob);
    } catch (erro) {
        console.warn("CORS ou erro de rede. Tentando download tradicional...", erro);
        // Fallback: tenta baixar do jeito simples se o fetch falhar
        const linkSimples = document.createElement('a');
        linkSimples.href = url;
        linkSimples.target = "_blank";
        linkSimples.download = nomeArquivo;
        linkSimples.click();
    }
}

// --- FUNÇÃO PARA COMPARTILHAR O ARQUIVO ---
async function compartilharArquivo(url, nome) {
    try {
        const resposta = await fetch(url, { mode: 'cors' });
        const blob = await resposta.blob();
        const arquivo = new File([blob], `${nome}.jpg`, { type: 'image/jpeg' });

        if (navigator.canShare && navigator.canShare({ files: [arquivo] })) {
            await navigator.share({
                files: [arquivo],
                title: nome,
                text: `Enviando arquivo: ${nome}`
            });
        } else {
            throw new Error('Navegador não suporta compartilhamento de arquivos');
        }
    } catch (erro) {
        alert("O compartilhamento de arquivo direto não é suportado neste navegador/dispositivo. Copie o link!");
        navigator.clipboard.writeText(url);
    }
}
