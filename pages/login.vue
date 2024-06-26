<template>
  <UCard v-if="!success">
    <template #header> Sign-in to Finance Tracker </template>

    <form @submit.prevent="handleSubmit">
      <UFormGroup
        label="Email"
        name="email"
        class="mb-4"
        required
        help="You will receive an email with the confirmation link"
      >
        <UInput
          type="email"
          placeholder="Email"
          required
          v-model="email"
        />
      </UFormGroup>

      <UButton
        type="submit"
        variand="solid"
        color="black"
        :pending="pending"
        :disabled="pending"
      >
        Sign-in
      </UButton>
    </form>
  </UCard>

  <UCard
    class="text-center"
    v-else
  >
    <template #header> Email has been sent!</template>

    <div class="text-center">
      <p class="mb-4">
        We have sent you an email to <strong>{{ email }}</strong> with a
        confirmation link.
      </p>
      <p><strong>Important:</strong> The link will expire in 5 minutes.</p>
    </div>
  </UCard>
</template>

<script setup>
const success = ref(false);
const email = ref('');
const pending = ref(false);
const { toastSuccess, toastError } = useAppToast();
const supabase = useSupabaseClient();
const redirectUrl = useRuntimeConfig().public.baseUrl;

useRedirectIfAuthenticated();

const handleSubmit = async () => {
  pending.value = true;
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: { emailRedirectTo: `${redirectUrl}/confirm` },
    });

    if (error) {
      throw error;
    }
    toastSuccess({
      title: 'Email sent',
    });
    success.value = true;
    return data;
  } catch (error) {
    toastError({
      title: 'Error Authenticating',
      description: error.message,
    });
  } finally {
    pending.value = false;
  }
};
</script>
