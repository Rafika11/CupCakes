// Variáveis globais para manter o estado do carrinho e do cliente
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
let cartCount = cartItems.reduce((total, item) => total + item.quantidade, 0);
let isLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn")) || false;
let customerName = localStorage.getItem("customerName") || "";
let customerPhone = localStorage.getItem("customerPhone") || "";
let orderHistory = JSON.parse(localStorage.getItem("orderHistory")) || [];

const produtos = [
  {
    nome: "Cupcake de Chocolate",
    descricao: "Delicioso cupcake com cobertura de chocolate.",
    preco: 5.0,
    imagem: "cupcake2.jfif",
  },
  {
    nome: "Cupcake de Morango",
    descricao: "Cupcake de morango com cobertura de chantilly.",
    preco: 6.0,
    imagem: "cupcake1.jfif",
  },
  {
    nome: "Cupcake de Baunilha",
    descricao: "Cupcake de baunilha clássico e suave.",
    preco: 4.5,
    imagem: "cupcake3.jfif",
  },
];

// Atualizar o status de login ao carregar a página
window.onload = function () {
  if (isLoggedIn) {
    updateUserInterface(customerName);
  }
  updateCartBadge();
  if (document.body.contains(document.getElementById("produtos"))) {
    renderCatalogo();
  }
  if (document.body.contains(document.getElementById("carrinho-detalhes"))) {
    renderCarrinho();
  }
};

// Função de login do usuário
function login() {
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;

  if (validatePhone(telefone)) {
    if (isUserRegistered(telefone)) {
      const existingUser = getUserByPhone(telefone);
      if (existingUser && existingUser.nome !== nome) {
        alert(
          "Usuário já cadastrado com este telefone. Por favor, corrija o nome ou use outro número de telefone."
        );
        return;
      }
    } else {
      // Registrar novo usuário
      registerUser(nome, telefone);
    }

    customerName = nome;
    customerPhone = telefone;
    updateUserInterface(nome);

    isLoggedIn = true;
    localStorage.setItem("customerName", customerName);
    localStorage.setItem("customerPhone", customerPhone);
    localStorage.setItem("isLoggedIn", true);
  } else {
    alert("Telefone inválido. Por favor, insira no formato (DDD + 9 dígitos).");
  }
}

// Função para registrar um novo usuário
function registerUser(nome, telefone) {
  let registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];
  registeredUsers.push({ nome, telefone });
  localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
}

// Função para verificar se o usuário já está registrado
function isUserRegistered(telefone) {
  const registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];
  return registeredUsers.some((user) => user.telefone === telefone);
}

// Função para obter usuário pelo telefone
function getUserByPhone(telefone) {
  const registeredUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];
  return registeredUsers.find((user) => user.telefone === telefone);
}

// Função para atualizar a interface do usuário após o login
function updateUserInterface(nome) {
  const userStatusElement = document.getElementById("user-status");
  const loginSectionElement = document.getElementById("login-section");
  const userLoggedinElement = document.getElementById("user-loggedin");
  const userNameElement = document.getElementById("user-name");

  if (
    userStatusElement &&
    loginSectionElement &&
    userLoggedinElement &&
    userNameElement
  ) {
    userStatusElement.style.display = "none";
    loginSectionElement.style.display = "none";
    userLoggedinElement.style.display = "flex";
    userNameElement.innerText = `Bem-vindo, ${nome}!`;
  }
}

// Função de logoff do usuário
function logoff() {
  isLoggedIn = false;
  customerName = "";
  customerPhone = "";
  cartItems = [];
  cartCount = 0;

  localStorage.setItem("isLoggedIn", false);
  localStorage.removeItem("customerName");
  localStorage.removeItem("customerPhone");
  localStorage.removeItem("cartItems");

  alert("Você saiu da sua conta.");
  location.reload();
}

// Função para limpar o carrinho
function limparCarrinho() {
  cartItems = [];
  cartCount = 0;
  localStorage.removeItem("cartItems");
  updateCartBadge();

  // Limpar detalhes do carrinho na página de checkout
  const carrinhoDetalhes = document.getElementById("carrinho-detalhes");
  if (carrinhoDetalhes) {
    carrinhoDetalhes.innerHTML = "";
  }
}

// Atualizar o status de login ao carregar a página
window.onload = function () {
  if (isLoggedIn) {
    updateUserInterface(customerName);
  } else {
    limparCarrinho(); // Limpar o carrinho se não estiver logado
  }
  updateCartBadge();
  if (document.body.contains(document.getElementById("produtos"))) {
    renderCatalogo();
  }
  if (document.body.contains(document.getElementById("carrinho-detalhes"))) {
    renderCarrinho();
  }
};

// Função para atualizar a interface do usuário após o login
function updateUserInterface(nome) {
  const userStatusElement = document.getElementById("user-status");
  const loginSectionElement = document.getElementById("login-section");
  const userLoggedinElement = document.getElementById("user-loggedin");
  const userNameElement = document.getElementById("user-name");

  if (
    userStatusElement &&
    loginSectionElement &&
    userLoggedinElement &&
    userNameElement
  ) {
    userStatusElement.style.display = "none";
    loginSectionElement.style.display = "none";
    userLoggedinElement.style.display = "flex";
    userNameElement.innerText = `Bem-vindo, ${nome}!`;
  }
}

