const CadastrarUsuario = async (req, res) => {
    const { nome, email, senha, tipo, edereco, telefone} = req.body;
    try {
        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha,
            tipo,
            primeiro_acesso: true,
            edereco,
            telefone
        });
        res.status(201).json(novoUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao cadastrar o usuário.' });
    }
}