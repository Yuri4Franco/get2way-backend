const { projetoDTO } = require('../dtos/projetoDTO');
const Projeto = require('../models').Projeto;
const Programa = require('../models').Programa;
const Rota = require('../models').Rota;
const Keyword = require('../models').Keyword;
const ProjetoKeyword = require('../models').ProjetoKeyword;


// Filtro de projetos por programas (aplica segurança)
const getProjetosByProgramaId = async (req, res) => {
  const { programa_id } = req.params;
  const usuarioLogado = req.user;

  console.log('Buscando projetos para o programa ID:', programa_id);
  console.log('Usuário logado:', usuarioLogado);

  try {
    // Verifica se é admin
    if (usuarioLogado.tipo === 'admin') {
      console.log('Usuário é admin, buscando todos os projetos para o programa');
      const projetos = await Projeto.findAll({ where: { programa_id } });
      console.log('Projetos encontrados:', projetos.length);
      return res.status(200).json(projetos);
    }

    // Verifica se é empresa e filtra apenas projetos dela
    console.log('Usuário é empresa, verificando programas associados à empresa');
    
    const programas = await Programa.findAll({
      where: { id: programa_id },
      include: {
        model: Projeto, // Incluindo os projetos associados
        include: {
          model: Programa, // O programa associado ao projeto
          include: {
            model: Rota, // Incluindo a Rota associada ao programa
            as: 'Rota',
            where: { empresa_id: usuarioLogado.empresa_id } // Filtro pela empresa do usuário logado
          }
        }
      }
    });

    const projetos = programas.flatMap(programa => programa.Projetos);

    if (projetos.length === 0) {
      console.log('Nenhum projeto encontrado para o programa ID:', programa_id);
      return res.status(404).json({ message: 'Nenhum projeto encontrado para este programa.' });
    }

    console.log('Projetos encontrados:', projetos.length);
    res.status(200).json(projetos);
  } catch (error) {
    console.error('Erro ao buscar projetos pelo programa:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos pelo programa.' });
  }
};

// Filtro de projetos por rotas (aplica segurança)
const getProjetosByRotaId = async (req, res) => {
  const { rota_id } = req.params;
  const usuarioLogado = req.user;

  console.log('Buscando projetos para a rota ID:', rota_id);
  console.log('Usuário logado:', usuarioLogado);

  try {
    // Buscar a rota pelo ID
    const rota = await Rota.findByPk(rota_id);

    if (!rota) {
      console.log('Rota ID:', rota_id, 'não encontrada');
      return res.status(404).json({ message: 'Rota não encontrada.' });
    }

    console.log('Rota encontrada:', rota);

    // Verificar se o usuário tem permissão para acessar a rota
    if (usuarioLogado.tipo !== 'admin' && rota.empresa_id !== usuarioLogado.empresa_id) {
      console.log('Acesso negado para o usuário:', usuarioLogado.email, 'na rota ID:', rota_id);
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Buscar programas associados à rota e incluir projetos
    console.log('Buscando programas associados à rota ID:', rota_id);
    const programas = await Programa.findAll({
      where: { rota_id },
      include: { model: Projeto }
    });

    console.log('Programas encontrados:', programas.length);

    // Extrair os projetos dos programas
    const projetos = programas.flatMap(programa => programa.Projetos);

    if (projetos.length === 0) {
      console.log('Nenhum projeto encontrado para a rota ID:', rota_id);
      return res.status(404).json({ message: 'Nenhum projeto encontrado para esta rota.' });
    }

    console.log('Projetos encontrados:', projetos.length);
    res.status(200).json(projetos);
  } catch (error) {
    console.error('Erro ao buscar projetos pela rota:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos pela rota.' });
  }
};

const getProjetosByPrioridade = async (req, res) => {
  const { prioridade } = req.params; // Captura a prioridade dos parâmetros da requisição
  const usuarioLogado = req.user; // Obtém o usuário logado

  try {
    let projetos;

    // Verifica se o usuário é administrador
    if (usuarioLogado.tipo === 'admin') {
      // Admin pode ver todos os projetos pela prioridade
      projetos = await Projeto.findAll({
        where: { prioridade } // Filtra pela prioridade
      });
    } else {
      console.log('Usuário é empresa, buscando projetos associados à empresa do usuário');

      // Busca os programas associados às rotas da empresa e, por sua vez, aos projetos
      const programas = await Programa.findAll({
        include: [
          {
            model: Rota,
            as: 'Rota', // Usa o alias correto para Rota no Programa
            where: { empresa_id: usuarioLogado.empresa_id }, // Filtra pela empresa
          },
          {
            model: Projeto,
            as: 'Projetos', // Usa o alias correto para Projetos no Programa
            where: { prioridade } // Filtro pelo status do projeto
          }
        ]
      });

      console.log('Programas encontrados:', programas.length);
      projetos = programas.flatMap(programa => programa.Projetos); // Extrai os projetos associados aos programas
    }

    // Verifica se algum projeto foi encontrado
    if (projetos.length === 0) {
      return res.status(404).json({ message: 'Nenhum projeto encontrado com essa prioridade.' });
    }

    // Retorna os projetos encontrados
    res.status(200).json(projetos);
  } catch (error) {
    console.error('Erro ao buscar projetos pela prioridade:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos pela prioridade.' });
  }
};


