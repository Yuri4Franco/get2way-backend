// dtos/programaDTO.js
const programaDTO = (programa) => {
    return {
      id: programa.id,
      nome: programa.nome,
      descricao: programa.descricao,
      rota_id: programa.rota_id,
    };
  };
  
  module.exports = { programaDTO };
  