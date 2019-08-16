<template>
  <div class="dashboard">
    <div class="info">
      <h6>Welcome to your profile dashboard {{ user.name}}!</h6>
      <h6>Your log-in email is {{ user.email}};</h6>
      <h6>Your age is {{ user.age}};</h6>
      <h6>Your city is {{user.city}};</h6>
      <h6>Your job title is a {{user.job}};</h6>
    </div>

    <form @submit.prevent="submitForm">
      <h1>Dashboard</h1>
      <h6>You may edit changes to your information below:</h6>
      <br>
      <div class="row">
        <div class="col-6">
          <label for="name">Edit your Name:</label>
          <input type="text" id="name" v-model="user.name">
        </div>
        <div class="col-6">
          <label for="city">Edit your City:</label>
          <input type="text" id="city" v-model="user.city">
        </div>
      </div>

      <div class="row">
        <div class="col-6">
          <label for="age">Edit your Age:</label>
          <input type="text" id="age" v-model="user.age">
        </div>
        <div class="col-6">
          <label for="job">Edit your Job:</label>
          <input type="text" id="job" v-model="user.job">
        </div>
      </div>
      <button type="submit" value="Submit" class="btn btn-warning">Submit</button>
    </form>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      userData: "getUser"
    }),
    user() {
      return !this.userData ? false : this.userData;
    }
  },

  created() {
    this.getUserData();
  },

  methods: {
    ...mapActions(["fetchUser", "updateUser"]),
    submitForm() {
      this.updateUser();
    },

    getUserData() {
      let userEmail = localStorage.getItem("userEmail");
      this.fetchUser(userEmail);
    }
  }
};
</script>

<style>
.dashboard {
  text-align: center;
}

.info {
  border-radius: 8px;
  padding: 2.5rem;
  margin: auto;
  text-align: left;
  margin-bottom: 2rem;
  border: 1px solid black;
  max-width: 30rem;
}
</style>
