document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("galeria");

    // Limpa o container
    container.innerHTML = "";

    // Mapeia o array e cria o HTML para cada item
    bancoDeImagens.forEach(item => {
        // Define a classe de proporção baseada no formato do JSON
        const ratioClass = `ratio-${item.formato.replace(":", "-")}`;

        const card = `
            <div class="card">
                <div class="preview-box ${ratioClass}">
                    <img src="${item.preview}" alt="${item.nome}" loading="lazy">
                </div>
                <div class="card-info">
                    <span class="formato-tag">${item.formato}</span>
                    <h3>${item.nome}</h3>
                    <a href="${item.download}" download="${item.nome}" class="btn-download">
                        <i class="fa-solid fa-cloud-arrow-down"></i> Baixar Arquivo
                    </a>
                </div>
            </div>
        `;
        
        container.innerHTML += card;
    });
});
