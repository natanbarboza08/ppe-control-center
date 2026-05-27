<template>
    <head>
        <title>
            The Sign In/Login page of PPE Control Center.
        </title>
        <meta name="description" content="The Login page of PPE Control Center, software developed by Natan B. Andrade in partnership with SENAI to manage the inventory of personal protective equipment.">
    </head>

    <body>
        <main>
            <!-- Container principal da tela de login -->
            <section class=backgroundContainer></section>
            <div class="loginContainer">
            <!-- Caixa do formulário -->
            <div class="form-box">
                <img class="logoPCCPNG" src="./assets/logoPCCPNG.png" width="80">
                <!-- Título da página -->
                <h1 class="title">Login</h1>

                <!-- Formulário de login -->
                <!-- @submit.prevent="fazerLogin" = quando o usuário clica em "Entrar", chama a função fazerLogin() -->
                <form @submit.prevent="fazerLogin" class="formulario">
                <!-- Campo de e-mail -->
                <!-- v-model="email" = vincula o valor do input com a variável email -->
                <!-- Quando o usuário digita, a variável email é atualizada automaticamente -->
                <div class="form-group">
                    <label for="email" class="label">E-mail</label>
                    <input
                    id="email"
                    v-model="email"
                    type="email"
                    placeholder="Type your e-mail"
                    class="input"
                    required
                    />
                    <img class="emailInput" src="./assets/userInput.png" alt="" width="20">
                </div>

                <!-- Campo de senha -->
                <!-- v-model="senha" = vincula o valor do input com a variável senha -->
                <div class="form-group">
                    <label for="password" class="label">Password</label>
                    <input
                    id="password"
                    v-model="password"
                    type="password"
                    placeholder="Type your password"
                    class="input"
                    required
                    />
                    <img class="passwordInput" src="./assets/passwordInput.png" alt="" width="20">
                </div>

                <!-- Mensagem de erro -->
                <!-- v-if="erro" = só mostra a mensagem se houver um erro -->
                <div v-if="erro" class="mensagem-erro">
                    <i class="fas fa-exclamation-circle"></i>
                    {{ erro }}
                </div>

                <!-- Botão de envio -->
                <!-- :disabled="carregando" = desabilita o botão enquanto está fazendo login -->
                <!-- Isso evita que o usuário clique múltiplas vezes -->
                <button
                    type="submit"
                    class="botao-entrar"
                    :disabled="carregando"
                >
                    <!-- Mostra um spinner enquanto está carregando -->
                    <i v-if="carregando" class="fas fa-spinner fa-spin"></i>
                    <!-- Mostra o texto normal quando não está carregando -->
                    <span v-else>LOGIN</span>
                </button>
                </form>
            </div>
            </div>
        </main>
    </body>
</template>

<script setup>
// ===== IMPORTAÇÕES =====
// Importar a função ref do Vue para criar variáveis reativas
// ref() = cria uma variável que, quando muda, atualiza a tela automaticamente
import { ref } from 'vue'

// Importar o composable do Supabase que já está configurado no projeto
// useSupabase() = retorna o cliente Supabase pronto para usar
import { useSupabase } from '../composables/useSupabase'

// Importar o router do Vue Router para navegar entre páginas
// useRouter() = permite usar router.push() para ir para outras páginas
import { useRouter } from 'vue-router'

// ===== CONFIGURAÇÃO =====
// Pegar o cliente Supabase já configurado
// supabase = objeto que tem os métodos para autenticação, banco de dados, etc
const { supabase } = useSupabase()

// Pegar o router para navegar entre páginas
// router = objeto que permite router.push('/pagina') para navegar
const router = useRouter()

// ===== VARIÁVEIS REATIVAS =====
// Essas variáveis são "reativas", ou seja, quando mudam, a tela atualiza automaticamente

// Variável que guarda o e-mail digitado pelo usuário
// ref('') = começa vazia
// email.value = para acessar o valor dentro do script
// {{ email }} = para usar no template
const email = ref('')

// Variável que guarda a senha digitada pelo usuário
// ref('') = começa vazia
const password = ref('')

