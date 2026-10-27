export const routes = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  verifyEmail: "/verify-email",
  dashboard: "/dashboard",
  subscriptions: "/subscriptions",
  newSubscription: "/subscriptions/new",
  editSubscription: (subscriptionId: string) => `/subscriptions/${subscriptionId}/edit`,
  profile: "/profile",
} as const;
