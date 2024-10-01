const { projetoDTO } = require('../dtos/projetoDTO');
const   Projeto = require('../models/projetoModel');
const Programa = require('../models/programaModel');
const Rota = require('../models/rotaModel');

// Tela Inicial da Empresa: Lista de Projetos
const getProjetosByEmpresaId = async (req, res) => {
    const { empresa_id } = req.params;
    try {
        const rotas = await Rota.findAll({
            where: { empresa_id: empresa_id },
            include: [
                {
                    model: Programa,
                    include: [
                        {
                            model: Projeto
                        }
                    ]
                }
            ]
        });
        if (rotas.length === 0) {
            return res.status(404).json({ message: 'Nenhum projeto encontrado para esta empresa.' });
        }

        const projetos = rotas.flatMap(rota =>
            rota.Programas.flatMap(programa => programa.Projetos)
        );
        res.status(200).json(projetos);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar projetos para a empresa.' });
    }
};


 // GET /projetos/programa/:programa_id
const getProjetosByProgramaId = async (req, res) => {
    const { programa_id } = req.params;
    try {
      // Buscar todos os projetos associados ao programa
      const projetos = await Projeto.findAll({
        where: { programa_id: programa_id }
      });
  
      if (projetos.length === 0) {
        return res.status(404).json({ message: 'Nenhum projeto encontrado para este programa.' });
      }
  
      res.status(200).json(projetos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar projetos pelo programa.' });
    }
  };

 // GET /projetos/rota/:rota_id
 const getProjetosByRotaId = async (req, res) => {
  const { rota_id } = req.params;

  try {
    // Buscar todos os programas associados à rota
    const programas = await Programa.findAll({
      where: { rota_id: rota_id }, // Certifica-se de que o programa está relacionado à rota
      include: [
        {
          model: Projeto, // Incluímos os projetos relacionados a cada programa
        },
      ],
    });

    // Verifica se foram encontrados programas relacionados à rota
    if (programas.length === 0) {
      return res.status(404).json({ message: 'Nenhum programa encontrado para esta rota.' });
    }

    // Extrair todos os projetos dos programas
    const projetos = programas.flatMap(programa => programa.Projetos);

    // Verifica se há projetos nos programas
    if (projetos.length === 0) {
      return res.status(404).json({ message: 'Nenhum projeto encontrado para esta rota.' });
    }

    // Retornar os projetos encontrados
    res.status(200).json(projetos);
  } catch (error) {
    console.error('Erro ao buscar projetos pela rota:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos pela rota.' });
  }
};

  // GET /projetos/rota/:rota_id/programa/:programa_id
const getProjetosByRotaAndProgramaId = async (req, res) => {
    const { rota_id, programa_id } = req.params;
    try {
      const programas = await Programa.findAll({
        where: { rota_id: rota_id, id: programa_id },
        include: [
          {
            model: Projeto
          }
        ]
      });
  
      if (programas.length === 0) {
        return res.status(404).json({ message: 'Nenhum projeto encontrado para esta rota e programa.' });
      }
  
      const projetos = programas.flatMap(programa => programa.Projetos);
  
      res.status(200).json(projetos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar projetos pela rota e programa.' });
    }
  };

  // GET /projetos/status/:status
const getProjetosByStatus = async (req, res) => {
    const { status } = req.params;
    try {
      const projetos = await Projeto.findAll({
        where: { status: status }
      });
  
      if (projetos.length === 0) {
        return res.status(404).json({ message: 'Nenhum projeto encontrado com esse status.' });
      }
  
      res.status(200).json(projetos);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar projetos pelo status.' });
    }
  };
  
// GET /projetos/:id
const getProjetoById = async (req, res) => {
    const { id } = req.params;
    try {
        const projeto = await Projeto.findByPk(id);
        if (!projeto) {
            return res.status(404).json({ message: 'Projeto não encontrado.' });
        }

        const projetoData = projetoDTO(projeto);
        res.status(200).json(projetoData);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar o projeto.' });
    }
};

// POST /projetos// POST /projetos
const createProjeto = async (req, res) => {
  try {
      // Verificar o corpo da requisição
      console.log('Request body:', req.body); 

      const {
          nome,
          descricao,
          data_inicio,
          data_fim,
          justificativas,
          status,
          trl,
          acatech,
          objsmart,
          beneficios,
          produto,
          requisitos,
          steakholders,
          equipe,
          premissas,
          grupo_de_entrega,
          restricoes,
          riscos,
          linha_do_tempo,
          custos,
          upload,
          programa_id,
          impulso_id
      } = req.body;

      // Criação do projeto com base nos dados recebidos
      const novoProjeto = await Projeto.create({
          nome,
          descricao,
          data_inicio,
          data_fim,
          justificativas,
          status,
          trl,
          acatech,
          objsmart,
          beneficios,
          produto,
          requisitos,
          steakholders,
          equipe,
          premissas,
          grupo_de_entrega,
          restricoes,
          riscos,
          linha_do_tempo,
          custos,
          upload,
          programa_id,
          impulso_id
      });

      // Retornar o projeto criado
      res.status(201).json(novoProjeto);
  } catch (error) {
      // Captura qualquer erro e envia uma resposta com status 500
      console.error('Erro ao criar o projeto:', error);
      res.status(500).json({ error: 'Erro ao criar o projeto.' });
  }
};

// PUT /projetos/:id
const updateProjeto = async (req, res) => {
    const { id } = req.params;
    const {
        nome,
        descricao,
        data_inicio,
        data_fim,
        justificativas,
        objsmart,
        status,
        trl,
        acatech,
        beneficios,
        produto,
        requisitos,
        steakholders,
        equipe,
        premissas,
        grupo_de_entrega,
        restricoes,
        riscos,
        linha_do_tempo,
        custos,
        upload,
        impulso_id,
        programa_id

    } = req.body;

    try {
        const projeto = await Projeto.findByPk(id);
        if (!projeto) {
            return res.status(404).json({ message: 'Projeto não encontrado.' });
        }

        await projeto.update({
            nome,
            descricao,
            data_inicio,
            data_fim,
            justificativas,
            objsmart,
            status,
            trl,
            acatech,
            beneficios,
            produto,
            requisitos,
            steakholders,
            equipe,
            premissas,
            grupo_de_entrega,
            restricoes,
            riscos,
            linha_do_tempo,
            custos,
            upload,
            programa_id,
            impulso_id
        });

        res.status(200).json(projeto);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar o projeto.' });
    }
};

// DELETE /projetos/:id
const deleteProjeto = async (req, res) => {
    const { id } = req.params;
    try {
        const projeto = await Projeto.findByPk(id);
        if (!projeto) {
            return res.status(404).json({ message: 'Projeto não encontrado.' });
        }
        await projeto.destroy();
        res.status(200).json({ message: 'Projeto deletado com sucesso.' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar o projeto.' });
    }
};

module.exports = {
  getProjetosByEmpresaId,
  getProjetosByProgramaId,
  getProjetosByRotaId,
  getProjetosByRotaAndProgramaId,
  getProjetosByStatus,
  getProjetoById,
  createProjeto,
  updateProjeto,
  deleteProjeto
};

