window.enviarPedido = async function () {
  const nome = document.getElementById("nome").value.trim();
  const pombo = document.getElementById("pombo").value.trim();

  if (!nome || !pombo) {
    alert("Por favor, preencha seu nome e o nome do pombo.");
    return;
  }

  let itensSelecionados = "";
  let total = 0;

  document.querySelectorAll("input[data-index]").forEach((input) => {
    const i = Number(input.dataset.index);
    const qtd = Number(input.value);
    if (!Number.isInteger(i) || !produtos[i] || qtd <= 0) return;

    const produto = produtos[i];
    const subtotal = qtd * produto.preco;
    itensSelecionados += `- ${produto.nome} x ${qtd} = R$ ${subtotal.toFixed(2)}\n`;
    total += subtotal;
  });

  if (total === 0) {
    alert("Nenhum item foi selecionado.");
    return;
  }

  try {
    await fetch("https://devedusb.app.n8n.cloud/webhook/enviar-pedido", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        pombo,
        itensSelecionados,  // aqui enviamos só os itens
        total: total.toFixed(2)
      })
    });

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
