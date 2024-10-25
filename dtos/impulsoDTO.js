const impulsoDTO = (impulso) => {
    return {
      id: impulso.id,
      tipo: impulso.tipo,
      descricao: impulso.descricao,
      valor: impulso.valor,
      data_inicio: impulso.data_inicio,
      data_fim: impulso.data_fim,
    };
  };
  
  module.exports = { impulsoDTO };
  