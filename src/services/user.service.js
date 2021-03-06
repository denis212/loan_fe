import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://178.128.222.35:9100/loan-engine-web-services/api/test/';


const API_URLX = 'http://178.128.222.35:9100/loan-engine-web-services/api/dashboard/dummy';

class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  getDashboard1() {
    return axios.get(API_URLX+ 'user', { headers: authHeader() });
  }

  getDashboard2() {
    return axios.get(API_URLX+ 'mod', { headers: authHeader() });
  }

  getDashboard3() {
    return axios.get(API_URLX+ 'admin', { headers: authHeader() });
  }
}

export default new UserService();
