let estoque = JSON.parse(localStorage.getItem("estoque")) || [];
let pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
let vendas = JSON.parse(localStorage.getItem("vendas")) || {};
let lucro = 0;
let grafico;

function salvar(){

localStorage.setItem("estoque",JSON.stringify(estoque));
localStorage.setItem("pedidos",JSON.stringify(pedidos));
localStorage.setItem("vendas",JSON.stringify(vendas));

}

function nivelEstoque(q){

if(q >= 50) return {texto:"ALTO",classe:"estoque-alto"};

if(q >= 20) return {texto:"MÉDIO",classe:"estoque-medio"};

return {texto:"BAIXO",classe:"estoque-baixo"};

}

function adicionarProduto(){

let nome=document.getElementById("nomeProduto").value;
let quantidade=parseInt(document.getElementById("quantidadeProduto").value);
let preco=parseFloat(document.getElementById("precoProduto").value);

if(!nome || !quantidade || !preco) return;

estoque.push({nome,quantidade,preco});

salvar();

mostrarEstoque();
carregarProdutos();

}

function mostrarEstoque(){

let tabela=document.getElementById("tabelaEstoque");

tabela.innerHTML="";

estoque.forEach((p,i)=>{

let nivel=nivelEstoque(p.quantidade);

tabela.innerHTML+=`

<tr>

<td>${p.nome}</td>

<td>${p.quantidade}</td>

<td class="${nivel.classe}">${nivel.texto}</td>

<td>R$ ${p.preco.toFixed(2)}</td>

<td>

<button onclick="removerProduto(${i})">🗑️</button>

</td>

</tr>

`;

});

}

function removerProduto(i){

estoque.splice(i,1);

salvar();

mostrarEstoque();
carregarProdutos();

}

function registrarVenda(){

let nome=document.getElementById("produtoVenda").value;
let qtd=parseInt(document.getElementById("quantidadeVenda").value);

let prod=estoque.find(p=>p.nome===nome);

if(!prod || prod.quantidade<qtd){

alert("Produto não encontrado ou estoque insuficiente");

return;

}

prod.quantidade-=qtd;

lucro+=qtd*prod.preco;

document.getElementById("lucroDia").innerText="R$ "+lucro.toFixed(2);

if(!vendas[nome]) vendas[nome]=0;

vendas[nome]+=qtd;

salvar();

mostrarEstoque();
atualizarGrafico();

}

function carregarProdutos(){

let select=document.getElementById("produtoPedido");

select.innerHTML='<option value="">Escolher produto</option>';

estoque.forEach(p=>{

let op=document.createElement("option");

op.value=p.nome;
op.textContent=p.nome;

select.appendChild(op);

});

}

function registrarPedido(){

let cliente=document.getElementById("clientePedido").value;

let endereco=document.getElementById("enderecoPedido").value;

let produto=document.getElementById("produtoPedido").value;

let qtd=parseInt(document.getElementById("quantidadePedido").value);

let prioridade=document.getElementById("prioridadePedido").value;

if(!cliente || !produto || !qtd) return;

pedidos.push({

cliente,
endereco,
produto,
qtd,
prioridade,
status:"Recebido"

});

salvar();

mostrarPedidos();

}

function mostrarPedidos(){

let lista=document.getElementById("listaPedidos");

lista.innerHTML="";

pedidos.forEach((p,i)=>{

let classe="prioridade-baixa";

if(p.prioridade==="Alta") classe="prioridade-alta";

if(p.prioridade==="Média") classe="prioridade-media";

lista.innerHTML+=`

<li>

<b>${p.cliente}</b> - ${p.produto} (${p.qtd})<br>

📍 ${p.endereco}<br>

Prioridade: <span class="${classe}">${p.prioridade}</span><br>

Status: ${p.status}<br>

<button onclick="caminho(${i})">📦 A Caminho</button>

<button onclick="entregue(${i})">✅ Entregue</button>

<button onclick="cancelar(${i})">❌ Cancelar</button>

</li>

<hr>

`;

});

}

function caminho(i){

pedidos[i].status="A Caminho";

salvar();

mostrarPedidos();

}

function entregue(i){

let pedido = pedidos[i];

let produto = estoque.find(p=>p.nome===pedido.produto);

if(produto && produto.quantidade >= pedido.qtd){

produto.quantidade -= pedido.qtd;

lucro += pedido.qtd * produto.preco;

document.getElementById("lucroDia").innerText = "R$ " + lucro.toFixed(2);

if(!vendas[pedido.produto]){

vendas[pedido.produto]=0;

}

vendas[pedido.produto] += pedido.qtd;

pedido.status="Entregue";

salvar();

mostrarEstoque();
mostrarPedidos();
atualizarGrafico();

}else{

alert("Estoque insuficiente para completar entrega");

}

};



function cancelar(i){

pedidos[i].status="Cancelado";

salvar();

mostrarPedidos();

}

function atualizarGrafico(){

let ctx=document.getElementById("graficoVendas");

let labels=Object.keys(vendas);

let dados=Object.values(vendas);

if(grafico) grafico.destroy();

grafico=new Chart(ctx,{

type:"bar",

data:{

labels:labels,

datasets:[{

label:"Vendas",

data:dados,

backgroundColor:"green"

}]

}

});

}

function limparSistema(){

if(confirm("Tem certeza que deseja apagar TODOS os dados do sistema?")){

estoque=[];
pedidos=[];
vendas={};
lucro=0;

localStorage.clear();

document.getElementById("lucroDia").innerText="R$ 0.00";

mostrarEstoque();
mostrarPedidos();
carregarProdutos();

if(grafico) grafico.destroy();

atualizarGrafico();

}

}

mostrarEstoque();
mostrarPedidos();
carregarProdutos();
atualizarGrafico();