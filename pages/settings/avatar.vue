<template>
  <div>
    <div class="mb-4">
      <UFormGroup
        label="Current avatar"
        class="w-full"
        help="This would be blank by default"
      >
        <UAvatar
          src="https://avatars.githubusercontent.com/u/739984?v=4"
          size="3xl"
        />
      </UFormGroup>
    </div>

    <div class="mb-4">
      <UFormGroup
        label="New avatar"
        class="w-full"
        name="avatar"
        help="After choosing an image click Save to actually upload the new avatar"
      >
        <UInput
          type="file"
          ref="fileInput"
        />
      </UFormGroup>
    </div>

    <UButton
      type="submit"
      color="black"
      variant="solid"
      label="Save"
      :loading="uploading"
      :disabled="uploading"
      @click="saveAvatar"
    />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();

// We need to get the actual avatar URL
const { toastSuccess, toastError } = useAppToast();

const uploading = ref(false);
const fileInput = ref(); // Reference to an input with ref="fileInput" attribute

const saveAvatar = async () => {
  // 1. Get the uploaded file
  //    a) If no file uploaded, show toast error
  const file = fileInput.value.input.files[0];
  if (!file) {
    toastError({
      title: 'No file uploaded',
    });
    return;
  }
  // 2. Get the file extension - last element array after splitting by '.'
  const fileExtension = file.name.split('.').pop();
  // 3. Generate the new filename
  const fileName = `${Math.random()}.${fileExtension}`;
  console.log(user.value.user_metadata);
  try {
    uploading.value = true;

    // 1. Grab the current avatar URL
    const currentAvatar = user.value.user_metadata?.avatar_url;

    // 2. Upload the image to avatars bucket
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file);

    if (error) throw error;

    // 3. Update the user metadata with the avatar URL
    await supabase.auth.updateUser({
      data: {
        avatar_url: fileName,
      },
    });

    // 4. (OPTIONALLY) remove the old avatar file
    if (currentAvatar) {
      const { data, error } = await supabase.storage
        .from('avatars')
        .remove([currentAvatar]);
      console.log('remove:', data);
      if (error) throw error;
    }

    // 5. Reset the file input
    fileInput.value.input.value = '';

    toastSuccess({
      title: 'Avatar uploaded',
    });
  } catch (error) {
    toastError({
      title: 'Error uploading avatar',
      description: error.message,
    });
  } finally {
    uploading.value = false;
  }
};
</script>
