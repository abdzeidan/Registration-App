<template>
  <div
    class="card text-white text-center bg-info mb-3 home"
    style="max-width: 45rem; height: 25rem; margin: auto; margin-top: 3rem;"
  >
    <h1>Welcome to Abdullah's App</h1>

    <div class="card-body" style>
      <p class="card-text">
        Please sign up to become a User.
        <br>Already have an account? Please sign in.
      </p>

      <!-- Sign In and Sign Up button is displayed here. -->
      <button type="button" class="btn btn-light">
        <router-link v-if="!auth" :to="{ name: 'signup' }">Sign Up</router-link>
      </button>
      <button type="button" class="btn btn-light">
        <router-link v-if="!auth" :to="{ name: 'signin' }">Sign In</router-link>
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      auth: "isauthenticated"
    })
  }
};
</script>


<style scoped>
h1 {
  padding-top: 2.5rem;
  color: white;
  font-weight: bold;
}

.card-body {
  padding-top: 2rem;
}

.btn-light {
  margin: 2rem;
}
</style>
