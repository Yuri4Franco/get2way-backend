const Responsavel = require('../models').Responsavel;
const Empresa = require('../models').Empresa;
const Ict = require('../models').Ict;
const Usuario = require('../models').Usuario;
const { Op } = require('sequelize');  

// Criar um novo Responsavel
const CadastrarResponsavel = async (req, res) => {
    try {
        const responsavel = await Responsavel.create(req.body);
        res.status(201).json(responsavel);
    } catch (error) {
        console.error('Erro ao criar responsável:', error);
        res.status(500).json({ message: `Erro ao criar responsável: ${error.message}` });
    }
};

// Buscar todos os Responsaveis
const BuscarTodosResponsaveis = async (req, res) => {
    try {
        const responsaveis = await Responsavel.findAll();
        res.status(200).json(responsaveis);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar responsáveis' });
    }
};

// Buscar um Responsavel por ID
const BuscarResponsavelPorId = async (req, res) => {
    try {
        const responsavel = await Responsavel.findByPk(req.params.id);
        if (responsavel) {
            res.status(200).json(responsavel);
        } else {
            res.status(404).json({ message: 'Responsável não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar responsável' });
    }
};

// Atualizar um Responsavel
const AtualizarResponsavel = async (req, res) => {
    try {
        const { cargo, empresa_id, ict_id } = req.body;
        const responsavel = await Responsavel.findByPk(req.params.id);

        if (responsavel) {
            responsavel.cargo = cargo;
            responsavel.empresa_id = empresa_id;
            responsavel.ict_id = ict_id;
            await responsavel.save();
            res.status(200).json(responsavel);
        } else {
            res.status(404).json({ message: 'Responsável não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar responsável' });
    }
};

// Deletar um Responsavel
const DeletarResponsavel = async (req, res) => {
    try {
        const responsavel = await Responsavel.findByPk(req.params.id);
        if (responsavel) {
            await responsavel.destroy();
            res.status(200).json({ message: 'Responsável deletado com sucesso' });
        } else {
            res.status(404).json({ message: 'Responsável não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar responsável' });
    }
};


const BuscarResponsavelDinamico = async (req, res) => {
    const { q, empresa_id, ict_id } = req.query; // O termo de busca passado na URL e os filtros
  
    try {
      const whereClause = {};
  
      if (q) {
        whereClause[Op.or] = [
          { '$Usuario.nome$': { [Op.like]: `%${q}%` } },    // Filtra pelo nome do usuário
          { '$Usuario.email$': { [Op.like]: `%${q}%` } },   // Filtra pelo email do usuário
          { '$Usuario.telefone$': { [Op.like]: `%${q}%` } } // Filtra pelo telefone do usuário
        ];
      }
  
      if (empresa_id) {
        whereClause.empresa_id = empresa_id;  // Filtra pela empresa associada
      }
  
      if (ict_id) {
        whereClause.ict_id = ict_id;  // Filtra pela ICT associada
      }
  
      const responsaveis = await Responsavel.findAll({
        where: whereClause,
        include: [
          {
            model: Usuario,
            attributes: ['nome', 'email', 'telefone']
          },
          {
            model: Empresa,
            attributes: ['nome'] // Inclui o nome da empresa se estiver associada
          },
          {
            model: Ict,
            attributes: ['nome'] // Inclui o nome da ICT se estiver associada
          }
        ]
      });
  
      if (responsaveis.length === 0) {
        return res.status(404).json({ message: 'Nenhum responsável encontrado.' });
      }
  
      res.status(200).json(responsaveis);
    } catch (error) {
      console.error('Erro ao buscar responsáveis:', error);
      res.status(500).json({ message: 'Erro ao buscar responsáveis.' });
    }
  };
  

module.exports = {
    CadastrarResponsavel,
    BuscarTodosResponsaveis,
    BuscarResponsavelPorId,
    AtualizarResponsavel,
    DeletarResponsavel,
    BuscarResponsavelDinamico
};
