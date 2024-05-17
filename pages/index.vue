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
      :last-amount="prevIncomeTotSum"
      :loading="isLoading"
    />
    <Trend
      color="red"
      title="Expense"
      :amount="expenseTotSum"
      :last-amount="prevExpenseTotSum"
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
      <TransactionModal
        v-model:isOpen="isOpen"
        @transactionSaved="refreshTransactions()"
      />
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

const selectedView = ref(transactionViewOptions[1]);
const isOpen = ref(false);

const { current, previous } = useSelectedTimePeriod(selectedView);

const {
  isLoading,
  refreshTransactions,
  transactions: {
    incomeCount,
    expenseCount,
    incomeTotSum,
    expenseTotSum,
    grouped: { byDate: transactionsGroupedByDate },
  },
} = useFetchTransactions(current);
//await refreshTransactions();

const {
  refreshTransactions: refreshPrevTransactions,
  transactions: {
    incomeTotSum: prevIncomeTotSum,
    expenseTotSum: prevExpenseTotSum,
  },
} = useFetchTransactions(previous);

await refreshTransactions();
await refreshPrevTransactions();
</script>