// Filtro de projeto por status (aplica segurança)
const getProjetosByStatus = async (req, res) => {
  const { status } = req.params;
  const usuarioLogado = req.user;

  console.log('Buscando projetos com status:', status);
  console.log('Usuário logado:', usuarioLogado);

  try {
    let projetos;
    
    if (usuarioLogado.tipo === 'admin') {
      console.log('Usuário é admin, buscando todos os projetos com status:', status);
      projetos = await Projeto.findAll({ where: { status } });
    } else {
      console.log('Usuário é empresa, buscando projetos associados à empresa do usuário');

      // Busca os programas associados às rotas da empresa e, por sua vez, aos projetos
      const programas = await Programa.findAll({
        include: [
          {
            model: Rota,
            as: 'Rota', // Usa o alias correto para Rota no Programa
            where: { empresa_id: usuarioLogado.empresa_id }, // Filtra pela empresa
          },
          {
            model: Projeto,
            as: 'Projetos', // Usa o alias correto para Projetos no Programa
            where: { status } // Filtro pelo status do projeto
          }
        ]
      });

      console.log('Programas encontrados:', programas.length);
      projetos = programas.flatMap(programa => programa.Projetos); // Extrai os projetos associados aos programas
    }

    if (projetos.length === 0) {
      console.log('Nenhum projeto encontrado com o status:', status);
      return res.status(404).json({ message: 'Nenhum projeto encontrado com esse status.' });
    }

    console.log('Projetos encontrados com status', status, ':', projetos.length);
    res.status(200).json(projetos);
  } catch (error) {
    console.error('Erro ao buscar projetos pelo status:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos pelo status.' });
  }
};


// Filtro de projeto por keyword (aplica segurança)
const getProjetosByKeyword = async (req, res) => {
  const { keyword } = req.params;
  const usuarioLogado = req.user;

  console.log(`Buscando projetos pela keyword: ${keyword}`);
  console.log('Usuário logado:', usuarioLogado);

  try {
    let projetos;

    if (usuarioLogado.tipo === 'admin') {
      console.log('Usuário é admin, buscando todos os projetos pela keyword');

      // Busca diretamente os projetos associados à keyword
      projetos = await Projeto.findAll({
        include: [
          {
            model: Keyword,
            as: 'keywords', // Certifique-se de usar o alias 'keywords'
            where: { nome: keyword }
          }
        ]
      });
    } else {
      console.log('Usuário é empresa, buscando projetos associados à empresa do usuário');

      // Buscar programas associados à empresa, incluindo as rotas e os projetos relacionados
      const programas = await Programa.findAll({
        include: [
          {
            model: Rota,
            as: 'Rota', // Usa o alias 'Rota'
            where: { empresa_id: usuarioLogado.empresa_id }
          },
          {
            model: Projeto,
            as: 'Projetos', // Usa o alias 'Projetos' na associação
            include: [
              {
                model: Keyword,
                as: 'keywords', // Usa o alias 'keywords' na associação
                where: { nome: keyword }
              }
            ]
          }
        ]
      });

      console.log(`Programas encontrados para a empresa: ${JSON.stringify(programas, null, 2)}`);

      // Extrair os projetos associados aos programas
      projetos = programas.flatMap(programa => programa.Projetos);
    }

    if (projetos.length === 0) {
      console.log('Nenhum projeto encontrado com essa keyword.');
      return res.status(404).json({ message: 'Nenhum projeto encontrado com essa keyword.' });
    }

    console.log('Projetos encontrados:', projetos);
    res.status(200).json(projetos);
  } catch (error) {
    console.error('Erro ao buscar projetos pela keyword:', error);
    res.status(500).json({ error: 'Erro ao buscar projetos pela keyword.' });
  }
};


// Selecionar o projeto (aplica segurança)
const getProjetoById = async (req, res) => {
  const { id } = req.params;
  const usuarioLogado = req.user;

  try {
    const projeto = await Projeto.findByPk(id, {
      include: {
        model: Programa,
        include: { model: Rota, as: 'Rota' } // Usa o alias 'Rota'
      }
    });

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado.' });
    }

    if (usuarioLogado.tipo !== 'admin' && projeto.Programa.Rota.empresa_id !== usuarioLogado.empresa_id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    const projetoData = projetoDTO(projeto);
    res.status(200).json(projetoData);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o projeto.' });
  }
};

