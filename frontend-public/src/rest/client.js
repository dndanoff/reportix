import axios from 'axios';
import { config } from '../config';

const baseClient = axios.create({
    baseURL: config.backend.url,
});

export const restClient = ({ ...options }) => baseClient(options);
