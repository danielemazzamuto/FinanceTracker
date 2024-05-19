interface Amount {
  value: number;
}

export const useCurrency = (amount: Amount) => {
  const currency = computed<string>((): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(isRef<number>(amount) ? +amount.value : +amount);
  });

  return { currency };
};
