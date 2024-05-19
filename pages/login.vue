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

  <UCard v-else>
    <template #header> Email has been sent. </template>

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
const toast = useToast();
const supabase = useSupabaseClient();

useRedirectIfAuthenticated();

const handleSubmit = async () => {
  pending.value = true;
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email.value,
      options: { redirectTo: 'http://localhost:3000/confirm' },
    });

    if (error) {
      throw error;
    }
    toast.add({
      title: 'Email sent',
      icon: 'i-heroicons-check-circle',
    });
    success.value = true;
    return data;
  } catch (error) {
    toast.add({
      title: 'Error Authenticating',
      description: error.message,
      icon: 'i-heroicons-exclamation-circle',
      color: 'red',
    });
  } finally {
    pending.value = false;
  }
};
</script>
