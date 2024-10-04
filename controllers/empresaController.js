const Empresa = require('../models').Empresa;

const cadastrarEmpresa = async (req, res) => {
    const { nome, cnpj, razao_social, endereco, area, telefone, email, site, foto_perfil } = req.body;
    try {
        const novaEmpresa = await Empresa.create({
            nome,
            cnpj,
            razao_social,
            endereco,
            area,
            telefone,
            email,
            site,
            foto_perfil
        });
        res.status(201).json(novaEmpresa);
    } catch (error) {
        console.error('Erro ao cadastrar empresa:', error);
        res.status(500).json({ error: 'Erro ao cadastrar a empresa.' });
    }
};

const atualizarEmpresa = async (req, res) => {
    const { id } = req.params;
    const { nome, cnpj, razao_social, endereco, area, telefone, email, site, foto_perfil } = req.body;

    try {
        const empresa = await Empresa.findByPk(id);
        if (!empresa) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }

        await empresa.update({
            nome,
            cnpj,
            razao_social,
            endereco,
            area,
            telefone,
            email,
            site,
            foto_perfil
        });

        res.status(200).json(empresa);
    } catch (error) {
        console.error('Erro ao atualizar empresa:', error);
        res.status(500).json({ error: 'Erro ao atualizar a empresa.' });
    }
};

const deletarEmpresa = async (req, res) => {
    const { id } = req.params;

    try {
        const empresa = await Empresa.findByPk(id);
        if (!empresa) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }

        await empresa.destroy();
        res.status(200).json({ message: 'Empresa deletada com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar empresa:', error);
        res.status(500).json({ error: 'Erro ao deletar a empresa.' });
    }
};

const consultarEmpresaPorId = async (req, res) => {
    const { id } = req.params;

    try {
        const empresa = await Empresa.findByPk(id);
        if (!empresa) {
            return res.status(404).json({ message: 'Empresa não encontrada.' });
        }

        res.status(200).json(empresa);
    } catch (error) {
        console.error('Erro ao consultar empresa:', error);
        res.status(500).json({ error: 'Erro ao consultar a empresa.' });
    }
};

const consultarTodasEmpresas = async (req, res) => {
    try {
        const empresas = await Empresa.findAll();
        res.status(200).json(empresas);
    } catch (error) {
        console.error('Erro ao consultar empresas:', error);
        res.status(500).json({ error: 'Erro ao consultar as empresas.' });
    }
};

module.exports = {
    cadastrarEmpresa,
    atualizarEmpresa,
    deletarEmpresa,
    consultarEmpresaPorId,
    consultarTodasEmpresas
}