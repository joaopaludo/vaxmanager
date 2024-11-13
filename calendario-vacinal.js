const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const Estagios = {
    crianca: "crianca",
    adolescente: "adolescente",
    adulto: "adulto",
    gestante: "gestante"
};

class VacinasAPI {
    constructor() {
        this.dadosVacinas = {};
        this.carregarDados();
    }

    carregarDados() {
        const carregarDadosPorEstagio = (arquivo, estagio) => {
            fs.createReadStream(arquivo)
                .pipe(csv(['idade', 'nome', 'doses', 'doencas']))
                .on('data', (data) => {
                    if (!this.dadosVacinas[estagio]) {
                        this.dadosVacinas[estagio] = {};
                    }
                    if (!this.dadosVacinas[estagio][data.idade]) {
                        this.dadosVacinas[estagio][data.idade] = [];
                    }

                    if (data.nome) {
                        this.dadosVacinas[estagio][data.idade].push({
                            nome: data.nome,
                            doses: data.doses || '',
                            doencas: data.doencas || ''
                        });
                    }
                })
                .on('end', () => {
                    console.log(`Dados das vacinas de ${estagio} carregados com sucesso`);
                })
                .on('error', (error) => {
                    console.error(`Erro ao carregar os dados das vacinas de ${estagio}:`, error);
                });
        };

        carregarDadosPorEstagio('vacinas_crianca.csv', Estagios.crianca);
        carregarDadosPorEstagio('vacinas_adolescente.csv', Estagios.adolescente);
        carregarDadosPorEstagio('vacinas_adulto.csv', Estagios.adulto);
        carregarDadosPorEstagio('vacinas_gestante.csv', Estagios.gestante);
    }

    setupRotas(app) {
        app.get('/', (req, res) => {
            res.json({ message: "Bem vindo à API do calendario de vacinações" });
        });

        app.get('/estagios', (req, res) => {
            res.json(Object.values(Estagios));
        });

        app.get('/vacinas', (req, res) => {
            res.json(this.dadosVacinas);
        });

        app.get('/vacinas/:estagio/:idade', (req, res) => {
            const { estagio, idade } = req.params;

            if (!Estagios[estagio]) {
                return res.status(400).json({ error: "Estágio inválido" });
            }

            if (!this.dadosVacinas[estagio]) {
                return res.status(404).json({ error: "Nenhuma vacina encontrada para esse estágio e idade" });
            }

            const idadesBuscar = Object.keys(this.dadosVacinas[estagio])
                .map(Number)
                .filter(age => age >= parseInt(idade));

            const response = [];

            idadesBuscar.forEach(age => {
                if (this.dadosVacinas[estagio]?.[age]) {
                    response.push({ idade: age, vacinas: this.dadosVacinas[estagio]?.[age] });
                }
            });

            res.json(response);
        });
    }
}

const vacinasAPI = new VacinasAPI();
vacinasAPI.setupRotas(app);

app.listen(3000, () => {
    console.log(`Server rodando na porta 3000`);
});

module.exports = app;
