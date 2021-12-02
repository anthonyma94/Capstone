<template>
  <div class="h-full w-full flex flex-col justify-center">
    <span class="text-danger" v-if="error"
      >The username or password is incorrect. Please try again.</span
    >
    <form @submit="handleLogin" class="flex flex-col gap-3 w-full">
      <Input placeholder="Username" v-model="username" />
      <Input placeholder="Password" type="password" v-model="password" />
      <Button type="submit" block :loading="loading">Login</Button>
    </form>
  </div>
</template>
<script setup lang="ts">
import Input from "@/components/inputs/Input.vue";
import { ref } from "vue-demi";
import Button from "@/components/Button.vue";
import axios from "@/services/axios";
// Prop and prop interface

// Use hooks

// Data
const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref(false);

// Computed

// Methods

const handleLogin = async (e: Event) => {
  e.preventDefault();
  loading.value = true;
  try {
    await axios.post("/auth/login", {
      username: username.value,
      password: password.value
    });

    window.location.href = "/";
  } catch (e) {
    error.value = true;
    loading.value = false;
  }
};

// Watchers
</script>
<style scoped lang="postcss"></style>
