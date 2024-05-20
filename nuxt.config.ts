// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/supabase'],
  supabase: {
    // redirect to login page if user is not authenticated
    redirect: true,
  },
});
