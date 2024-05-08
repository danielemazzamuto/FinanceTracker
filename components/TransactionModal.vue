<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header> Add Transaction </template>

      <UForm
        :schema="schema"
        :state="state"
        ref="form"
        @submit="onSubmit"
      >
        <UFormGroup
          label="Type"
          required
          name="type"
          class="mb-4"
        >
          <USelect
            v-model="state.type"
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
            v-model.number="state.amount"
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
            v-model="state.created_at"
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
          <UInput
            v-model="state.description"
            placeholder="Description"
          />
        </UFormGroup>

        <UFormGroup
          label="Category"
          required
          name="category"
          class="mb-4"
        >
          <USelect
            v-model="state.category"
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
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { transactionCategories, transactionTypes } from '~/constants';
import { z } from 'zod';

const isOpen = defineModel();
const form = ref(null);

const schema = z.object({
  type: z.string(),
  amount: z.number().positive('Amount must be greater than 0'),
  created_at: z.string(),
  description: z.string().optional(),
  category: z.string(),
});

const initialState = reactive({
  type: undefined,
  amount: 0,
  created_at: undefined,
  description: undefined,
  category: undefined,
});

// we define the form state using the initial state values and then bind it to the form component
const state = reactive({
  ...initialState,
});

const resetForm = () => {
  // reset the form state
  Object.assign(state, initialState);
  // clear the form validation errors
  form.value.clear();
};

const onSubmit = async () => {
  if (form.value.errors.length) return;
  console.log('stored');
  resetForm();
  isOpen.value = false;
};
</script>
