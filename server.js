const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const CHAVE_SECRETA_JWT = "textosecretodemargemdecostura";

// Banco de dados temporário na memória do servidor (para a planilha)
let planilhaClientesRemota = [];

console.log("👗 Servidor do Assistente de Costura Iniciando...");

// 1. ROTA DE LOGIN (Autenticação Simples exigida pelo professor)
app.post('/api/login', (req, res) => {
    const { usuario, senha } = req.body;

    // Login predefinido simples para o teste do trabalho
    if (usuario === "costureira@pro.com" && senha === "123456") {
        // Gera o Token de acesso que expira em 1 hora
        const token = jwt.sign({ user: usuario }, CHAVE_SECRETA_JWT, { expiresIn: '1h' });
        return res.json({ autenticado: true, token: token });
    }

    return res.status(401).json({ autenticado: false, mensagem: "Usuário ou senha incorretos!" });
});

// 2. MIDDLEWARE: A 'Portaria' do Servidor (Verifica se o celular mandou o Token válido)
function verificarToken(req, res, next) {
    const tokenHeader = req.headers['authorization'];
    
    if (!tokenHeader) return res.status(403).json({ mensagem: "Acesso negado. Token faltando!" });

    // Remove a palavra 'Bearer ' que o Android costuma enviar junto
    const token = tokenHeader.split(' ')[1];

    jwt.verify(token, CHAVE_SECRETA_JWT, (err, decoded) => {
        if (err) return res.status(401).json({ mensagem: "Token inválido ou expirado!" });
        req.usuarioLogado = decoded.user;
        next(); // Token está OK! Pode ir para a rota salvar os dados
    });
}

// 3. ROTA DE SINCRONIZAÇÃO: Recebe os dados do Room e joga na planilha remota
app.post('/api/sincronizar', verificarToken, (req, res) => {
    const listaClientesDoCelular = req.body; // Recebe o array de clientes do Android

    if (!Array.isArray(listaClientesDoCelular)) {
        return res.status(400).json({ mensagem: "Formato de dados inválido. Esperado uma lista." });
    }

    // Insere as clientes no nosso banco de dados da planilha
    listaClientesDoCelular.forEach(cliente => {
        // Evita duplicar se a cliente já foi enviada antes
        if (!planilhaClientesRemota.some(c => c.nome === cliente.nome && c.telefone === cliente.telefone)) {
            planilhaClientesRemota.push(cliente);
        }
    });

    console.log(`🔄 Sincronização realizada com sucesso por ${req.usuarioLogado}! Total na planilha remota: ${planilhaClientesRemota.length}`);
    
    return res.json({ sucesso: true, mensagem: "Dados integrados à planilha remota!" });
});

// 4. ROTA DO ADMIN: Exibe a Planilha Completa em formato JSON (Ótimo para os prints do PDF)
app.get('/api/planilha', (req, res) => {
    res.json(planilhaClientesRemota);
});

// Iniciando o servidor na porta 3000
app.listen(3000, () => {
    console.log("🚀 Servidor REST rodando na porta 3000!");
    console.log("🔗 Rota de Login: http://localhost:3000/api/login");
    console.log("🔗 Rota da Planilha: http://localhost:3000/api/planilha");
});