<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Add Transaction </template>

      <UFormGroup
        label="Type"
        required
        name="type"
        class="mb-4"
      >
        <USelect
          :options="transactionTypes"
          placeholder="Select a type of transaction"
        />
      </UFormGroup>

      <UFormGroup
        label="Amount"
        required
        name="amount"
        class="mb-4"
      >
        <UInput
          type="number"
          placeholder="Amount"
        />
      </UFormGroup>

      <UFormGroup
        label="Transaction date"
        required
        name="created_at"
        class="mb-4"
      >
        <UInput
          type="date"
          icon="i-heroicons-calendar-days-20-solid"
        />
      </UFormGroup>

      <UFormGroup
        label="Description"
        hint="A short description of the transaction"
        name="description"
        class="mb-4"
      >
        <UInput placeholder="Description" />
      </UFormGroup>

      <UFormGroup
        label="Category"
        required
        name="category"
        class="mb-4"
      >
        <USelect
          :options="transactionCategories"
          placeholder="Select a category"
        />
      </UFormGroup>

      <UButton
        type="submit"
        color="black"
        variant="solid"
        label="Save"
      />
    </UCard>
  </UModal>
</template>

<script setup>
import { transactionCategories, transactionTypes } from '~/constants';

const isOpen = defineModel();
</script>
