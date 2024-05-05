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
      :amount="4000"
      :last-amount="4000"
      :loading="false"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="4000"
      :last-amount="2800"
      :loading="false"
    />
    <Trend
      color="green"
      title="Investments"
      :amount="4000"
      :last-amount="8900"
      :loading="false"
    />
    <Trend
      color="red"
      title="Saving"
      :amount="4000"
      :last-amount="1700"
      :loading="false"
    />
  </section>

  <section>
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
      />
    </div>
  </section>
</template>

<script setup>
import { transactionViewOptions } from '~/constants';
const selectedView = ref(transactionViewOptions[1]);

const supabase = useSupabaseClient();

const { data: transactions, pending } = await useAsyncData(
  'transactions',
  async () => {
    const { data, error } = await supabase.from('transactions').select();
    if (error) return [];
    return data;
  }
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