// Cadastrar um projeto (aplica segurança)
const createProjeto = async (req, res) => {
  const usuarioLogado = req.user;
  let { programa_id, keywords } = req.body; // Incluímos 'keywords' no corpo da requisição

  try {
    console.log('Verificando programa com ID:', programa_id);

    const programa = await Programa.findByPk(programa_id, {
      include: { model: Rota, as: 'Rota' }
    });

    if (!programa) {
      return res.status(404).json({ message: 'Programa não encontrado.' });
    }

    console.log('Programa encontrado:', programa);

    if (usuarioLogado.tipo !== 'admin' && programa.Rota.empresa_id !== usuarioLogado.empresa_id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    // Criar o projeto
    console.log('Criando novo projeto com os dados:', req.body);
    const novoProjeto = await Projeto.create(req.body);

    console.log('Novo projeto criado com ID:', novoProjeto.id);

    // Verifica se 'keywords' é uma string e divide as palavras-chave se necessário
    if (typeof keywords === 'string') {
      keywords = keywords.split(',').map(kw => kw.trim()); // Divida por vírgulas e remova espaços extras
    }

    // Se houver keywords no corpo da requisição, associá-las ao projeto
    if (keywords && keywords.length > 0) {
      console.log('Associando keywords:', keywords);

      for (const keywordNome of keywords) {
        console.log('Processando keyword:', keywordNome);

        // Verifica se a keyword já existe
        let keyword = await Keyword.findOne({ where: { nome: keywordNome } });

        // Se a keyword não existir, cria uma nova
        if (!keyword) {
          console.log(`Keyword não encontrada, criando nova keyword: ${keywordNome}`);
          keyword = await Keyword.create({ nome: keywordNome });
        } else {
          console.log(`Keyword encontrada: ${keywordNome}`);
        }

        // Associa a keyword ao projeto
        console.log(`Associando keyword ${keyword.id} ao projeto ${novoProjeto.id}`);
        await ProjetoKeyword.create({
          projeto_id: novoProjeto.id,
          keyword_id: keyword.id
        });
      }
    }

    res.status(201).json(novoProjeto);
  } catch (error) {
    console.error('Erro ao criar o projeto:', error);
    res.status(500).json({ error: 'Erro ao criar o projeto.' });
  }
};

// Atualizar um projeto (aplica segurança)
const updateProjeto = async (req, res) => {
  const { id } = req.params;
  const usuarioLogado = req.user;

  try {
    const projeto = await Projeto.findByPk(id, {
      include: {
        model: Programa,
        include: { model: Rota, as: 'Rota' } // Usa o alias 'Rota'
      }
    });

    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado.' });
    }

    if (usuarioLogado.tipo !== 'admin' && projeto.Programa.Rota.empresa_id !== usuarioLogado.empresa_id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    await projeto.update(req.body);
    res.status(200).json(projeto);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o projeto.' });
  }
};


// Deletar um projeto (aplica segurança)
const deleteProjeto = async (req, res) => {
  const { id } = req.params;
  const usuarioLogado = req.user;

  try {
    // Buscar o projeto com a associação completa: Projeto -> Programa -> Rota
    const projeto = await Projeto.findByPk(id, {
      include: {
        model: Programa,
        include: {
          model: Rota,
          as: 'Rota'
        }
      }
    });

    // Verifica se o projeto existe
    if (!projeto) {
      return res.status(404).json({ message: 'Projeto não encontrado.' });
    }

    // Verifica se o usuário tem permissão para deletar o projeto
    if (usuarioLogado.tipo !== 'admin' && projeto.Programa.Rota.empresa_id !== usuarioLogado.empresa_id) {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para deletar este projeto.' });
    }

    // Deletar o projeto
    await projeto.destroy();
    res.status(200).json({ message: 'Projeto deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error); // Log do erro para depuração
    res.status(500).json({ error: 'Erro ao deletar o projeto.' });
  }
};

// Listar todos projetos
const ListarTodosProjetos = async (req, res) => {
  const usuarioLogado = req.user;

  try {
    console.log('Usuário logado:', usuarioLogado); // Log do usuário logado

    if (usuarioLogado.tipo === 'admin') {
      console.log('Usuário é admin, buscando todos os projetos...');
      const projetos = await Projeto.findAll();
      console.log('Projetos encontrados:', projetos); // Log dos projetos encontrados
      return res.status(200).json(projetos);
    }

    console.log('Usuário não é admin, buscando projetos associados à empresa do usuário...');
    
    const rotas = await Rota.findAll({
      where: { empresa_id: usuarioLogado.empresa_id },
      include: {
        model: Programa,
        include: { model: Projeto }
      }
    });

    console.log('Rotas encontradas:', rotas); // Log das rotas encontradas

    // Extraímos todos os programas associados às rotas
    const programas = rotas.flatMap(rota => rota.Programas);
    
    // Extraímos todos os projetos associados aos programas
    const projetos = programas.flatMap(programa => programa.Projetos);

    if (projetos.length === 0) {
      return res.status(404).json({ message: 'Nenhum projeto encontrado para esta empresa.' });
    }

    console.log('Projetos associados à empresa:', projetos); // Log dos projetos associados
    res.status(200).json(projetos);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error); // Log detalhado do erro
    res.status(500).json({ error: 'Erro ao buscar projetos.' });
  }
};

module.exports = {
  getProjetosByProgramaId,
  getProjetosByRotaId,
  getProjetosByStatus,
  getProjetosByKeyword,
  getProjetoById,
  createProjeto,
  updateProjeto,
  deleteProjeto,
  ListarTodosProjetos,
  getProjetosByPrioridade 
};
