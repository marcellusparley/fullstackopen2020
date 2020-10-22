import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

const getNumbers = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
}

const createNumber = (newNumber) => {
    const request = axios.post(baseUrl, newNumber);
    return request.then(res => res.data);
}

const updateNumber = (id, newNumber) => {
    const request = axios.put(`${baseUrl}/${id}`, newNumber);
    return request.then(res => res.data);
}

const deleteNumber = id => {
    const request = axios.delete(`${baseUrl}/${id}`);
    return request.then(res => res.data);
}

export default { getNumbers, createNumber, updateNumber, deleteNumber};