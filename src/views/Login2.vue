<template>
    <head>
        <title>
            The Sign In/Login page of PPE Control Center.
        </title>
        <meta name="description" content="The Login page of PPE Control Center, software developed by Natan B. Andrade in partnership with SENAI to manage the inventory of personal protective equipment.">
    </head>

    <body>
        <main>
            <section class=backgroundRectangle></section>
            <section class="loginRectangle"> 
                <img class="logoPCCPNG" src="./assets/logoPCCPNG.png" width="80">
                <h2 class="loginText">Login</h2>
                <form @submit.prevent="login">
                    <div class="loginSpace">
                        <label class="userText">User ID</label>
                        <input class="inputID" type="email" v-model="email" required>
                        <input type="password" v-model="password" required>
                        <p v-if="error">{{ error }}</p>
                        <button type="submit">LOGIN</button>
                    </div>
                    <div v-if="erro" class="mensagem-erro">
                        <i class="fas fa-exclamation-circle"></i>
                        {{ erro }}
                    </div>
                </form>
            </section>
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
  if (!email.value || !senha.value) {
    // !email.value = se email está vazio (falsy)
    // || = OU (se email está vazio OU senha está vazia)
    // Se algum estiver vazio, entra neste if
    erro.value = 'Por favor, preencha todos os campos'
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
      password: senha.value
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
      erro.value = 'E-mail ou senha incorretos. Tente novamente.'
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
       router.push('/app')
    // Depois que router.push() é executado, o usuário é levado para a página inicial
  }
  // ===== PASSO 7: CAPTURAR ERROS INESPERADOS =====
  // Se houver um erro que não foi previsto (erro de rede, erro do servidor, etc)
  // Este catch captura e trata
  catch (err) {
    // err = objeto com informações do erro
    // Mostrar uma mensagem genérica para o usuário
    // Não mostramos o erro técnico para não assustar o usuário
    erro.value = 'Erro ao fazer login. Tente novamente mais tarde.'
    // Mostrar o erro completo no console do navegador (para debug)
    // Isso ajuda o desenvolvedor a entender o que deu errado
    console.error('Erro ao fazer login:', err)
    // Desabilitar o carregamento (botão volta ao normal)
    carregando.value = false
  }
}
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wdth,wght@0,75..100,100..900;1,75..100,100..900&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

.backgroundRectangle {
    background-color: #F2F2F2;
    width: 1500px;
    height: 750px;
    position: absolute;
    top: 100px;
    left: 200px;
    border-radius: 30px;
}

.loginRectangle {
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
    top: 15px;
    left: 150px;
}

.loginText {
    font-family: "Roboto", sans-serif;
    font-weight: 500;
    font-size: 35px;
    position: absolute;
    top: 100px;
    left: 150px;
}

.userText {
    font-family: "Inter", sans-serif;
    font-weight: 400;
    font-size: 25px;
    position: absolute;
    top: 200px;
    left: 50px;
}

.inputID{
    position: absolute;
    top: 200px;
}
</style>