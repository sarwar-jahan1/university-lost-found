import { getCurrentUser } from "../services/authService";

// The API does not say who reported an item, so this device remembers the
// ids of the items the signed-in user reported from here. They get
// Edit / Delete buttons and appear on the "My Reports" page.

const storageKey = () => {
  const user = getCurrentUser();
  return `campus_my_items_${user?.id ?? user?.email ?? "anon"}`;
};

export const getMyItemIds = () => {
  try {
    const list = JSON.parse(localStorage.getItem(storageKey()));
    return Array.isArray(list) ? list.map(String) : [];
  } catch {
    return [];
  }
};

const save = (ids) => {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(ids));
  } catch {
    // storage unavailable: the item simply won't be remembered
  }
};

export const addMyItemId = (id) => {
  const ids = getMyItemIds();
  const value = String(id);

  if (!ids.includes(value)) save([...ids, value]);
};

export const removeMyItemId = (id) => {
  save(getMyItemIds().filter((value) => value !== String(id)));
};

export const isMyItem = (id) => getMyItemIds().includes(String(id));
