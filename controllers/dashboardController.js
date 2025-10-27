const express = require('express');
const router = express.Router();
const { sequelize } = require('../models');
require("dotenv").config();

const GetData = async (req, res) => {
  const user = req.user;

  if (user.tipo !== "admin") {
    return res.status(403).json({ message: "Acesso negado." });
  }

  try {
    // 1. Total de projetos
    const [totalProjetos] = await sequelize.query(
      "SELECT COUNT(*) as total FROM projetos"
    );

    // 2. Organizações ativas (empresas + ICTs)
    const [totalOrganizacoes] = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM empresas) + 
        (SELECT COUNT(*) FROM icts) as total
    `);

    // 3. Parcerias criadas
    const [totalParcerias] = await sequelize.query(
      "SELECT COUNT(*) as total FROM parcerias"
    );

    // 4. Visualizações no mês atual
    const [visualizacoesMes] = await sequelize.query(`
      SELECT COUNT(*) as total 
      FROM project_views 
      WHERE MONTH(CONVERT_TZ(viewed_at, '+00:00', '-03:00')) = MONTH(CONVERT_TZ(NOW(), '+00:00', '-03:00'))
      AND YEAR(CONVERT_TZ(viewed_at, '+00:00', '-03:00')) = YEAR(CONVERT_TZ(NOW(), '+00:00', '-03:00'))
    `);

    // 5. Visualizações por dia da semana (última semana)
    const [viewsByWeekday] = await sequelize.query(`
      SELECT 
        DAYOFWEEK(CONVERT_TZ(viewed_at, '+00:00', '-03:00')) as day_of_week,
        COUNT(*) as views
      FROM project_views
      WHERE CONVERT_TZ(viewed_at, '+00:00', '-03:00') >= DATE_SUB(CONVERT_TZ(NOW(), '+00:00', '-03:00'), INTERVAL 7 DAY)
      GROUP BY DAYOFWEEK(CONVERT_TZ(viewed_at, '+00:00', '-03:00'))
      ORDER BY DAYOFWEEK(CONVERT_TZ(viewed_at, '+00:00', '-03:00'))
    `);

    // Mapear dias da semana (MySQL: 1=Dom, 2=Seg, 3=Ter...)
    const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const projectViews = diasSemana.map((dia, index) => {
      const found = viewsByWeekday.find((v) => v.day_of_week === index + 1);
      return {
        day: dia,
        views: found ? parseInt(found.views) : 0,
      };
    });

    // 6. Top 5 projetos por quantidade de propostas (interesses)
    const [topProjetos] = await sequelize.query(`
      SELECT 
        p.nome as name,
        COUNT(i.id) as proposals
      FROM projetos p
      INNER JOIN ofertas o ON o.projeto_id = p.id
      INNER JOIN interesses i ON i.oferta_id = o.id
      WHERE MONTH(CONVERT_TZ(i.createdAt, '+00:00', '-03:00')) = MONTH(CONVERT_TZ(NOW(), '+00:00', '-03:00'))
      AND YEAR(CONVERT_TZ(i.createdAt, '+00:00', '-03:00')) = YEAR(CONVERT_TZ(NOW(), '+00:00', '-03:00'))
      GROUP BY p.id, p.nome
      ORDER BY proposals DESC
      LIMIT 5
    `);

    const topProjects = topProjetos.map((p) => ({
      name: p.name,
      proposals: parseInt(p.proposals),
    }));

    // Retornar dados no formato esperado pelo frontend
    res.json({
      cards: {
        totalProjetos: totalProjetos[0].total,
        organizacoesAtivas: totalOrganizacoes[0].total,
        parceriasCriadas: totalParcerias[0].total,
        visualizacoesMes: visualizacoesMes[0].total,
      },
      charts: {
        projectViews,
        topProjects,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    res.status(500).json({
      message: "Erro ao buscar dados do dashboard",
    });
  }
};

module.exports = {
  GetData,
};