// Outras funções permanecem iguais...

/*--------------------*/

// Função de validação de telefone
function validatePhone(telefone) {
  const regex = /^\d{2}\d{9}$/;
  return regex.test(telefone);
}

// Função para exibir produtos no catálogo
function renderCatalogo() {
  const catalogo = document.getElementById("produtos");
  catalogo.innerHTML = ""; // Limpa o catálogo antes de adicionar produtos
  produtos.forEach((produto, index) => {
    const produtoDiv = document.createElement("div");
    produtoDiv.className = "produto";
    produtoDiv.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}">
      <h3>${produto.nome}</h3>
      <p>${produto.descricao}</p>
      <p>R$ ${produto.preco.toFixed(2)}</p>
      <label>Quantidade:
        <input type="number" min="1" max="5" value="1" id="quantidade-${index}">
      </label>
      <button onclick="addToCart(${index})">Adicionar ao Carrinho</button>
    `;
    catalogo.appendChild(produtoDiv);
  });
}

// Função para adicionar produtos ao carrinho e atualizar o emblema
function addToCart(index) {
  const quantidade = parseInt(
    document.getElementById(`quantidade-${index}`).value
  );
  if (quantidade > 0 && quantidade <= 5) {
    cartItems.push({ produto: produtos[index], quantidade });
    cartCount += quantidade;
    updateCartBadge();
    alert(
      `${produtos[index].nome} adicionado ao carrinho com quantidade: ${quantidade}`
    );
    localStorage.setItem("cartItems", JSON.stringify(cartItems)); // Salva o carrinho atualizado no localStorage
  } else {
    alert("Por favor, selecione uma quantidade entre 1 e 5.");
  }
}

// Atualizar o emblema do carrinho com a contagem de itens
function updateCartBadge() {
  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.innerText = cartCount;
  } else {
    console.error("Elemento do emblema do carrinho não encontrado");
  }
}

// Função para navegar para a página de finalização de compra
function goToCheckout() {
  if (!isLoggedIn) {
    alert("Faça login para visualizar o carrinho.");
    return;
  }
  // Salva os dados no localStorage e redireciona para checkout.html
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  localStorage.setItem("customerName", customerName);
  window.location.href = "checkout.html";
}

// Função para renderizar o carrinho na interface da página de checkout
function renderCarrinho() {
  const carrinhoDetalhes = document.getElementById("carrinho-detalhes");
  const nome = localStorage.getItem("customerName");
  carrinhoDetalhes.innerHTML = ""; // Limpa o conteúdo antes de renderizar

  if (cartItems.length === 0) {
    carrinhoDetalhes.innerHTML = "<p>O carrinho está vazio.</p>";
    return;
  } else {
    document.getElementById("user-name").innerText = `Cliente: ${nome}`;
  }
  cartItems.forEach((item, index) => {
    const produtoDiv = document.createElement("div");
    produtoDiv.className = "produto-item";
    produtoDiv.innerHTML = `
      <p>${item.produto.nome} - Quantidade: ${item.quantidade}</p>
      <p>Preço: R$ ${(item.produto.preco * item.quantidade).toFixed(2)}</p>
      <button onclick="removerProdutoDoCarrinho(${index})">Remover</button>
    `;
    carrinhoDetalhes.appendChild(produtoDiv);
  });
}

// Função para remover um item específico do carrinho
function removerProdutoDoCarrinho(index) {
  if (index >= 0 && index < cartItems.length) {
    const item = cartItems[index];
    cartCount -= item.quantidade;
    cartItems.splice(index, 1); // Remove o item do carrinho
    localStorage.setItem("cartItems", JSON.stringify(cartItems)); // Atualiza o armazenamento local
    updateCartBadge();
    renderCarrinho(); // Re-renderiza o carrinho para refletir a exclusão
    alert(`${item.produto.nome} foi removido do carrinho.`);
  } else {
    alert("Item não encontrado no carrinho.");
  }
}

// Função para limpar o carrinho
function limparCarrinho() {
  if (cartItems.length === 0) {
    return;
  }

  cartItems = [];
  cartCount = 0;
  updateCartBadge();
  localStorage.removeItem("cartItems");

  const carrinhoDetalhes = document.getElementById("carrinho-detalhes");
  if (carrinhoDetalhes) {
    carrinhoDetalhes.innerHTML = "<p>O carrinho está vazio.</p>";
  }
}

// Função para finalizar a compra
function finalizarCompra() {
  const storedCart = JSON.parse(localStorage.getItem("cartItems"));

  if (!storedCart || storedCart.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  let metodoPagamento = prompt(
    "Escolha o método de pagamento: 'Dinheiro' ou 'Pix'"
  );
  const total = storedCart.reduce(
    (sum, item) => sum + item.produto.preco * item.quantidade,
    0
  );

  if (metodoPagamento.toLowerCase() === "dinheiro") {
    const valorPago = parseFloat(
      prompt(`O total é R$${total.toFixed(2)}. Quanto você vai pagar?`)
    );
    if (valorPago >= total) {
      const troco = valorPago - total;
      alert(
        `Total a ser pago: R$${valorPago.toFixed(2)}. Troco: R$${troco.toFixed(
          2
        )}`
      );
    } else {
      alert(
        `O valor pago é insuficiente. Por favor, pague pelo menos R$${total.toFixed(
          2
        )}.`
      );
      return;
    }
  } else if (metodoPagamento.toLowerCase() === "pix") {
    alert(
      `Total a ser pago: R$${total.toFixed(
        2
      )}. Chave Pix do estabelecimento: 123@cupcakegourmet.com`
    );
  } else {
    alert("Método de pagamento inválido.");
    return;
  }

  // Obter o próximo número de pedido
  const orderNumber = getNextOrderNumber();
  const orderDate = new Date().toLocaleString();

  // Carregar o histórico de pedidos do usuário ou inicializar um novo array
  let userOrderHistory =
    JSON.parse(localStorage.getItem(`orderHistory_${customerPhone}`)) || [];

  // Adicionar o novo pedido ao histórico do usuário
  userOrderHistory.push({
    number: orderNumber,
    date: orderDate,
    total: total.toFixed(2),
    items: storedCart,
  });

  // Salvar o histórico atualizado no localStorage
  localStorage.setItem(
    `orderHistory_${customerPhone}`,
    JSON.stringify(userOrderHistory)
  );

  // Exibir alerta com os detalhes do pedido
  alert(
    `Compra finalizada com sucesso!\nNúmero do Pedido: ${orderNumber}\nData e Hora: ${orderDate}`
  );

  limparCarrinho();
  window.location.href = "index.html";
}

/*--------------------*/

// Função para abrir o modal de histórico de pedidos
function openOrderHistory() {
  const orderHistoryModal = document.getElementById("order-history-modal");
  const orderHistoryElement = document.getElementById("order-history");

  if (orderHistoryModal && orderHistoryElement) {
    orderHistoryModal.style.display = "block";
    loadOrderHistory(); // Função para carregar o histórico de pedidos
  } else {
    console.error("Elementos do modal de histórico de pedidos não encontrados");
  }
}

// Função para fechar o modal de histórico de pedidos
function closeOrderHistory() {
  const orderHistoryModal = document.getElementById("order-history-modal");

  if (orderHistoryModal) {
    orderHistoryModal.style.display = "none";
  } else {
    console.error("Elemento do modal de histórico de pedidos não encontrado");
  }
}

// Função para carregar o histórico de pedidos
// Função para carregar o histórico de pedidos
// Função para carregar o histórico de pedidos
function loadOrderHistory() {
  const orderHistoryElement = document.getElementById("order-history");

  if (orderHistoryElement) {
    const userOrderHistory =
      JSON.parse(localStorage.getItem(`orderHistory_${customerPhone}`)) || [];

    if (userOrderHistory.length === 0) {
      orderHistoryElement.innerHTML = "<p>Você ainda não possui pedidos.</p>";
    } else {
      // Mostrar apenas os três últimos pedidos
      const recentOrders = userOrderHistory.slice(-3).reverse();

      orderHistoryElement.innerHTML = recentOrders
        .map(
          (order) => `
        <div class="order-item">
          <p>Pedido Número: ${order.number}</p>
          <p>Data: ${order.date}</p>
          <p>Total: R$${order.total}</p>
        </div>
      `
        )
        .join("");
    }
  } else {
    console.error("Elemento de histórico de pedidos não encontrado");
  }
}

// Chamar função ao carregar a página
// Chamar função ao carregar a página
window.onload = function () {
  if (isLoggedIn) {
    updateUserInterface(customerName);
  }
  updateCartBadge();
  if (document.body.contains(document.getElementById("produtos"))) {
    renderCatalogo();
  }
  if (document.body.contains(document.getElementById("carrinho-detalhes"))) {
    renderCarrinho();
  }
  // Chamar a função para carregar o histórico de pedidos
  if (document.body.contains(document.getElementById("order-history"))) {
    loadOrderHistory();
  }
};

// Função para obter o próximo número de pedido com zeros à esquerda
function getNextOrderNumber() {
  let lastOrderNumber =
    JSON.parse(localStorage.getItem("lastOrderNumber")) || 0;
  lastOrderNumber += 1;
  localStorage.setItem("lastOrderNumber", lastOrderNumber);
  return lastOrderNumber.toString().padStart(6, "0"); // Formatar com 6 dígitos
}
// Função para abrir o modal de pagamento
function openPaymentModal() {
  const modal = document.getElementById("choose-payment-modal");
  if (modal) {
    modal.style.display = "block";
  } else {
    console.error("Elemento do modal de pagamento não encontrado");
  }
}

// Função para fechar o modal de pagamento
function closePaymentModal() {
  const paymentModal = document.getElementById("payment-modal");
  if (paymentModal) {
    paymentModal.style.display = "none";
  } else {
    console.error("Elemento do modal de pagamento não encontrado");
  }
}

// Função para selecionar o método de pagamento
function selectPaymentMethod(method) {
  closePaymentModal();
  handlePaymentMethod(method);
}

// Função para lidar com o método de pagamento
function handlePaymentMethod(metodoPagamento) {
  const storedCart = JSON.parse(localStorage.getItem("cartItems"));

  if (!storedCart || storedCart.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  const total = storedCart.reduce(
    (sum, item) => sum + item.produto.preco * item.quantidade,
    0
  );

  if (metodoPagamento.toLowerCase() === "dinheiro") {
    const valorPago = parseFloat(
      prompt(`O total é R$${total.toFixed(2)}. Quanto você vai pagar?`)
    );
    if (valorPago >= total) {
      const troco = valorPago - total;
      alert(
        `Total a ser pago: R$${valorPago.toFixed(2)}. Troco: R$${troco.toFixed(
          2
        )}`
      );
    } else {
      alert(
        `O valor pago é insuficiente. Por favor, pague pelo menos R$${total.toFixed(
          2
        )}.`
      );
      return;
    }
  } else if (metodoPagamento.toLowerCase() === "pix") {
    alert(
      `Total a ser pago: R$${total.toFixed(
        2
      )}. Chave Pix do estabelecimento: 123@cupcakegourmet.com`
    );
  } else {
    alert("Método de pagamento inválido.");
    return;
  }

  // Restante da função finalizarCompra permanece a mesma
  // ...
}

// Chame openPaymentModal ao invés de prompt dentro de finalizarCompra
function finalizarCompra() {
  const storedCart = JSON.parse(localStorage.getItem("cartItems"));

  if (!storedCart || storedCart.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  // Abre o modal de pagamento em vez de usar prompt
  openPaymentModal();

  // Restante da função finalizarCompra permanece a mesma
  // ...
}

//----------------------------------------------------------
// Função para abrir o modal de escolha de pagamento
function openChoosePaymentModal() {
  const choosePaymentModal = document.getElementById("choose-payment-modal");
  if (choosePaymentModal) {
    choosePaymentModal.style.display = "block";
  } else {
    console.error("Elemento do modal de escolha de pagamento não encontrado");
  }
}

// Função para fechar o modal de escolha de pagamento
function closeChoosePaymentModal() {
  const choosePaymentModal = document.getElementById("choose-payment-modal");
  if (choosePaymentModal) {
    choosePaymentModal.style.display = "none";
  } else {
    console.error("Elemento do modal de escolha de pagamento não encontrado");
  }
}

// Função para abrir o modal de valor pago em dinheiro
function openDinheiroModal(total) {
  const dinheiroModal = document.getElementById("dinheiro-modal");
  const totalValorElement = document.getElementById("total-valor");
  if (dinheiroModal && totalValorElement) {
    totalValorElement.innerText = total.toFixed(2);
    dinheiroModal.style.display = "block";
  } else {
    console.error("Elementos do modal de valor pago não encontrados");
  }
}

// Função para fechar o modal de valor pago em dinheiro
function closeDinheiroModal() {
  const dinheiroModal = document.getElementById("dinheiro-modal");
  if (dinheiroModal) {
    dinheiroModal.style.display = "none";
  } else {
    console.error("Elemento do modal de valor pago não encontrado");
  }
}

//--------------------------------------------------------------

// Função para abrir o modal de troco
function openTrocoModal(pedidoInfo) {
  const modal = document.getElementById("trocoModal");
  const pedidoInfoElement = document.getElementById("trocoPedidoInfo");

  if (modal && pedidoInfoElement) {
    pedidoInfoElement.textContent = pedidoInfo;
    modal.style.display = "block";
  } else {
    console.error("Elementos do modal de troco não encontrados");
  }
}

// Função para fechar o modal de troco
function closeTrocoModal() {
  const modal = document.getElementById("trocoModal");
  modal.style.display = "none";
}

// Função para confirmar o pedido e zerar o carrinho
function confirmarPedido() {
  const modal = document.getElementById("trocoModal");
  modal.style.display = "none";

  // Lógica para confirmar o pedido e registrar as informações
  console.log("Pedido confirmado!");
  console.log("Carrinho zerado!");
}

// Função para finalizar a compra
function finalizarCompra() {
  const valorPago = parseFloat(document.getElementById("valorPago").value);
  const valorTotalPedido = parseFloat(
    document.getElementById("valorTotalPedido").value
  );

  if (isNaN(valorPago)) {
    alert("Por favor, insira um valor válido.");
    return;
  }

  if (valorPago < valorTotalPedido) {
    openErrorModal(valorTotalPedido);
  } else {
    const troco = valorPago - valorTotalPedido;
    const pedidoInfo = `Total a ser pago: R$${valorTotalPedido.toFixed(
      2
    )}. Troco: R$${troco.toFixed(2)}`;
    openTrocoModal(pedidoInfo);
  }
}

// Função para abrir o modal de erro
function openErrorModal(valorTotalPedido) {
  const modal = document.getElementById("errorModal");
  const errorMessageElement = document.getElementById("errorMessage");

  if (modal && errorMessageElement) {
    errorMessageElement.textContent = `O valor pago é insuficiente. Por favor, pague pelo menos R$${valorTotalPedido.toFixed(
      2
    )}.`;
    modal.style.display = "block";
  } else {
    console.error("Elementos do modal de erro não encontrados");
  }
}

// Função para fechar o modal de erro
function closeErrorModal() {
  const modal = document.getElementById("errorModal");
  modal.style.display = "none";
}

// Adicionar evento ao botão OK do modal de erro
document.getElementById("okButton").addEventListener("click", closeErrorModal);

// Adicionar evento ao botão OK do modal de troco
document
  .getElementById("okTrocoButton")
  .addEventListener("click", confirmarPedido);

// Exemplo de funcionalidade para fechar o modal de erro
document.getElementsByClassName("close")[0].onclick = closeErrorModal;

// Exemplo de funcionalidade para fechar o modal de troco
document.getElementsByClassName("close")[1].onclick = closeTrocoModal;

//--------------------------------

// Função para abrir o modal de Pix
// Função para abrir o modal de Pix
function openPixModal(message) {
  const pixModal = document.getElementById("pix-modal");
  const pixMessage = document.getElementById("pix-message");
  if (pixModal && pixMessage) {
    pixMessage.innerText = message;
    pixModal.style.display = "block";
  } else {
    console.error("Elementos do modal de Pix não encontrados");
  }
}

// Função para fechar o modal de Pix e abrir o modal de pedido finalizado
// Função para fechar o modal de Pix
// Função para fechar o modal de Pix e abrir o modal de pedido finalizado
function closePixModal() {
  const pixModal = document.getElementById("pix-modal");
  if (pixModal) {
    pixModal.style.display = "none";
    // Abrir o modal de pedido finalizado após fechar o de Pix
    openPedidoModal(
      `Compra finalizada com sucesso!\nNúmero do Pedido: ${getCurrentOrderNumber()}\nData e Hora: ${new Date().toLocaleString()}`
    );
    limparCarrinho(); // Limpar o carrinho após a finalização do pedido
  } else {
    console.error("Elemento do modal de Pix não encontrado");
  }
}

// Função para abrir o modal de pedido finalizado
function openPedidoModal(message) {
  const pedidoModal = document.getElementById("pedido-modal");
  const pedidoMessage = document.getElementById("pedido-message");
  if (pedidoModal && pedidoMessage) {
    pedidoMessage.innerText = message;
    pedidoModal.style.display = "block";
  } else {
    console.error("Elementos do modal de pedido finalizado não encontrados");
  }
}

// Função para fechar o modal de pedido finalizado
function closePedidoModal() {
  const pedidoModal = document.getElementById("pedido-modal");
  if (pedidoModal) {
    pedidoModal.style.display = "none";
    window.location.href = "index.html"; // Redireciona para a página inicial após fechar o modal
  } else {
    console.error("Elemento do modal de pedido finalizado não encontrado");
  }
}

// Função para lidar com o método de pagamento
function handlePaymentMethod(metodoPagamento) {
  const storedCart = JSON.parse(localStorage.getItem("cartItems"));

  if (!storedCart || storedCart.length === 0) {
    openAlertModal("Seu carrinho está vazio.");
    return;
  }

  const total = storedCart.reduce(
    (sum, item) => sum + item.produto.preco * item.quantidade,
    0
  );

  if (metodoPagamento.toLowerCase() === "dinheiro") {
    openDinheiroModal(total);
  } else if (metodoPagamento.toLowerCase() === "pix") {
    // Armazenar o pedido antes de mostrar o modal de Pix
    storeOrder(storedCart, total);
    openPixModal(
      `Total a ser pago: R$${total.toFixed(
        2
      )}. Chave Pix do estabelecimento: 123@cupcakegourmet.com`
    );
  } else {
    openErrorModal("Método de pagamento inválido.");
    return;
  }
}

// Função para armazenar o pedido
// Função para armazenar o pedido
function storeOrder(cart, total) {
  const orderNumber = getNextOrderNumber();
  const orderDate = new Date().toLocaleString();

  // Carregar o histórico de pedidos do usuário ou inicializar um novo array
  let userOrderHistory =
    JSON.parse(localStorage.getItem(`orderHistory_${customerPhone}`)) || [];

  // Adicionar o novo pedido ao histórico do usuário
  userOrderHistory.push({
    number: orderNumber,
    date: orderDate,
    total: total.toFixed(2),
    items: cart,
  });

  // Salvar o histórico atualizado no localStorage
  localStorage.setItem(
    `orderHistory_${customerPhone}`,
    JSON.stringify(userOrderHistory)
  );

  // Armazenar o número do pedido atual para exibir no modal de pedido finalizado
  localStorage.setItem("currentOrderNumber", orderNumber);
}

// Função para obter o número do pedido atual
function getCurrentOrderNumber() {
  return localStorage.getItem("currentOrderNumber") || "000000";
}

// Função para abrir o modal de Erro// Função para abrir o modal de Erro
function openErrorModal() {
  const modal = document.getElementById("errorModal");
  modal.style.display = "block";
}

// Função para fechar o modal de Erro
function closeErrorModal() {
  const modal = document.getElementById("errorModal");
  modal.style.display = "none";
}

// Função para finalizar a compra
function finalizarCompra() {
  const valorPago = document.getElementById("valorPago").value;

  if (valorPago < valorMinimo) {
    openErrorModal();
  } else {
    finalizarCompra();
    // Lógica para confirmar o pedido e zerar o carrinho
    console.log("Pedido confirmado!");
    console.log("Carrinho zerado!");
  }
}

// Adicionar evento ao botão OK
document.getElementById("okButton").addEventListener("click", closeErrorModal);

// Exemplo de funcionalidade para fechar o modal
const span = document.getElementsByClassName("close")[0];
span.onclick = closeErrorModal;

// Função para abrir o modal de alerta genérico
function openAlertModal(message) {
  const alertModal = document.getElementById("alert-modal");
  const alertMessage = document.getElementById("alert-message");
  if (alertModal && alertMessage) {
    alertMessage.innerText = message;
    alertModal.style.display = "block";
  } else {
    console.error("Elementos do modal de alerta não encontrados");
  }
}

// Função para finalizar o pedido
function finalizarPedido() {
  const storedCart = JSON.parse(localStorage.getItem("cartItems"));
  const total = storedCart.reduce(
    (sum, item) => sum + item.produto.preco * item.quantidade,
    0
  );

  // Obter o próximo número de pedido
  const orderNumber = getNextOrderNumber();
  const orderDate = new Date().toLocaleString();

  // Carregar o histórico de pedidos do usuário ou inicializar um novo array
  let userOrderHistory =
    JSON.parse(localStorage.getItem(`orderHistory_${customerPhone}`)) || [];

  // Adicionar o novo pedido ao histórico do usuário
  userOrderHistory.push({
    number: orderNumber,
    date: orderDate,
    total: total.toFixed(2),
    items: storedCart,
  });

  // Salvar o histórico atualizado no localStorage
  localStorage.setItem(
    `orderHistory_${customerPhone}`,
    JSON.stringify(userOrderHistory)
  );

  // Exibir modal com os detalhes do pedido
  openPedidoModal(
    `Compra finalizada com sucesso!\nNúmero do Pedido: ${orderNumber}\nData e Hora: ${orderDate}`
  );

  limparCarrinho();
}

// Adicionar evento de clique ao botão "X" do modal de dinheiro
document
  .querySelector("#dinheiro-modal .close")
  .addEventListener("click", closeDinheiroModal);

// Adicionar evento de clique ao botão "X" do modal de Pix
document
  .querySelector("#pix-modal .close")
  .addEventListener("click", closePixModal);

// Adicionar evento de clique ao botão "X" do modal de erro
document
  .querySelector("#errorModal .close")
  .addEventListener("click", closeErrorModal);

// Adicionar evento de clique ao botão "X" do modal de escolha de pagamento
document
  .querySelector("#choose-payment-modal .close")
  .addEventListener("click", closeChoosePaymentModal);

// Finalizar Compra
function finalizarCompra() {
  const storedCart = JSON.parse(localStorage.getItem("cartItems"));

  if (!storedCart || storedCart.length === 0) {
    alert("Seu carrinho está vazio.");
    return;
  }

  // Abre o modal de pagamento em vez de usar prompt
  openChoosePaymentModal();
}
// Selecionar Método de Pagamento
function selectPaymentMethod(method) {
  closeChoosePaymentModal();
  handlePaymentMethod(method);
}

// Lidar com Método de Pagamento

// Função para lidar com o método de pagamento
function handlePaymentMethod(metodoPagamento) {
  const storedCart = JSON.parse(localStorage.getItem("cartItems"));

  if (!storedCart || storedCart.length === 0) {
    openAlertModal("Seu carrinho está vazio.");
    return;
  }

  const total = storedCart.reduce(
    (sum, item) => sum + item.produto.preco * item.quantidade,
    0
  );

  if (metodoPagamento.toLowerCase() === "dinheiro") {
    openDinheiroModal(total);
  } else if (metodoPagamento.toLowerCase() === "pix") {
    // Armazenar o pedido antes de mostrar o modal de Pix
    storeOrder(storedCart, total);
    openPixModal(
      `Total a ser pago: R$${total.toFixed(
        2
      )}. Chave Pix do estabelecimento: 123@cupcakegourmet.com`
    );
  } else {
    openErrorModal("Método de pagamento inválido.");
  }
}

// Confirmar Pagamento em Dinheiro
function confirmDinheiroPayment() {
  const valorPago = parseFloat(document.getElementById("valor-pago").value);
  const total = parseFloat(document.getElementById("total-valor").innerText);

  if (valorPago >= total) {
    const troco = valorPago - total;
    const pedidoInfo = `Total a ser pago: R$${total.toFixed(
      2
    )}. Troco: R$${troco.toFixed(2)}`;

    // Registrar o pedido antes de mostrar o modal de troco
    storeOrder(JSON.parse(localStorage.getItem("cartItems")), total);

    openTrocoModal(pedidoInfo);
    closeDinheiroModal();
  } else {
    openErrorModal(
      `O valor pago é insuficiente. Por favor, pague pelo menos R$${total.toFixed(
        2
      )}.`
    );
  }
}

// Função para armazenar o pedido
function storeOrder(cart, total) {
  const orderNumber = getNextOrderNumber();
  const orderDate = new Date().toLocaleString();

  // Carregar o histórico de pedidos do usuário ou inicializar um novo array
  let userOrderHistory =
    JSON.parse(localStorage.getItem(`orderHistory_${customerPhone}`)) || [];

  // Adicionar o novo pedido ao histórico do usuário
  userOrderHistory.push({
    number: orderNumber,
    date: orderDate,
    total: total.toFixed(2),
    items: cart,
  });

  // Salvar o histórico atualizado no localStorage
  localStorage.setItem(
    `orderHistory_${customerPhone}`,
    JSON.stringify(userOrderHistory)
  );

  // Armazenar o número do pedido atual para exibir no modal de pedido finalizado
  localStorage.setItem("currentOrderNumber", orderNumber);
}

// Função para carregar o histórico de pedidos na página index.html
function loadOrderHistory() {
  const orderHistoryElement = document.getElementById("order-history");

  if (orderHistoryElement) {
    const userOrderHistory =
      JSON.parse(localStorage.getItem(`orderHistory_${customerPhone}`)) || [];

    if (userOrderHistory.length === 0) {
      orderHistoryElement.innerHTML = "<p>Você ainda não possui pedidos.</p>";
    } else {
      // Mostrar apenas os três últimos pedidos
      const recentOrders = userOrderHistory.slice(-3).reverse();

      orderHistoryElement.innerHTML = recentOrders
        .map(
          (order) => `
        <div class="order-item">
          <p>Pedido Número: ${order.number}</p>
          <p>Data: ${order.date}</p>
          <p>Total: R$${order.total}</p>
        </div>
      `
        )
        .join("");
    }
  } else {
    console.error("Elemento de histórico de pedidos não encontrado");
  }
}

// Chamar função ao carregar a página index.html
// Chamar função ao carregar a página index.html
window.onload = function () {
  if (isLoggedIn) {
    updateUserInterface(customerName);
  }
  updateCartBadge();
  if (document.body.contains(document.getElementById("produtos"))) {
    renderCatalogo();
  }
  if (document.body.contains(document.getElementById("carrinho-detalhes"))) {
    renderCarrinho();
  }
  // Chamar a função para carregar o histórico de pedidos
  if (document.body.contains(document.getElementById("order-history"))) {
    loadOrderHistory();
  }
};

// Função para confirmar o pedido e zerar o carrinho
function confirmarPedido() {
  const modal = document.getElementById("trocoModal");
  modal.style.display = "none";

  // Exibir modal de pedido finalizado após confirmação
  const orderNumber = getCurrentOrderNumber();
  openPedidoModal(
    `Compra finalizada com sucesso!\nNúmero do Pedido: ${orderNumber}\nData e Hora: ${new Date().toLocaleString()}`
  );

  // Limpar o carrinho após a finalização do pedido
  limparCarrinho();
  console.log("Pedido confirmado!");
  console.log("Carrinho zerado!");
}

// Função para abrir o modal de troco
function openTrocoModal(pedidoInfo) {
  const modal = document.getElementById("trocoModal");
  const pedidoInfoElement = document.getElementById("trocoPedidoInfo");

  if (modal && pedidoInfoElement) {
    pedidoInfoElement.textContent = pedidoInfo;
    modal.style.display = "block";
  } else {
    console.error("Elementos do modal de troco não encontrados");
  }
}

// Função para abrir o modal de pedido finalizado
function openPedidoModal(message) {
  const pedidoModal = document.getElementById("pedido-modal");
  const pedidoMessage = document.getElementById("pedido-message");
  if (pedidoModal && pedidoMessage) {
    pedidoMessage.innerText = message;
    pedidoModal.style.display = "block";
  } else {
    console.error("Elementos do modal de pedido finalizado não encontrados");
  }
}

// Função para armazenar o pedido (já existente, mas importante revisar)
function storeOrder(cart, total) {
  const orderNumber = getNextOrderNumber();
  const orderDate = new Date().toLocaleString();

  // Carregar o histórico de pedidos do usuário ou inicializar um novo array
  let userOrderHistory =
    JSON.parse(localStorage.getItem(`orderHistory_${customerPhone}`)) || [];

  // Adicionar o novo pedido ao histórico do usuário
  userOrderHistory.push({
    number: orderNumber,
    date: orderDate,
    total: total.toFixed(2),
    items: cart,
  });

  // Salvar o histórico atualizado no localStorage
  localStorage.setItem(
    `orderHistory_${customerPhone}`,
    JSON.stringify(userOrderHistory)
  );

  // Armazenar o número do pedido atual para exibir no modal de pedido finalizado
  localStorage.setItem("currentOrderNumber", orderNumber);
}

// Função para confirmar o pedido e zerar o carrinho
// Função para confirmar o pedido e zerar o carrinho
function confirmarPedido() {
  const modal = document.getElementById("trocoModal");
  modal.style.display = "none";

  // Exibir modal de pedido finalizado após confirmação
  const orderNumber = getCurrentOrderNumber();
  openPedidoModal(
    `Compra finalizada com sucesso!\nNúmero do Pedido: ${orderNumber}\nData e Hora: ${new Date().toLocaleString()}`
  );

  // Limpar o carrinho após a finalização do pedido
  limparCarrinho();
  console.log("Pedido confirmado!");
  console.log("Carrinho zerado!");
}

// Função para abrir o modal de troco
function openTrocoModal(pedidoInfo) {
  const modal = document.getElementById("trocoModal");
  const pedidoInfoElement = document.getElementById("trocoPedidoInfo");

  if (modal && pedidoInfoElement) {
    pedidoInfoElement.textContent = pedidoInfo;
    modal.style.display = "block";
  } else {
    console.error("Elementos do modal de troco não encontrados");
  }
}

// Função para abrir o modal de pedido finalizado
function openPedidoModal(message) {
  const pedidoModal = document.getElementById("pedido-modal");
  const pedidoMessage = document.getElementById("pedido-message");
  if (pedidoModal && pedidoMessage) {
    pedidoMessage.innerText = message;
    pedidoModal.style.display = "block";
  } else {
    console.error("Elementos do modal de pedido finalizado não encontrados");
  }
}

// Função para armazenar o pedido (já existente, mas importante revisar)
// Função para armazenar o pedido
function storeOrder(cart, total) {
  const orderNumber = getNextOrderNumber();
  const orderDate = new Date().toLocaleString();

  // Carregar o histórico de pedidos do usuário ou inicializar um novo array
  let userOrderHistory =
    JSON.parse(localStorage.getItem(`orderHistory_${customerPhone}`)) || [];

  // Adicionar o novo pedido ao histórico do usuário
  userOrderHistory.push({
    number: orderNumber,
    date: orderDate,
    total: total.toFixed(2),
    items: cart,
  });

  // Salvar o histórico atualizado no localStorage
  localStorage.setItem(
    `orderHistory_${customerPhone}`,
    JSON.stringify(userOrderHistory)
  );

  // Armazenar o número do pedido atual para exibir no modal de pedido finalizado
  localStorage.setItem("currentOrderNumber", orderNumber);
}

// Função para confirmar o pedido e zerar o carrinho
function confirmarPedido() {
  const modal = document.getElementById("trocoModal");
  modal.style.display = "none";

  // Exibir modal de pedido finalizado após confirmação
  const orderNumber = getCurrentOrderNumber();
  openPedidoModal(
    `Compra finalizada com sucesso!\nNúmero do Pedido: ${orderNumber}\nData e Hora: ${new Date().toLocaleString()}`
  );

  // Limpar o carrinho após a finalização do pedido
  limparCarrinho();
  console.log("Pedido confirmado!");
  console.log("Carrinho zerado!");
}

// Confirmar Pagamento em Dinheiro
function confirmDinheiroPayment() {
  const valorPago = parseFloat(document.getElementById("valor-pago").value);
  const total = parseFloat(document.getElementById("total-valor").innerText);

  if (valorPago >= total) {
    const troco = valorPago - total;
    const pedidoInfo = `Total a ser pago: R$${total.toFixed(
      2
    )}. Troco: R$${troco.toFixed(2)}`;

    // Registrar o pedido antes de mostrar o modal de troco
    storeOrder(cartItems, total);

    openTrocoModal(pedidoInfo);
    closeDinheiroModal();
  } else {
    openErrorModal(
      `O valor pago é insuficiente. Por favor, pague pelo menos R$${total.toFixed(
        2
      )}.`
    );
  }
}

// Função para abrir o modal de erro
function openErrorModal(errorMessage) {
  const modal = document.getElementById("errorModal");
  const errorMessageElement = document.getElementById("errorMessage");

  if (modal && errorMessageElement) {
    errorMessageElement.textContent = errorMessage;
    modal.style.display = "block";
  } else {
    console.error("Elementos do modal de erro não encontrados");
  }
}

// Suas funções para abrir e fechar modais, por exemplo:
function closeDinheiroModal() {
  const dinheiroModal = document.getElementById("dinheiro-modal");
  if (dinheiroModal) {
    dinheiroModal.style.display = "none";
  } else {
    console.error("Elemento do modal de valor pago não encontrado");
  }
}

// Outras funções...

// Adicionar eventos de clique aos botões "X"
const closeDinheiroButton = document.querySelector("#dinheiro-modal .close");
if (closeDinheiroButton) {
  closeDinheiroButton.addEventListener("click", closeDinheiroModal);
} else {
  console.error("Elemento do botão 'X' do modal de dinheiro não encontrado");
}

const closePixButton = document.querySelector("#pix-modal .close");
if (closePixButton) {
  closePixButton.addEventListener("click", closePixModal);
} else {
  console.error("Elemento do botão 'X' do modal de Pix não encontrado");
}

const closeErrorButton = document.querySelector("#errorModal .close");
if (closeErrorButton) {
  closeErrorButton.addEventListener("click", closeErrorModal);
} else {
  console.error("Elemento do botão 'X' do modal de erro não encontrado");
}

const closeChoosePaymentButton = document.querySelector(
  "#choose-payment-modal .close"
);
if (closeChoosePaymentButton) {
  closeChoosePaymentButton.addEventListener("click", closeChoosePaymentModal);
} else {
  console.error(
    "Elemento do botão 'X' do modal de escolha de pagamento não encontrado"
  );
}

/*----------------------------------------------*/
