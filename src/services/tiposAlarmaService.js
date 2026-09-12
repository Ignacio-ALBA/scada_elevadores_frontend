// frontend/src/services/tiposAlarmaService.js
import api from './api';

export const tiposAlarmaService = {
    getAll: async () => {
        const response = await api.get('/tipos-alarma/');
        return response.data;
    }
};