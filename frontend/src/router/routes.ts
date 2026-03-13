export const routes = {
    map: () => '/',
    search: () => '/search',
    add: () => '/add',
    activity: () => '/activity',
    profile: () => '/profile',

    item: (id: string | number) => `/item/${id}`,
    claimed: (id: string | number) => `/claimed/${id}`,
    login: () => '/login',
    register: () => '/register',
    welcome: () => '/welcome',
    verify: () => '/verify',
}