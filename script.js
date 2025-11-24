let vendedores = [
    {nome: "Ana", foto: "https://i.pravatar.cc/150?img=1", venda: 12000},
    {nome: "Bruno", foto: "https://i.pravatar.cc/150?img=2", venda: 9000},
    {nome: "Carla", foto: "https://i.pravatar.cc/150?img=3", venda: 7500},
    {nome: "Daniel", foto: "https://i.pravatar.cc/150?img=4", venda: 6000},
    {nome: "Eduardo", foto: "https://i.pravatar.cc/150?img=5", venda: 5000},
    {nome: "Fernanda", foto: "https://i.pravatar.cc/150?img=6", venda: 4000},
    {nome: "Gabriel", foto: "https://i.pravatar.cc/150?img=7", venda: 3000},
    {nome: "Helena", foto: "https://i.pravatar.cc/150?img=8", venda: 2000}
];

function formatValor(num){
    return num.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

function renderPodio() {
    const top = [...vendedores].sort((a,b)=>b.venda-a.venda);
    const posicoes = ["primeiro","segundo","terceiro"];
    posicoes.forEach((id,i)=>{
        const lugar = document.getElementById(id);
        lugar.classList.remove("destaque");
        if(top[i]){
            const img = lugar.querySelector("img");
            const nome = lugar.querySelector("h3");
            const venda = lugar.querySelector("p");
            const colocacao = lugar.querySelector(".colocacao");
            nome.textContent = top[i].nome;
            venda.textContent = `R$ ${formatValor(top[i].venda)}`;
            colocacao.textContent = `${i+1}º`;

            img.style.opacity = 0;
            setTimeout(()=>{
                img.src = top[i].foto; 
                img.style.opacity = 1;
            },100);

            if(id==="primeiro") { lugar.style.transform = "translateY(-15px)"; lugar.classList.add("destaque"); }
            if(id==="segundo") lugar.style.transform = "translateY(0px)";
            if(id==="terceiro") lugar.style.transform = "translateY(10px)";
        } else {
            lugar.querySelector("img").src = "";
            lugar.querySelector("h3").textContent = "";
            lugar.querySelector("p").textContent = "";
            lugar.querySelector(".colocacao").textContent = "";
        }
    });
}

function renderLista() {
    const lista = document.getElementById("listaVendedores");
    lista.innerHTML = "";
    vendedores.sort((a,b)=>b.venda-a.venda).forEach((v,index)=>{
        const div = document.createElement("div");
        div.className = "vendedor-card";
        div.innerHTML = `
            <span class="num-colocacao">${index+1}º</span>
            <img src="${v.foto}" alt="">
            <div class="vendedor-info">
                <h3>${v.nome}</h3>
                <input type="text" class="venda-input" value="${formatValor(v.venda)}" onchange="updateVenda(${index}, this.value)">
            </div>
            <button class="delete-btn" onclick="delVendedor(${index})">Excluir</button>
        `;
        lista.appendChild(div);
    });
}

function updateVenda(index, valor){
    let valorLimpo = valor.replace(/\./g,'').replace(',', '.');
    const valorNum = parseFloat(valorLimpo);
    if(isNaN(valorNum) || valorNum < 0){ 
        alert("Valor inválido"); 
        renderLista();
        return; 
    }
    vendedores[index].venda = valorNum;
    // Animação suave do pódio
    const podioAntes = vendedores.slice();
    renderPodio();
    renderLista();
}

function delVendedor(index){
    if(confirm("Deseja remover este vendedor e todas as vendas?")){
        vendedores.splice(index,1);
        renderPodio();
        renderLista();
    }
}

function addVendedor(){
    const nome = document.getElementById("nome").value;
    const fotoInput = document.getElementById("foto");

    if(!nome || !fotoInput.files[0]) { 
        alert("Preencha tudo!"); 
        return; 
    }

    const reader = new FileReader();
    reader.onload = function(e){
        vendedores.push({nome, foto: e.target.result, venda: 0});
        document.getElementById("nome").value = "";
        fotoInput.value = "";
        renderPodio();
        renderLista();
    }
    reader.readAsDataURL(fotoInput.files[0]);
}

renderPodio();
renderLista();