// dtos/projetoDTO.js

const { programaDTO } = require('./programaDTO'); // Importando o DTO de Programa

// Função para transformar um modelo de Projeto em DTO
const projetoDTO = (projeto) => {
  // Retornamos apenas os campos que são necessários para a resposta
  return {
    id: projeto.id,
    nome: projeto.nome,
    descricao: projeto.descricao,
    tlr: projeto.trl,
    acatech: projeto.acatech,
    data_inicio: projeto.data_inicio,
    data_fim: projeto.data_fim,
    justificativas: projeto.justificativas,
    objsmart: projeto.objsmart,
    beneficios: projeto.beneficios,
    produto: projeto.produto,
    requisitos: projeto.requisitos,
    steakholders: projeto.steakholders,
    equipe: projeto.equipe,
    premissas: projeto.premissas,
    grupo_de_entrega: projeto.grupo_de_entrega,
    restricoes: projeto.restricoes,
    riscos: projeto.riscos,
    linha_do_tempo: projeto.linha_do_tempo,
    custos: projeto.custos,
    upload: projeto.upload,
    status: projeto.status,

    // Relacionamentos controlados (evitando referências cíclicas)
    programa: projeto.Programa ? programaDTO(projeto.Programa) : null,  // Inclui o DTO de Programa se disponível
  };
};

module.exports = { projetoDTO };
