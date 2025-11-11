import { get, post, put, patch, del } from "./http";

// ==================== CLIENTES ====================
export const clientesAPI = {
  listar: () => get("/clientes"),
  buscarPorId: (id) => get(`/clientes/${id}`),
  criar: (cliente) => post("/clientes", cliente),
  atualizar: (id, cliente) => put(`/clientes/${id}`, cliente),
  deletar: (id) => del(`/clientes/${id}`),
};

// ==================== MATERIAIS ====================
export const materiaisAPI = {
  listar: () => get("/materiais"),
  buscarPorId: (id) => get(`/materiais/${id}`),
  criar: (material) => post("/materiais", material),
  atualizar: (id, material) => put(`/materiais/${id}`, material),
  deletar: (id) => del(`/materiais/${id}`),
};

// ==================== VENDAS ====================
export const vendasAPI = {
  listar: () => get("/vendas"),
  buscarPorId: (id) => get(`/vendas/${id}`),
  criar: (venda) => post("/vendas", venda),
  cancelar: (id) => patch(`/vendas/${id}/cancelar`),
};

// ==================== CONTAS A RECEBER ====================
export const contasReceberAPI = {
  listarPendentes: () => get("/contasReceber"),
  buscarPorId: (id) => get(`/contasReceber/${id}`),
  marcarComoPaga: (id) => patch(`/contasReceber/${id}/pagar`),
};

// ==================== PAGAMENTOS DE VENDA ====================
export const pagamentosVendaAPI = {
  listar: () => get("/pagamentos-venda"),
  buscarPorId: (id) => get(`/pagamentos-venda/${id}`),
  buscarPorVenda: (idVenda) => get(`/pagamentos-venda/venda/${idVenda}`),
  registrar: (pagamento) => post("/pagamentos-venda", pagamento),
};

// ==================== MOVIMENTAÇÃO DE ESTOQUE ====================
export const estoqueAPI = {
  listar: () => get("/movimentacaoEstoque"),
  buscarPorMaterial: (idMaterial) => get(`/movimentacaoEstoque/material/${idMaterial}`),
  registrar: (movimentacao) => post("/movimentacaoEstoque", movimentacao),
};

// ==================== EMPRESAS ====================
export const empresasAPI = {
  listar: () => get("/empresas"),
  buscarPorId: (id) => get(`/empresas/${id}`),
  criar: (empresa) => post("/empresas", empresa),
  atualizar: (id, empresa) => put(`/empresas/${id}`, empresa),
  deletar: (id) => del(`/empresas/${id}`),
};

// ==================== UNIDADES DE MEDIDA ====================
export const unidadesAPI = {
  listar: () => get("/unidadeMedida"),
  buscarPorId: (id) => get(`/unidadeMedida/${id}`),
  criar: (unidade) => post("/unidadeMedida", unidade),
  atualizar: (id, unidade) => put(`/unidadeMedida/${id}`, unidade),
  deletar: (id) => del(`/unidadeMedida/${id}`),
};

// ==================== USUÁRIOS ====================
export const usuariosAPI = {
  listar: () => get("/usuarios"),
  buscarPorId: (id) => get(`/usuarios/${id}`),
  criar: (usuario) => post("/usuarios", usuario),
  atualizar: (id, usuario) => put(`/usuarios/${id}`, usuario),
  deletar: (id) => del(`/usuarios/${id}`),
};

// ==================== PERFIS ====================
export const perfisAPI = {
  listar: () => get("/perfis"),
  buscarPorId: (id) => get(`/perfis/${id}`),
  criar: (perfil) => post("/perfis", perfil),
  atualizar: (id, perfil) => put(`/perfis/${id}`, perfil),
  adicionarPermissoes: (perfilId, permissoesIds) => 
    patch(`/perfis/${perfilId}/permissoes/adicionar`, { permissoesIds }),
  removerPermissoes: (perfilId, permissoesIds) => 
    patch(`/perfis/${perfilId}/permissoes/remover`, { permissoesIds }),
};

// ==================== PERMISSÕES ====================
export const permissoesAPI = {
  listar: () => get("/permissoes"),
  buscarPorId: (id) => get(`/permissoes/${id}`),
};
