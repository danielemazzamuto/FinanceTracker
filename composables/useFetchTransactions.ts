type Transaction = {
  id: string;
  type: 'Income' | 'Expense' | 'Investment' | 'Savings';
  amount: number;
  description: string;
  date: Date;
  created_at: Date;
  category?: string;
};

export const useFetchTransactions = () => {
  const supabase = useSupabaseClient();
  const transactions = ref<Transaction[]>([]);
  const isLoading = ref<Boolean>(false);

  const income = computed(() =>
    transactions.value.filter((t) => t.type === 'Income')
  );
  const expense = computed(() =>
    transactions.value.filter((t) => t.type === 'Expense')
  );
  const incomeCount = computed(() => income.value.length);

  const expenseCount = computed(() => expense.value.length);

  const incomeTotSum = computed(() =>
    income.value.reduce((sum, t) => sum + t.amount, 0)
  );
  const expenseTotSum = computed(() =>
    expense.value.reduce((sum, t) => sum - t.amount, 0)
  );

  const fetchTransactions = async <Transaction>() => {
    isLoading.value = true;
    try {
      const { data } = await useAsyncData('transactions', async () => {
        const { data, error } = await supabase
          .from('transactions')
          .select()
          .order('created_at', { ascending: false });
        if (error) return [];
        return data as Transaction[];
      });
      return data.value as Transaction[];
    } finally {
      isLoading.value = false;
    }
  };

  const refreshTransactions = async () => {
    transactions.value = await fetchTransactions<Transaction>();
  };

  const transactionsGroupedByDate = computed(() => {
    const grouped: { [key: string]: Transaction[] } = {}; // Add index signature to the grouped object
    for (const transaction of transactions.value) {
      const date = new Date(transaction.created_at).toISOString().split('T')[0];
      // we check if the date is already in the object, otherwise we create an empty array
      if (!grouped[date]) {
        grouped[date] = [];
      }
      // we push the transaction to the array
      grouped[date].push(transaction);
    }
    return grouped;
  });

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupedByDate,
      },
      income,
      expense,
      incomeCount,
      expenseCount,
      incomeTotSum,
      expenseTotSum,
    },
    refreshTransactions,
    isLoading,
  };
};
