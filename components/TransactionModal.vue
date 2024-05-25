<template>
  <UModal v-model="isOpen">
    <UCard>
      <template #header>
        {{ isEditing ? 'Edit' : 'Add' }} Transaction
      </template>

      <UForm
        :schema="schema"
        :state="state"
        ref="form"
        @submit="addTransaction"
      >
        <UFormGroup
          label="Type"
          required
          name="type"
          class="mb-4"
        >
          <USelect
            :disabled="isEditing"
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
          required
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
          :isLoading="isLoading"
        />
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup>
import { transactionCategories, transactionTypes } from '~/constants';
import { z } from 'zod';

const props = defineProps({
  transaction: {
    type: Object,
    required: false,
  },
});

const supabase = useSupabaseClient();
const { toastSuccess, toastError } = useAppToast();

const emit = defineEmits(['transactionSaved']);

// we use !! to convert the transaction prop to a boolean
const isEditing = computed(() => !!props.transaction);

const isOpen = defineModel('isOpen');
const form = ref(null);
const isLoading = ref(false);

const schema = z.object({
  type: z.string(),
  amount: z.number().positive('Amount must be greater than 0'),
  created_at: z.string(),
  description: z.string(),
  category: z.string().optional(),
});

const initialState = isEditing.value
  ? {
      type: props.transaction.type,
      amount: props.transaction.amount,
      created_at: props.transaction.created_at.split('T')[0],
      description: props.transaction.description,
      category: props.transaction.category,
    }
  : {
      type: undefined,
      amount: 0,
      created_at: undefined,
      description: undefined,
      category: undefined,
    };

// we define the form state using the initial state values and then bind it to the form component
const state = ref({ ...initialState });

const resetForm = () => {
  // reset the form state
  Object.assign(state.value, initialState.value);
  // clear the form validation errors
  form.value.clear();
};

const addTransaction = async () => {
  // check if the form has any validation errors
  if (form.value.errors.length) return;
  isLoading.value = true;

  try {
    // upsert to insert or update (if the ID is passed) the transaction
    const { error } = await supabase
      .from('transactions')
      .upsert({ ...state.value, id: props.transaction?.id });
    if (!error) {
      toastSuccess({
        title: 'Transaction saved',
      });
      resetForm();
      isOpen.value = false;
      emit('transactionSaved');
      return;
    }
    throw error;
  } catch (error) {
    toastError({
      title: 'Transaction not saved',
      description: error.message,
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
