export const routes = {
    map: () => '/app',
    search: () => '/app/search',
    add: () => '/app/add',
    activity: () => '/app/activity',
    profile: () => '/app/profile',

    item: (id: string | number) => `/app/item/${id}`,
    claimed: (id: string | number) => `/app/claimed/${id}`,
    login: () => '/login',
    register: () => '/register',
    welcome: () => '/welcome',
    verify: () => '/verify',
}