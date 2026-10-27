export const routes = {
  home: "/",
  dashboard: "/dashboard",
  subscriptions: "/subscriptions",
  newSubscription: "/subscriptions/new",
  editSubscription: (subscriptionId: string) => `/subscriptions/${subscriptionId}/edit`,
  profile: "/profile",
} as const;
