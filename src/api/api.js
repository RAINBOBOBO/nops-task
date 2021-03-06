import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class nopsTaskApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${nopsTaskApi.token}` };
    const params = (method === "get")
        ? data
        : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

  /** Get the current user. */

  static async getCurrentUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Get token for login from username, password. */

  static async login(data) {
    let res = await this.request(`auth/token`, data, "post");
    return res.token;
  }

  /** Signup for site. */

  static async signup(data) {
    let res = await this.request(`auth/register`, data, "post");
    return res.token;
  }

  /** Login with google */

  static async googleLogin(data) {
    let res = await this.request(`auth/google`, data, "post");
    return res.token;
  }

  /** Get all favorites for a user */

  static async getFavorites(username) {
    let res = await this.request(`users/${username}/favorites`);
    // console.log("inside API file, getting faves", res.favorites);
    return res.favorites;
  }

  /** Favorite a code. */

  static async addFavorite(username, countryCode) {
    let res = await this.request(`users/${username}/favorites`, { countryCode }, "post");
    return res.favorited;
  }

  /** Un-favorite a code. */

  static async removeFavorite(username, countryCode) {
    let res = await this.request(`users/${username}/favorites`, { countryCode }, "delete");
    return res.deleted;
  }
}


export default nopsTaskApi;
