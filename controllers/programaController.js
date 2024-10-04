const Programa = require('../models').Programa;

// Criar um novo Programa
const CadastrarPrograma = async (req, res) => {
    try {
        const programa = await Programa.create(req.body);
        res.status(201).json(programa);
    } catch (error) {
        console.error('Erro ao criar programa:', error);
        res.status(500).json({ error: `Erro ao criar programa: ${error.message}` });
    }
};

// Buscar todos os Programas
const BuscarTodosProgramas = async (req, res) => {
    try {
        const programas = await Programa.findAll();
        res.status(200).json(programas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar programas' });
    }
};

// Buscar um Programa por ID
const BuscarProgramaPorId = async (req, res) => {
    try {
        const programa = await Programa.findByPk(req.params.id);
        if (programa) {
            res.status(200).json(programa);
        } else {
            res.status(404).json({ error: 'Programa não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar programa' });
    }
};

// Atualizar um Programa
const AtualizarPrograma = async (req, res) => {
    try {
        const { nome, descricao, rota_id } = req.body;
        const programa = await Programa.findByPk(req.params.id);

        if (programa) {
            programa.nome = nome;
            programa.descricao = descricao;
            programa.rota_id = rota_id;
            await programa.save();
            res.status(200).json(programa);
        } else {
            res.status(404).json({ error: 'Programa não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar programa' });
    }
};

// Deletar um Programa
const DeletarPrograma = async (req, res) => {
    try {
        const programa = await Programa.findByPk(req.params.id);
        if (programa) {
            await programa.destroy();
            res.status(200).json({ message: 'Programa deletado com sucesso' });
        } else {
            res.status(404).json({ error: 'Programa não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar programa' });
    }
};

module.exports = {
    CadastrarPrograma,
    BuscarTodosProgramas,
    BuscarProgramaPorId,
    AtualizarPrograma,
    DeletarPrograma,
};
