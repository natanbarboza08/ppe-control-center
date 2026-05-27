<template>
  <div class="layout-container">
    
    <header class="header-section">
      <h1>PPE REGISTRY</h1>
      <p>Register and manage your PPE here.</p>
    </header>

    <main class="content">
      <section class="card-form">
        <div class="card-header">
          <h3>{{ editandoId ? 'Edit Equipment' : 'New Equipment' }}</h3>
        </div>
        
        <form @submit.prevent="salvar" class="main-form">
          <div class="form-row">
            <div class="form-group">
              <label>Name</label>
              <input v-model="form.nome" type="text" placeholder="E.g. Safety Helmet" required>
            </div>
            <div class="form-group">
              <label>C.A. Number</label>
              <input v-model="form.ca" type="text" placeholder="E.g. 12345" required>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label>Description</label>
            <input v-model="form.descricao" type="text" placeholder="E.g. Class B with chin strap">
          </div>

            <div class="form-group">
              <label>Initial quantity</label>
              <input v-model="form.quantidade" type="number" placeholder="E.g. 10" required>
            </div>
          
          <div class="action-bar">
            <button type="submit" class="btn btn-primary">
              {{ editandoId ? 'Save changes' : 'Register' }}
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
              <th>Equipment</th>
              <th>C.A.</th>
              <th>Description</th>
              <th>Quantity</th>
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="e in epis" :key="e.id">
              <td><span class="text-bold">{{ e.nome }}</span></td>
              <td><span class="badge-ca">{{ e.ca }}</span></td>
              <td>{{ e.descricao }}</td>
              <td>{{ e.quantidade }}</td>
              <td class="text-center">
                <button @click="prepararEdicao(e)" class="btn-action edit">Edit</button>
                <button @click="excluir(e.id)" class="btn-action delete">Delete</button>
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

const epis = ref([]);
const editandoId = ref(null);
const form = reactive({ nome: '', ca: '', descricao: '', quantidade: '' });

// Busca os EPIs no banco
const carregar = async () => {
  const { data } = await supabase.from('epis').select('*').order('nome');
  epis.value = data || [];
};

// Salva ou Atualiza
const salvar = async () => {
  if (editandoId.value) {
    await supabase.from('epis').update(form).eq('id', editandoId.value);
  } else {
    await supabase.from('epis').insert([form]);
  }
  cancelarEdicao();
  carregar();
};

const prepararEdicao = (e) => {
  editandoId.value = e.id;
  Object.assign(form, { nome: e.nome, ca: e.ca, descricao: e.descricao, quantidade: e.quantidade });
};

const excluir = async (id) => {
  if (confirm('Do you want to delete this equipment?')) {
    await supabase.from('epis').delete().eq('id', id);
    carregar();
  }
};

const cancelarEdicao = () => {
  editandoId.value = null;
  Object.assign(form, { nome: '', ca: '', descricao: '', quantidade: '' });
};

onMounted(carregar);
</script>

<style scoped>

@import url('https://fonts.googleapis.com/css2?family=Secular+One&display=swap');

@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Rubik:ital,wght@0,800;1,800&display=swap');

/* Aproveitando o estilo anterior para manter o padrão */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.layout-container { max-width: 1000px; margin: 0 auto; padding: 30px; background-color: #f2f2f2; min-height: 100vh; font-family: "Secular One", sans-serif; font-size: 400;  border-radius: 20px;}
.header-section { margin-bottom: 25px; }
.card-form, .card-table { background: #F2F2F2; border-radius: 10px; border: 1px solid #A2A2A2; margin-bottom: 25px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); overflow: hidden;  font-family: "Rubik", sans-serif;}
.card-header { background: #E2E2E2; padding: 12px 20px; border-bottom: 1px solid #A2A2A2; font-weight: bold; }
.main-form { padding: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
label { font-size: 0.8rem; font-weight: 400; color: #828282; }
input { padding: 10px; border: 1px solid #A2A2A2; border-radius: 6px; }
.btn { padding: 10px 20px; border-radius: 6px; cursor: pointer; border: none; font-weight: bold; }
.btn-primary { background: #9BC9FF; color: black; margin-top: 16px; font-family: "Rubik", sans-serif; transition: background-color 0.3s ease-in-out, text-shadow 0.3s ease-in-out; }
.btn-primary:hover{ background-color: rgb(120, 180, 255); text-shadow: 0.4px 0 0 currentColor; }
.btn-outline { font-family: "Rubik", sans-serif; padding: 9px 20px; background: white; color: #828282; margin-left: 10px; transition: background-color 0.3s ease-in-out, text-shadow 0.3s ease-in-out; }
.btn-outline:hover { background-color: #A2A2A2; color: #000000; text-shadow: 0.4px 0 0 currentColor; }
.styled-table { width: 100%; border-collapse: collapse; }
.styled-table th { background: #E2E2E2; padding: 12px 20px; text-align: left; font-size: 0.75rem; color: #828282; text-transform: uppercase; border-bottom: 1px solid #a2a2a2; }
.styled-table td { padding: 12px 20px; border-bottom: 1px solid #A2A2A2; font-family: "Rubik", sans-serif; font-size: 0.9rem; }
.badge-ca { background: #E2E2E2; color: #6699FF; padding: 2px 8px; border-radius: 6px; font-weight: bold; }
.edit { color: #2563eb; cursor: pointer; background: none; border: none; font-weight: bold; margin-right: 10px; transition: color 0.3s ease-in-out; }
.edit:hover { color: #153479; }
.delete { color: #be123c; cursor: pointer; background: none; border: none; font-weight: bold; transition: color 0.3s ease-in-out; }
.delete:hover { color:#6d0c24; }
</style>