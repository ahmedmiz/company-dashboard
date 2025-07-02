const isAuthenticated = () => {
    return !!localStorage.getItem('accessToken');
};

const logout = () => {
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
};

export { isAuthenticated, logout }