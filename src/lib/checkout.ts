export const DELIVERY_FEE_CENTS = 700;

export function deliveryFee(fulfillmentMethod: string) {
  return fulfillmentMethod === "motoboy" ? DELIVERY_FEE_CENTS : 0;
}

export function normalizeCpf(value: string) {
  return value.replace(/\D/g, "");
}

export function formatCpf(value: string) {
  return normalizeCpf(value).slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
}

export function isValidCpf(value: string) {
  const cpf = normalizeCpf(value);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  for (let length = 9; length <= 10; length++) {
    let sum = 0;
    for (let index = 0; index < length; index++) {
      sum += Number(cpf[index]) * (length + 1 - index);
    }
    const digit = (sum * 10) % 11;
    if (Number(cpf[length]) !== (digit === 10 ? 0 : digit)) return false;
  }
  return true;
}
