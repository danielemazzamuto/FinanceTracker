type Transaction = {
  id: string;
  type: 'Income' | 'Expense' | 'Investment' | 'Savings';
  amount: number;
  description: string;
  date: string;
  created_at: Date;
  category?: string;
};

interface Period {
  value: {
    from: Date;
    to: Date;
  };
}

export const useFetchTransactions = (period: Period) => {
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
    expense.value.reduce((sum, t) => sum + t.amount, 0)
  );

  const fetchTransactions = async <Transaction>() => {
    isLoading.value = true;
    try {
      // the key must be unique for each period to avoid conflicts in the cache, so we use the period dates
      const { data } = await useAsyncData(
        `transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`,
        async () => {
          const { data, error } = await supabase
            .from('transactions')
            .select()
            .gte('created_at', period.value.from.toISOString())
            .lte('created_at', period.value.to.toISOString())
            .order('created_at', { ascending: false });
          if (error) return [];
          return data as Transaction[];
        }
      );
      return data.value as Transaction[];
    } finally {
      isLoading.value = false;
    }
  };

  const refreshTransactions = async () => {
    transactions.value = await fetchTransactions<Transaction>();
  };

  // we watch the period value and refresh the transactions when it changes
  // we use the immediate option to fetch the transactions when the component is created
  watch(period, async () => {
    await refreshTransactions();
  });

  const transactionsGroupedByDate = computed(() => {
    const grouped: { [key: string]: Transaction[] } = {}; // Add index signature to the grouped object
    for (const transaction of transactions.value) {
      const date = transaction.created_at.split('T')[0];
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