// Variável que guarda a mensagem de erro (se houver)
// Quando tem um erro, mostra na tela
// Quando não tem erro, a mensagem fica vazia e não aparece
const erro = ref('')

// Variável que indica se o login está em progresso
// Usamos isso para:
// 1. Desabilitar o botão enquanto aguarda a resposta do Supabase
// 2. Mostrar um spinner de carregamento
// 3. Evitar que o usuário clique múltiplas vezes
const carregando = ref(false)

// ===== FUNÇÃO PRINCIPAL: FAZER LOGIN =====
// Esta função é chamada quando o usuário clica no botão "Entrar"
// async = significa que essa função pode fazer operações que demoram (como chamar o Supabase)
// await = espera a operação terminar antes de continuar
async function fazerLogin() {
  // ===== PASSO 1: LIMPAR ERROS ANTERIORES =====
  // Se havia uma mensagem de erro da tentativa anterior, apagar
  // Assim a tela fica limpa para a nova tentativa
    erro.value = ''

  // ===== PASSO 2: VALIDAR SE OS CAMPOS ESTÃO PREENCHIDOS =====
  // Verificar se o usuário digitou algo nos campos
  // Se não digitou nada, mostrar erro e parar a função
    if (!email.value || !password.value) {
    // !email.value = se email está vazio (falsy)
    // || = OU (se email está vazio OU senha está vazia)
    // Se algum estiver vazio, entra neste if
    erro.value = 'Please fill in all fields.'
    // Mostra a mensagem de erro na tela
    return
    // return = para a execução da função aqui
    // Não continua para o Supabase se os campos estão vazios
    }

  // ===== PASSO 3: MOSTRAR QUE ESTÁ CARREGANDO =====
  // Muda carregando para true
  // Isso faz com que:
  // 1. O botão fica desabilitado (não pode clicar de novo)
  // 2. Aparece um spinner de carregamento
    carregando.value = true

    try {
    // ===== PASSO 4: TENTAR FAZER LOGIN COM O SUPABASE =====
    // supabase.auth.signInWithPassword() = função do Supabase que autentica o usuário
    // Recebe um objeto com email e password
    // Retorna um objeto com { data, error }
    // - data = informações do usuário se o login funcionou
    // - error = mensagem de erro se o login falhou
    const { error } = await supabase.auth.signInWithPassword({
      // email: email.value = envia o e-mail que o usuário digitou
        email: email.value,
      // password: senha.value = envia a senha que o usuário digitou
        password: password.value
    })
    // await = espera o Supabase responder antes de continuar

    // ===== PASSO 5: VERIFICAR SE HOUVE ERRO =====
    // Se o Supabase retornou um erro, significa que:
    // - O e-mail não existe
    // - A senha está incorreta
    // - Algum outro problema de autenticação
    if (error) {
      // if (error) = se houve erro
      // O Supabase retorna um erro se o e-mail ou senha estiverem incorretos
      // Mostrar a mensagem de erro para o usuário
        erro.value = 'Incorrect email or password. Please try again.'
      // Desabilitar o carregamento (botão volta ao normal)
        carregando.value = false
      // return = para a função aqui, não continua
        return
    }

    // ===== PASSO 6: LOGIN BEM-SUCEDIDO - REDIRECIONAR =====
    // Se chegou aqui, significa que o login funcionou!
    // Não houve erro, então o usuário está autenticado
    // Agora precisamos levar o usuário para a página principal
    // router.push('/') = navega para a página inicial
    // '/' = rota raiz (onde está o AppLayout com a Sidebar)
    // Isso acontece sem recarregar a página (SPA - Single Page Application)
    router.push('/Dashboard')
    // Depois que router.push() é executado, o usuário é levado para a página inicial
    }
  // ===== PASSO 7: CAPTURAR ERROS INESPERADOS =====
  // Se houver um erro que não foi previsto (erro de rede, erro do servidor, etc)
  // Este catch captura e trata
    catch (err) {
    // err = objeto com informações do erro
    // Mostrar uma mensagem genérica para o usuário
    // Não mostramos o erro técnico para não assustar o usuário
    erro.value = 'Failed to log in. Please try again later.'
    // Mostrar o erro completo no console do navegador (para debug)
    // Isso ajuda o desenvolvedor a entender o que deu errado
    console.error('Failed to log in:', err)
    // Desabilitar o carregamento (botão volta ao normal)
    carregando.value = false
    }
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wdth,wght@0,75..100,100..900;1,75..100,100..900&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
/* ===== ESTILOS GERAIS ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

main {
    margin: 0;
    min-height: 100vh;

    background-image: url(./assets/background.png);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.backgroundContainer {
    background-color: #F2F2F2;
    width: 1500px;
    height: 750px;
    position: absolute;
    top: 100px;
    left: 200px;
    border-radius: 30px;
}

/* ===== CONTAINER PRINCIPAL ===== */
/* Centraliza o formulário na tela */
.loginContainer {
    background-color: #BECBD7;
    width: 400px;
    height: 650px;
    position: absolute;
    top: 150px;
    left: 750px;
    border-radius: 30px;
}

.logoPCCPNG {
    position: absolute;
    top: -55px;
    left: 150px;
}

/* ===== CAIXA DO FORMULÁRIO ===== */
/* Estilo da caixa que envolve o formulário */
.form-box {
    width: 100%;
    max-width: 450px;
    padding: 30px 40px;
    border-radius: 8px;
    position: absolute;
    top: 70px;
    background-color: #BECBD7;
}

/* ===== TÍTULOS ===== */
/* Título principal */
.title {
    font-family: "Roboto", sans-serif;
    font-size: 32px;
    color: black;
    font-weight: 500;
    margin-bottom: 8px;
    text-align: center;
}

/* ===== FORMULÁRIO ===== */
/* Estilos do formulário */
.formulario {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

/* ===== GRUPOS DE FORMULÁRIO ===== */
/* Cada campo (e-mail, senha) é envolvido em um form-group */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

/* ===== LABELS ===== */
/* Rótulos dos campos (E-mail, Senha) */
.label {
    font-family: "Inter", sans-serif;
    font-size: 20px;
    font-weight: 500;
    color: #363636;
}

/* ===== INPUTS ===== */
/* Estilo dos campos de entrada (e-mail, senha) */
.input {
    font-family: "Inter", sans-serif;
    padding: 12px 36px;
    border: none;
    outline: none;
    border-bottom: 1px solid #363636;
    border-radius: 0px;
    font-size: 16px;
    background-color: #BECBD7;
    transition: all 0.3s ease;
}

/* Quando o usuário clica no input, muda a borda para azul */
.input:focus {
    outline: none;
    border-color: #363636;
    border-radius: 4px;
    box-shadow: 0 0 0 3px rgba(0, 61, 153, 0.1);
}

.emailInput {
    position: absolute;
    top: 120px;
    left: 45px;
}

.passwordInput {
    position: absolute;
    top: 220px;
    left: 45px;
}

/* ===== MENSAGEM DE ERRO ===== */
/* Estilo da mensagem de erro */
.mensagem-erro {
    padding: 12px 16px;
    background-color: #FEE2E2;
    border: 1px solid #FECACA;
    border-radius: 4px;
    color: #DC2626;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
}

/* Ícone de erro */
.mensagem-erro i {
    font-size: 18px;
}

/* ===== BOTÃO DE ENTRAR ===== */
/* Estilo do botão de login */
.botao-entrar {
    padding: 12px 24px;
    background-color: #9BC9FF;
    color: #363636;
    border: 1px solid#6699FF;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 44px;
}

/* Quando passa o mouse no botão, muda a cor */
.botao-entrar:hover:not(:disabled) {
    background-color: #6699FF;
}

/* Quando o botão está desabilitado (carregando), muda a aparência */
.botao-entrar:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #6699FF;
}


/* ===== RESPONSIVIDADE ===== */
/* Em telas pequenas (celulares), reduz o tamanho do formulário */
@media (max-width: 600px) {
    .form-box {
        padding: 30px 20px;
    }

    .titulo {
        font-size: 24px;
    }

}
</style>
