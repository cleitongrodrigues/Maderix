// Sample data for Contas a Receber
const sampleContasReceber = [
  ...Array.from({ length: 28 }).map((_, i) => {
    const id = i + 1;
    const venc = new Date(Date.now() + (i - 10) * 86400000); // some past, some future
    return {
      ID_Conta: id,
      Numero: `CR-${1000 + id}`,
      Cliente: `Cliente ${((i % 12) + 1)}`,
      Valor: (Math.round((Math.random() * 1000 + 50) * 100) / 100),
      Vencimento: venc.toISOString(),
      Pago: i % 5 === 0,
      DT_Cad_Conta: new Date(Date.now() - i * 86400000).toISOString(),
    };
  })
];

export default sampleContasReceber;
