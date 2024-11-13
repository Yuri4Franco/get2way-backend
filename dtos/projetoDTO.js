const { programaDTO } = require('./programaDTO');
const projetoDTO = (projeto) => {
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

    programa: projeto.Programa ? programaDTO(projeto.Programa) : null,
  };
};

module.exports = { projetoDTO };
