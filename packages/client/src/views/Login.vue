<template>
  <div class="h-full w-full flex flex-col justify-center">
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
import { getModule } from "vuex-module-decorators";
import AuthModule from "@/store/modules/auth";
import { useStore } from "@/store";
// Prop and prop interface

// Use hooks
const auth = getModule(AuthModule, useStore());

// Data
const username = ref("");
const password = ref("");
const loading = ref(false);

// Computed

// Methods

const handleLogin = async (e: Event) => {
  e.preventDefault();
  loading.value = true;
  try {
    const res = await axios.post("/auth/login", {
      username: username.value,
      password: password.value
    });
    console.log(res);
  } catch (e) {
    console.log(e);
  } finally {
    window.location.href = "/";
  }
};

// Watchers
</script>
<style scoped lang="postcss"></style>
