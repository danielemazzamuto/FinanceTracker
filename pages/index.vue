<template>
  <section class="flex items-center justify-between mb-10">
    <h1 class="text-4xl font-extrabold">Summary</h1>
    <div>
      <USelectMenu
        v-model="selectedView"
        :options="transactionViewOptions"
      />
    </div>
  </section>

  <section
    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16 mb-10"
  >
    <Trend
      color="green"
      title="Income"
      :amount="incomeTotSum"
      :last-amount="4000"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="expenseTotSum"
      :last-amount="2800"
      :loading="isLoading"
    />
    <Trend
      color="green"
      title="Investments"
      :amount="4000"
      :last-amount="8900"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Saving"
      :amount="4000"
      :last-amount="1700"
      :loading="isLoading"
    />
  </section>

  <section class="flex justify-between mb-10">
    <div>
      <h2 class="text-2xl font-extrabold">Transactions</h2>
      <div class="text-gray-500 dark:text-gray-400">
        <p>
          You have {{ incomeCount }} incomes and {{ expenseCount }} expenses.
        </p>
      </div>
    </div>
    <div>
      <UButton
        icon="i-heroicons-plus-circle"
        color="white"
        variant="solid"
        label="Add"
        @click="isOpen = true"
      />
      <TransactionModal v-model="isOpen" />
    </div>
  </section>

  <section v-if="!isLoading">
    <div
      v-for="(transactionsOnDay, date) in transactionsGroupedByDate"
      :key="date"
      class="mb-10"
    >
      <DailyTransactionSummary
        :date="date"
        :transactions="transactionsOnDay"
      />
      <Transaction
        v-for="transaction in transactionsOnDay"
        :key="transaction.id"
        :transaction="transaction"
        @transactionDeleted="refreshTransactions()"
      />
    </div>
  </section>
  <section v-else>
    <USkeleton
      class="h-8 w-full mb-2"
      v-for="i in 4"
      :key="i"
    />
  </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constants';
const supabase = useSupabaseClient();

const selectedView = ref(transactionViewOptions[1]);
const transactions = ref([]);
const isLoading = ref(false);
const isOpen = ref(false);

const refreshTransactions = async () => {
  transactions.value = await fetchTransactions();
};

// we define a function to fetch the transactions from the database
const fetchTransactions = async () => {
  isLoading.value = true;
  try {
    const { data } = await useAsyncData('transactions', async () => {
      const { data, error } = await supabase.from('transactions').select();
      if (error) return [];
      return data;
    });
    return data.value;
  } finally {
    isLoading.value = false;
  }
};
// we call the function to fetch the transactions
await refreshTransactions();

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

const transactionsGroupedByDate = computed(() => {
  const grouped = {};
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
</script>
