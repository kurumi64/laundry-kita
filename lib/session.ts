import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'laundry_token';
const USER_KEY = 'laundry_user';

export async function saveSession(token: string, userName: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(USER_KEY, userName);
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

export async function getSession() {
  const [token, user] = await Promise.all([
    SecureStore.getItemAsync(TOKEN_KEY),
    SecureStore.getItemAsync(USER_KEY),
  ]);
  return { token, user };
}
