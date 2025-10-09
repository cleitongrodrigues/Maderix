// Sample dataset for Usuarios page (30 records)
const sampleUsuarios = [
  // id, name, login, email, phone, perfil id, perfil name, ativo, dt cad
  ...Array.from({ length: 30 }).map((_, i) => {
    const perfis = ["Admin", "Operador", "Conferente"];
    const idx = i + 1;
    return {
      ID_Usuario: idx,
      NM_Usuario: `Usuário ${idx}`,
      Login: `user${idx}`,
      Email: `user${idx}@exemplo.com`,
      Tel_Usuario: `(11) 9${String(100000000 + idx).slice(1)}`,
      ID_Perfil: (i % perfis.length) + 1,
      PerfilNome: perfis[i % perfis.length],
      Ativo: i % 4 !== 0,
      DT_Cad_Usuario: new Date(Date.now() - i * 86400000).toISOString(),
    };
  }),
];

export default sampleUsuarios;
