<script setup>
const props = defineProps(['formSuccessMessage', 'formErrorMessage'])
</script>
<template>
  <!-- !! success notif -->
  <v-alert
    class="bg-teal-lighten-5"
    v-if="props.formSuccessMessage"
    :text="props.formSuccessMessage"
    title="Success!"
    type="success"
    variant="tonal"
    density="compact"
    border="start"
    closable
  ></v-alert>

  <!-- !! error notif -->
  <v-alert
    class="bg-teal-lighten-5"
    v-if="props.formErrorMessage"
    :text="props.formErrorMessage"
    title="Ooops!"
    type="error"
    variant="tonal"
    density="compact"
    border="start"
    closable
  ></v-alert>
</template>
