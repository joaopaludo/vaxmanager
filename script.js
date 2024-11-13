const form = document.getElementById('vacinaForm');
const estagioSelect = document.getElementById('estagio');
const idadeInput = document.getElementById('idade');
const idadeLabel = document.getElementById('idadeLabel');
const resultDiv = document.getElementById('result');

let termoIdade = "";

estagioSelect.addEventListener('change', () => {
    switch (estagioSelect.value) {
        case 'crianca':
            idadeLabel.textContent = "Idade (em meses)";
            termoIdade = 'meses';
            break;
        case 'adolescente':
        case 'adulto':
            idadeLabel.textContent = "Idade (em anos)";
            termoIdade = 'anos';
            break;
        case 'gestante':
            idadeLabel.textContent = "Período de gestação (em semanas)";
            termoIdade = 'semanas';
            break;
        default:
            idadeLabel.textContent = "Idade";
    }
});

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const estagio = estagioSelect.value;
    const idade = idadeInput.value;

    if (!estagio || !idade) {
        alert("Por favor, selecione o estágio e informe a idade.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/vacinas/${estagio}/${idade}`);
        const data = await response.json();

        if (response.ok) {
            resultDiv.style.display = "block";
            resultDiv.innerHTML = "<h3>Vacinas encontradas:</h3>";

            if (data.length === 0) {
                resultDiv.innerHTML += "<p>Nenhuma vacina encontrada para o estágio e idade informados.</p>";
            } else {
                data.forEach(vacinaInfo => {
                    resultDiv.innerHTML += `
                        <div class="vacina-info">
                            <strong>${vacinaInfo.idade} ${termoIdade}</strong>
                            ${vacinaInfo.vacinas.map(vacina => `
                                <div class="vacina-item">
                                    <h4>${vacina.nome}</h4>
                                    <p><strong>Doses:</strong> ${vacina.doses}</p>
                                    <p><strong>Doenças:</strong> ${vacina.doencas}</p>
                                </div>
                            `).join('')}
                        </div>`;
                });
            }
        } else {
            resultDiv.style.display = "block";
            resultDiv.innerHTML = `<p>Erro: ${data.error}</p>`;
        }
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        resultDiv.style.display = "block";
        resultDiv.innerHTML = "<p>Erro ao buscar dados da API. Verifique a conexão.</p>";
    }
});