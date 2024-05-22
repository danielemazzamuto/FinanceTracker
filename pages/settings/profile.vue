<template>
  <UForm
    :schema="schema"
    :state="state"
    @submit="saveProfile"
  >
    <UFormGroup
      label="Full Name"
      name="name"
      class="mb-4"
    >
      <UInput v-model="state.name" />
    </UFormGroup>

    <UFormGroup
      label="Email"
      help="You will receive a confirmation email on both old and new email addresses."
      name="email"
      class="mb-4"
    >
      <UInput v-model="state.email" />
    </UFormGroup>

    <UButton
      type="submit"
      :loading="pending"
      :disabled="pending"
      color="black"
      label="Save"
      class="mt-4"
    >
      Save
    </UButton>
  </UForm>
</template>

<script setup>
import { z } from 'zod';

const supabase = useSupabaseClient();
const user = useSupabaseUser();

const pending = ref(false);
const { toastSuccess, toastError } = useAppToast();

const state = reactive({
  name: user.value.user_metadata?.full_name,
  email: user.value.email,
});

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').optional(),
  email: z.string().email('Invalid email address'),
});

const saveProfile = async () => {
  pending.value = true;

  try {
    // Update user metadata
    const data = {
      data: {
        full_name: state.name,
      },
    };

    // Update email only if it has changed
    if (state.email !== user.value.email) {
      data.email = state.email;
    }

    const { error } = await supabase.auth.updateUser(data);

    if (error) throw error;

    toastSuccess({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully.',
    });
  } catch (error) {
    toastError({
      title: 'Error saving profile',
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>
