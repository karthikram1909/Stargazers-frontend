const BASE_URL = '/api';

export const api = {
    stars: {
        list: async () => {
            const res = await fetch(`${BASE_URL}/stars`);
            if (!res.ok) throw new Error('Failed to fetch stars');
            return res.json();
        },
        create: async (data) => {
            const res = await fetch(`${BASE_URL}/stars`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create star');
            return res.json();
        },
        update: async (id, data) => {
            const res = await fetch(`${BASE_URL}/stars/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update star');
            return res.json();
        },
        delete: async (id) => {
            const res = await fetch(`${BASE_URL}/stars/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete star');
            return res.json();
        }
    },
    planets: {
        list: async () => {
            const res = await fetch(`${BASE_URL}/planets`);
            if (!res.ok) throw new Error('Failed to fetch planets');
            return res.json();
        },
        create: async (data) => {
            const res = await fetch(`${BASE_URL}/planets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create planet');
            return res.json();
        },
        update: async (id, data) => {
            const res = await fetch(`${BASE_URL}/planets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update planet');
            return res.json();
        },
        delete: async (id) => {
            const res = await fetch(`${BASE_URL}/planets/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete planet');
            return res.json();
        }
    },
    constellations: {
        list: async () => {
            const res = await fetch(`${BASE_URL}/constellations`);
            if (!res.ok) throw new Error('Failed to fetch constellations');
            return res.json();
        },
        create: async (data) => {
            const res = await fetch(`${BASE_URL}/constellations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to create constellation');
            return res.json();
        },
        update: async (id, data) => {
            const res = await fetch(`${BASE_URL}/constellations/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error('Failed to update constellation');
            return res.json();
        },
        delete: async (id) => {
            const res = await fetch(`${BASE_URL}/constellations/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete constellation');
            return res.json();
        }
    }
};
