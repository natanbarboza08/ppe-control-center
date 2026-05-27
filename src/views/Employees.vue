<template>
  <div class="layout-container">
    
    <header class="header-section">
      <h1>EMPLOYEE ONBOARDING CONTROL</h1>
      <p>Manage and organize employee records.</p>
    </header>

    <main class="content">
      <section class="card-form">
        <div class="card-header">
          <h3>{{ editandoId ? 'Edit record' : 'New employee' }}</h3>
        </div>
        
        <form @submit.prevent="salvar" class="main-form">
          <div class="form-row">
            <div class="form-group">
              <label for="nome">Full name</label>
              <input v-model="form.nome" type="text" id="nome" placeholder="Type the full name" required>
            </div>
            <div class="form-group">
              <label for="matricula">Employee ID</label>
              <input v-model="form.matricula" type="text" id="matricula" placeholder="E.g. 5542" required>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="setor">Department</label>
              <input v-model="form.setor" type="text" id="setor" placeholder="E.g. Human Resources" required>
            </div>
            <div class="form-group">
              <label for="cargo">Position</label>
              <input v-model="form.cargo" type="text" id="cargo" placeholder="E.g. Recruiter" required>
            </div>
          </div>
          
          <div class="action-bar">
            <button type="submit" class="btn btn-primary">
              {{ editandoId ? 'Update data' : 'Complete registration' }}
            </button>
            <button v-if="editandoId" type="button" @click="cancelarEdicao" class="btn btn-outline">
              Cancel
            </button>
          </div>
        </form>
      </section>

      <section class="card-table">
        <table class="styled-table">
          <thead>
            <tr>
              <th>EMPLOYEE</th>
              <th>ID</th>
              <th>DEPARTMENT / POSITION</th>
              <th class="text-center">MANAGE</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="f in funcionarios" :key="f.id">
              <td><span class="text-bold">{{ f.nome }}</span></td>
              <td>{{ f.matricula }}</td>
              <td>
                <span class="badge">{{ f.setor }}</span>
                <span class="cargo-text">{{ f.cargo }}</span>
              </td>
              <td class="text-center">
                <button @click="prepararEdicao(f)" class="btn-action edit">Edit</button>
                <button @click="excluir(f.id)" class="btn-action delete">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { supabase } from '../composables/useSupabase';

// Variáveis que controlam os dados na tela
const funcionarios = ref([]);
const editandoId = ref(null);
const form = reactive({ 
  nome: '', 
  matricula: '', 
  setor: '', 
  cargo: '' 
});

// Busca os dados do Supabase
const carregar = async () => {
  const { data, error } = await supabase.from('funcionarios').select('*').order('nome');
  if (error) {
    console.error("Loading Error:", error.message);
  } else {
    funcionarios.value = data || [];
  }
};

// Salva um novo ou atualiza um existente
const salvar = async () => {
  if (editandoId.value) {
    // Modo de Edição (Update)
    await supabase.from('funcionarios').update(form).eq('id', editandoId.value);
  } else {
    // Modo de Criação (Insert)
    await supabase.from('funcionarios').insert([form]);
  }
  cancelarEdicao();
  carregar();
};

// Prepara o formulário para edição ao clicar no botão
const prepararEdicao = (f) => {
  editandoId.value = f.id;
  Object.assign(form, { 
    nome: f.nome, 
    matricula: f.matricula, 
    setor: f.setor, 
    cargo: f.cargo 
  });
};

// Deleta um registro
const excluir = async (id) => {
  if (confirm('Are you sure you want to delete this record?')) {
    await supabase.from('funcionarios').delete().eq('id', id);
    carregar();
  }
};

// Limpa o formulário e sai do modo de edição
const cancelarEdicao = () => {
  editandoId.value = null;
  Object.assign(form, { nome: '', matricula: '', setor: '', cargo: '' });
};

// Inicia a busca de dados assim que a tela abre
onMounted(carregar);
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Secular+One&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Rubik:ital,wght@0,800;1,800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.layout-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 10px 20px;
  background-color: #F2F2F2;
  min-height: 100vh;
  border-radius: 20px;
}

.header-section { margin-bottom: 30px; }
.header-section h1 { color: #000000; font-size: 1.8rem; font-family: "Secular One", sans-serif; }
.header-section p { color: #000000; font-family: "Secular One", sans-serif; }

/* Cards */
.card-form, .card-table {
  background: #F2F2F2;
  border-radius: 12px;
  border: 1px solid #A2A2A2;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
  overflow: hidden;
  font-family: "Rubik" sans-serif;
}

.card-header {
  background-color: #E2E2E2;
  padding: 15px 24px;
  border-bottom: 1px solid #A2A2A2;
  font-family: "Rubik", sans-serif;
}

.main-form { padding: 24px; }

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group { display: flex; flex-direction: column; gap: 8px; }

label { font-size: 0.85rem; font-weight: 400; color: #828282; font-family: "Rubik", sans-serif;}

input {
  padding: 12px;
  border: 1px solid #A2A2A2;
  border-radius: 8px;
  font-size: 1rem;
  transition: box-shadow 0.3s ease-in-out;
}

input:focus {
  outline: none;
  border-color: #9BC9FF;
  box-shadow: 0 0 0 4px #6699ff3a;
}

/* Botões Estilizados */
.action-bar { display: flex; gap: 12px; }
.btn { padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
.btn-primary { font-family: "Rubik"; background: #9BC9FF; color: black; border: none; transition: background-color 0.3s ease-in-out, text-shadow 0.3s ease-in-out; }
.btn-primary:hover{ background-color: rgb(120, 180, 255); text-shadow: 0.4px 0 0 currentColor; }
.btn-outline { font-family: "Rubik", sans-serif; padding: 9px 20px; background: white; color: #828282; border: none; transition: background-color 0.3s ease-in-out, text-shadow 0.3s ease-in-out; }
.btn-outline:hover { background-color: #A2A2A2; color: #000000; text-shadow: 0.4px 0 0 currentColor; }

/* Tabela Profissional */
.styled-table { width: 100%; border-collapse: collapse; }
.styled-table th {
  background-color: #E2E2E2;
  padding: 16px 24px;
  text-align: left;
  font-size: 0.80rem;
  color: #828282;
  text-transform: uppercase;
  font-family: "Rubik", sans-serif;
}

.styled-table td {
  background-color: #F2F2F2;
  padding: 16px 24px;
  border-top: 1px solid #828282;
  font-size: 0.95rem;
  font-family: "Rubik", sans-serif;
}

.text-bold { font-weight: 400; color: #000000; }

.badge {
  background: #E2E2E2;
  color: #6699FF;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-right: 10px;
}

.cargo-text { color: #000000; font-size: 0.85rem; }

/* Ações na Tabela */
.btn-action {
  background: none;
  border: none;
  font-weight: 700;
  cursor: pointer;
}

.edit { color: #2563eb; cursor: pointer; background: none; border: none; font-weight: bold; margin-right: 10px; transition: color 0.3s ease-in-out; }
.edit:hover { color: #153479; }
.delete { color: #be123c; cursor: pointer; background: none; border: none; font-weight: bold; transition: color 0.3s ease-in-out; }
.delete:hover { color:#6d0c24; }

@media (max-width: 600px) {
  .form-row { grid-template-columns: 1fr; }
}
</style>