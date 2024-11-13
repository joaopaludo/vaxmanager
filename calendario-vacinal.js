
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
}

const FaixasEtarias = {
    recem_nascido: "Ao nascer",
    crianca_2meses: "2 meses",
    crianca_3meses: "3 meses",
    crianca_4meses: "4 meses",
    crianca_5meses: "5 meses",
    crianca_6meses: "6 meses",
    crianca_7meses: "7 meses",
    crianca_9meses: "9 meses",
    crianca_12meses: "12 meses",
    crianca_15meses: "15 meses",
    crianca_4anos: "4 anos",
    crianca_5anos: "5 anos",
    crianca_7anos: "7 anos",

    qualquer_tempo: "A qualquer tempo",
    adolescente_11_a_14_anos: "11 a 14 anos",

    adulto9_a_45_anos: "9 a 45 anos",
    adulto20_a_29_anos: "20 a 29 anos",
    adulto30_a_59_anos: "30 a 59 anos",
    a_partir_dos_18_anos: "A partir dos 18 anos",
    idoso_60_anos_ou_mais: "60 anos ou mais",

    a_qualquer_tempo_no_pre_natal: "A qualquer tempo no pré-natal",
    semana_20_de_gravidez_e_puerperas_ate_45_dias: "20ª semana de gravidez e puérperas até 45 dias"
};

class VacinasAPI {
    constructor() {
        this.dadosVacinas = {};
        this.carregarDados();
    }

    carregarDados() {
        try {
            fs.createReadStream('vacinas_crianca.csv')
                .pipe(csv(['idade', 'nome', 'doses', 'doencas']))
                .on('data', (data) => {
                    if (Object.values(FaixasEtarias).includes(data.idade)) {
                        if (!this.dadosVacinas[data.idade]) {
                            this.dadosVacinas[data.idade] = [];
                        }

                        if (data.nome) {
                            this.dadosVacinas[data.idade].push({
                                nome: data.nome,
                                doses: data.doses || '',
                                doencas: data.doencas || ''
                            });
                        }
                    }
                })
                .on('end', () => {
                    console.log('Dados das vacinas de criança carregados com sucesso');
                })
                .on('error', (error) => {
                    console.error('Erro ao carregar os dados das vacinas de criança:', error);
                });
        } catch (error) {
            console.error('Erro ao carregar os dados das vacinas de criança:', error);
        }

        try {
            fs.createReadStream('vacinas_adolescente.csv')
                .pipe(csv(['idade', 'nome', 'doses', 'doencas']))
                .on('data', (data) => {
                    if (Object.values(FaixasEtarias).includes(data.idade)) {
                        if (!this.dadosVacinas[data.idade]) {
                            this.dadosVacinas[data.idade] = [];
                        }

                        if (data.nome) {
                            this.dadosVacinas[data.idade].push({
                                nome: data.nome,
                                doses: data.doses || '',
                                doencas: data.doencas || ''
                            });
                        }
                    }
                })
                .on('end', () => {
                    console.log('Dados das vacinas de adolescente carregados com sucesso');
                })
                .on('error', (error) => {
                    console.error('Erro ao carregar os dados das vacinas de adolescente:', error);
                });
        } catch (error) {
            console.error('Erro ao carregar os dados das vacinas de adolescente:', error);
        }

        try {
            fs.createReadStream('vacinas_adulto.csv')
                .pipe(csv(['idade', 'nome', 'doses', 'doencas']))
                .on('data', (data) => {
                    if (Object.values(FaixasEtarias).includes(data.idade)) {
                        if (!this.dadosVacinas[data.idade]) {
                            this.dadosVacinas[data.idade] = [];
                        }

                        if (data.nome) {
                            this.dadosVacinas[data.idade].push({
                                nome: data.nome,
                                doses: data.doses || '',
                                doencas: data.doencas || ''
                            });
                        }
                    }
                })
                .on('end', () => {
                    console.log('Dados das vacinas de adulto carregados com sucesso');
                })
                .on('error', (error) => {
                    console.error('Erro ao carregar os dados das vacinas de adulto:', error);
                });
        } catch (error) {
            console.error('Erro ao carregar os dados das vacinas de adulto:', error);
        }

        try {
            fs.createReadStream('vacinas_gestante.csv')
                .pipe(csv(['idade', 'nome', 'doses', 'doencas']))
                .on('data', (data) => {
                    if (Object.values(FaixasEtarias).includes(data.idade)) {
                        if (!this.dadosVacinas[data.idade]) {
                            this.dadosVacinas[data.idade] = [];
                        }

                        if (data.nome) {
                            this.dadosVacinas[data.idade].push({
                                nome: data.nome,
                                doses: data.doses || '',
                                doencas: data.doencas || ''
                            });
                        }
                    }
                })
                .on('end', () => {
                    console.log('Dados das vacinas de adulto carregados com sucesso');
                })
                .on('error', (error) => {
                    console.error('Erro ao carregar os dados das vacinas de adulto:', error);
                });
        } catch (error) {
            console.error('Erro ao carregar os dados das vacinas de adulto:', error);
        }
    }


    setupRotas(app) {
        app.get('/', (req, res) => {
            res.json({ message: "Bem vindo à API do calendario de vacinações" });
        });

        app.get('/faixasEtarias', (req, res) => {
            res.json(Object.values(FaixasEtarias));
        });

        app.get('/estagios', (req, res) => {
            res.json(Object.values(Estagios));
        });

        app.get('/vacinas', (req, res) => {
            res.json(this.dadosVacinas);
        });

        app.get('/vacinas/:faixaEtaria', (req, res) => {
            const { faixaEtaria } = req.params;
            const faixaEtariaDecodificada = decodeURIComponent(faixaEtaria);

            if (!this.dadosVacinas[faixaEtariaDecodificada]) {
                return res.status(404).json({ error: "Faixa etária não encontrada" });
            }

            res.json(this.dadosVacinas[faixaEtariaDecodificada]);
        });
    }
}

const vacinasAPI = new VacinasAPI();
vacinasAPI.setupRotas(app);

app.listen(3000, () => {
    console.log(`Server rodando na porta 3000`);
});

module.exports = app;
