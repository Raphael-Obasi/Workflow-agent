let storage = [];

export function saveRecord(data) {
  storage.push({
    id: storage.length + 1,
    ...data,
    createdAt: new Date(),
  });

  return data;
}

export function getAll() {
  return storage;
}
