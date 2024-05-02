export const useCurrency = (amount: number) => {
  const currency = computed<string>((): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
    }).format(isRef<number>(amount) ? +amount.value : +amount);
  });

  return { currency };
};
