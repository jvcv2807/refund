// Seleciona os elementos do formulário.
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

// Seleciona os elementos da lista.
const expenseList = document.querySelector("ul")
const expensesQuantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

// Captura o evento de input para formatar o valor.
amount.oninput = () => {
  // Obtém o valor do campo e remove todos os caracteres que não são dígitos.
  let value = amount.value.replace(/\D/g, "")

  // Transforma o valor em centavos.
  value = Number(value) / 100

  // Atualiza o valor do campo com o valor formatado.
  amount.value = formatCurrencyBRL(value) 
}

function formatCurrencyBRL(value){
  // Converte o valor para um número e formata como moeda brasileira.
  value = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  // Retorna o valor formatado.
  return value;
}

// Captura o evento de envio do formulário.
form.onsubmit = (event) => {
  // Previne o comportamento padrão do formulário, que é recarregar a página.
  event.preventDefault()

  // Cria um objeto com os dados da nova despesa.
  const newExpense = {
    id: new Date().getTime(),
    amount: amount.value,
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    created_at: new Date(),
  }

  // Chama a função para adicionar a nova despesa à lista de despesas.
  expenseAdd(newExpense)
}

// Adiciona uma nova despesa à lista de despesas.
function expenseAdd(newExpense) {
  try {
    // Cria o elemento de li para adicionar a nova despesa à lista.
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")

    //Cria o ícone de categoria da despesa.
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", newExpense.category_name)

    // Cria a info da despesa.
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")
    
    // Cria o nome da despesa.
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    // Cria a categoria da despesa.
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    // Adiciona name e category em expenseInfo.
    expenseInfo.append(expenseName, expenseCategory)

    // Valor da despesa.
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.innerHTML = `<small>R$</small> ${newExpense.amount.toUpperCase().replace("R$", "")}`

    // Cria o botão de remover despesa.
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "img/remove.svg")
    removeIcon.setAttribute("alt", "Remover")

    // Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon)

    //Adiciona o item na li.
    expenseList.append(expenseItem)

  // Limpa o formulário.
    formClear()

    // Atualiza os totais de despesas.
    updateTotals()
  }catch (error) {
    alert("Não foi possível atualizar a lista de despesas.")
    console.log(error)
  }
}  

// Atualiza os totais de despesas.
function updateTotals() {
try {
  // Recupera todos os elementos de despesa da lista.
  const items = expenseList.children

  // Atualiza a quantidade de despesas.
  expensesQuantity.textContent = `${items.length} ${items.length > 1 ? "despesas" : "despesa"}`

  // Variável para armazenar o total de despesas.
  let total = 0

  // percorre todos os elementos de despesa para calcular o total.
  for (let i = 0; i < items.length; i++) {
    const itemAmount = items[i].querySelector(".expense-amount")

    //remove todos os caracteres que não são dígitos e substitui a vírgula por ponto para poder converter para float.
    let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

    // Converte o valor para float e adiciona ao total.
    value = parseFloat(value)

    // Verificar se o valor é um número válido antes de adicionar ao total
    if (isNaN(value)) {
      return alert("O valor da despesa não é um número válido.")
  }

  // Incrementa o total com o valor da despesa.
  total += Number(value)
}

  // Criar a span para exibir o total de despesas.
  const symbolBRL = document.createElement("small")
  symbolBRL.textContent = "R$"

  // Formata o total de despesas como moeda brasileira e atualiza o elemento de total de despesas.
  total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

  // Limpa o conteúdo do elemento de total de despesas antes de adicionar o novo valor.
  expensesTotal.innerHTML = ""

  // Adiciona o símbolo de moeda e o total de despesas ao elemento de total de despesas.
  expensesTotal.append(symbolBRL, total)

  }catch (error) {
    console.log(error)
    alert("Não foi possível atualizar os totais de despesas.") 
    }
}

// Captura o evento de clique na lista de despesas para remover uma despesa.
expenseList.addEventListener("click", function (event) {
  // Verifica se o elemento clicado é o ícone de remover.
  if (event.target.classList.contains("remove-icon")) {
    // Obtém o elemento pai do ícone de remover (que é o item da despesa) e remove-o da lista.
    const item = event.target.closest(".expense")

    // Remove o item da lista de despesas.
    item.remove()

    // Atualiza os totais de despesas.
    updateTotals()
  }   
})


function formClear() {
  //limpa os campos do formulário.
  expense.value = ""
  category.value = ""
  amount.value = ""

  // Coloca o foco no campo de despesa.
  expense.focus()
}