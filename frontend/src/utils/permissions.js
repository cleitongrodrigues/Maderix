export const DEFAULT_PERMISSIONS = [
  'CLIENTES_VIEW','CLIENTES_MANAGE','USUARIOS_VIEW','USUARIOS_MANAGE','PERFIS_VIEW','PERFIS_MANAGE','ESTOQUE_VIEW','ESTOQUE_MANAGE','ESTOQUE_MOV','VENDAS_VIEW','VENDAS_MANAGE'
];

export const PERMISSIONS_META = {
  CLIENTES_VIEW: { label: 'Clientes - Visualizar', description: 'Permite ver lista e detalhes de clientes' },
  CLIENTES_MANAGE: { label: 'Clientes - Gerenciar', description: 'Criar, editar e excluir clientes' },
  USUARIOS_VIEW: { label: 'Usuários - Visualizar', description: 'Ver lista e detalhes de usuários' },
  USUARIOS_MANAGE: { label: 'Usuários - Gerenciar', description: 'Criar, editar e excluir usuários' },
  PERFIS_VIEW: { label: 'Perfis - Visualizar', description: 'Ver perfis e permissões' },
  PERFIS_MANAGE: { label: 'Perfis - Gerenciar', description: 'Criar, editar e excluir perfis' },
  ESTOQUE_VIEW: { label: 'Estoque - Visualizar', description: 'Ver saldo e movimentações de estoque' },
  ESTOQUE_MANAGE: { label: 'Estoque - Gerenciar', description: 'Alterar itens e quantidades no estoque' },
  ESTOQUE_MOV: { label: 'Estoque - Movimentações', description: 'Registrar movimentações de entrada/saída' },
  VENDAS_VIEW: { label: 'Vendas - Visualizar', description: 'Ver histórico e detalhes de vendas' },
  VENDAS_MANAGE: { label: 'Vendas - Gerenciar', description: 'Criar/editar/excluir vendas' },
};
