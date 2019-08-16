import Vue from "vue";
import Vuex from "vuex";
import axiosAuth from "./axios-auth";
import router from "./router";
import globalAxios from "axios";


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    error: "",
    user: null,
  },

  mutations: {
    AUTH_USER(state, userData) {
      state.idToken = userData.token;
      state.userId = userData.userId;
    },
    SET_ERROR(state, errorMessage) {
      state.error = errorMessage;
    },
    EMPTY_ERROR(state) {
      state.error = "";
    },
    CLEAR_DATA(state) {
      state.idToken = null;
      state.userId = null;
      state.user = null;
    },
    STORE_USER(state, user) {
      state.user = user;
    }
  },


  actions: {
    signUp({
      commit,
      dispatch
    }, authData) {
      axiosAuth

        // Web API key
        // AIzaSyCHymFG8aUEXJNmH4GmjcIRuQTafl3ky_o
        // https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

        .post("accounts:signUp?key=AIzaSyCHymFG8aUEXJNmH4GmjcIRuQTafl3ky_o", {
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        })
        .then(res => {
          console.log(res);
          // Saves the auth info in the state.
          commit("AUTH_USER", {
            token: res.data.idToken,
            userId: res.data.localId
          });

          // Local Storage.
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + res.data.expiresIn * 1000
          )

          localStorage.setItem("token", res.data.idToken)
          localStorage.setItem("userId", res.data.localId)
          localStorage.setItem("userId", "expirationDate", expirationDate);
          localStorage.setItem("userEmail", authData.email);

          router.push({
            name: "dashboard"
          });

          // Dispatches the storeUser from action.
          dispatch("storeUser", authData);

          // Sets the logout timer in the end.
          dispatch("setLogoutTimer", res.data.expiresIn);

        })
        .catch(error => {
          console.log(error.response.data.error.message);
          commit("SET_ERROR", error.response.data.error.message);
        });
    },


    signIn({
      commit,
      dispatch
    }, authData) {
      axiosAuth
        .post(
          "accounts:signInWithPassword?key=AIzaSyCHymFG8aUEXJNmH4GmjcIRuQTafl3ky_o", {
            email: authData.email,
            password: authData.password,
            returnSecureToken: true
          }
        )
        .then(res => {
          console.log(res);
          commit("AUTH_USER", {
            token: res.data.idToken,
            userId: res.data.localId
          });

          // Local Storage.
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + res.data.expiresIn * 1000
          );

          localStorage.setItem("token", res.data.idToken)
          localStorage.setItem("userId", res.data.localId)
          localStorage.setItem("userId", "expirationDate", expirationDate);

          // Stores the user email in the localStorage, which is the common item between authendiacation and database.
          localStorage.setItem("userEmail", authData.email);

          router.push({
            name: "dashboard"
          });

          // Sets the logout timer to automatically call logout action when token expires.
          dispatch("setLogoutTimer", res.data.expiresIn);
        })
        .catch(error => {
          console.log(error.response.data.error.message);
          commit("SET_ERROR", error.response.data.error.message);
        });
    },

    // Setting the logout timer based on the expiration time
    setLogoutTimer({
      dispatch
    }, expirationTime) {
      setTimeout(() => {
        // Dispatches logout action when the expiration time is complete.
        dispatch("logout");
      }, expirationTime * 1000);
    },

    logout({
      commit
    }) {
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');
      localStorage.removeItem('userId');
      localStorage.removeItem("userEmail");

      // Commits the Mutation to clear the state.
      commit("CLEAR_DATA");
      // Sends the user to sign in.
      router.push({
        name: "signin"
      });
    },


    clearError({
      commit
    }) {
      commit('EMPTY_ERROR');
    },

    // Allow users to stay logged in when refreshing the app.
    autoLogin({
      commit
    }) {
      // Receives the token and expiration from the localStorage.
      const token = localStorage.getItem('token');
      const expirationDate = localStorage.getItem('expirationDate');
      const userId = localStorage.getItem('userId');

      const now = new Date()
      if (now >= expirationDate) {
        return;
      }
      commit("AUTH_USER", {
        token: token,
        userId: userId
      });
    },

    // When the user is logged in, the data will be stored in the database. E-mail and the password will additionally be stored in the authentication.
    storeUser({
      state
    }, userData) {
      if (!state.idToken) {
        return;
      }
      globalAxios
        .post("https://zeid0012-final.firebaseio.com/users.json" +
          "?auth=" +
          state.idToken,
          userData
        )
        .then(res => console.log(res))
        .catch(error => console.log(error.message));
    },

    // Fetches the user information from the database this action is dispatched from the Dashboard.
    fetchUser({
      commit,
      state
    }, userEmail) {
      if (!state.idToken) {
        return;
      }
      globalAxios
        .get("https://zeid0012-final.firebaseio.com/users.json" +
          "?auth=" +
          state.idToken
        )
        .then(res => {
          const data = res.data;

          for (let key in data) {
            const user = data[key];
            if (user.email == userEmail) {
              console.log(user);
              user.id = key;
              commit("STORE_USER", user);
            }
          }
        })
        .catch(error => console.log(error.response));
    },

    updateUser({
      state
    }) {
      console.log(state.user.id);
      globalAxios
        .patch("https://zeid0012-final.firebaseio.com/users/" +
          state.user.id +
          ".json" +
          "?auth=" +
          state.idToken, {
            name: state.user.name,
            city: state.user.city,
            age: state.user.age,
            job: state.user.job,
          },
        )
        .then(res => {
          console.log(res);
        })
        .catch(error => console.log(error.response))
    },

  },

  getters: {
    isauthenticated(state) {
      return state.idToken !== null;
    },
    getUser(state) {
      return state.user;
    }
  }
});