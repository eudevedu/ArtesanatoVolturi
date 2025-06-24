document.addEventListener("DOMContentLoaded", () => {
  const produtos = [
    { nome: "Linha de algodão", preco: 0.43 },
    { nome: "Fardo de Garrafa de vidro", preco: 0.49 },
    { nome: "Cápsula plástica", preco: 0.65 },
    { nome: "Alça de couro", preco: 0.72 },
    { nome: "Mochila 20KG", preco: 10.0 },
    { nome: "Tinta", preco: 0.36 },
    { nome: "Embalagem", preco: 0.57 },
    { nome: "Coador", preco: 0.33 },
    { nome: "Verniz", preco: 0.46 },
    { nome: "Rótulo", preco: 0.48 },
    { nome: "Vara de pescar", preco: 10.0 },
    { nome: "Câmera Fotográfica", preco: 26.33 },
    { nome: "Bonecas", preco: 8.45 },
    { nome: "Orelhas", preco: 8.45 },
    { nome: "Caixa Rústica", preco: 0.5 },
    { nome: "Seda", preco: 0.55 },
  ];

  const tabela = document.querySelector("#tabelaProdutos tbody");

  produtos.forEach((produto, i) => {
    const row = tabela.insertRow();
    row.innerHTML = `
      <td>${produto.nome}</td>
      <td>R$ ${produto.preco.toFixed(2)}</td>
      <td><input type="number" min="0" value="0" data-index="${i}" /></td>
      <td id="total-${i}">R$ 0,00</td>
    `;
  });

  document.querySelectorAll("input[data-index]").forEach((input) => {
    input.addEventListener("input", atualizarTotal);
  });

  function atualizarTotal() {
    let total = 0;
    document.querySelectorAll("input[data-index]").forEach((input) => {
      const i = Number(input.dataset.index);
      const qtd = Number(input.value);
      if (!Number.isInteger(i) || !produtos[i]) return;

      const subtotal = produtos[i].preco * qtd;
      document.getElementById(`total-${i}`).innerText = `R$ ${subtotal.toFixed(
        2
      )}`;
      total += subtotal;
    });

    document.getElementById(
      "totalPedido"
    ).innerText = `Total do Pedido: R$ ${total.toFixed(2)}`;
  }

  window.enviarPedido = async function () {
    const nome = document.getElementById("nome").value.trim();
    const pombo = document.getElementById("pombo").value.trim();

    if (!nome || !pombo) {
      alert("Por favor, preencha seu nome e o nome do pombo.");
      return;
    }

    let pedido = `**Novo Pedido**\n👤 Nome: ${nome}\n🐦 Pombo: ${pombo}\n\n📦 **Itens:**\n`;
    let total = 0;

    document.querySelectorAll("input[data-index]").forEach((input) => {
      const i = Number(input.dataset.index);
      const qtd = Number(input.value);
      if (!Number.isInteger(i) || !produtos[i] || qtd <= 0) return;

      const produto = produtos[i];
      const subtotal = qtd * produto.preco;
      pedido += `- ${produto.nome} x ${qtd} = R$ ${subtotal.toFixed(2)}\n`;
      total += subtotal;
    });

    if (total === 0) {
      alert("Nenhum item foi selecionado.");
      return;
    }

    pedido += `\n💰 Total: R$ ${total.toFixed(2)}`;

    try {
      await fetch(
        "https://discord.com/api/webhooks/1385725607245250642/kyubfcOEk7bY2lT9_0sTbUHLFJ2bOU1iigPCnH4iRvwcDeV7SBGgv74BJrYwXuwSm5qk", // Insira aqui o webhook do Discord, se quiser testar
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: pedido }),
        }
      );

      alert("Pedido enviado com sucesso!");

      // Resetar campos
      document.getElementById("nome").value = "";
      document.getElementById("pombo").value = "";
      document.querySelectorAll("input[data-index]").forEach((input) => {
        input.value = 0;
      });
      atualizarTotal();
    } catch (error) {
      alert("Erro ao enviar o pedido.");
      console.error(error);
    }
  };
});
