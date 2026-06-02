import PocketBase from 'pocketbase';

const pb = new PocketBase('https://inayatroyalee.pockethost.io/');

async function check() {
  await pb.admins.authWithPassword('admin@inayatroyale.com', 'admin123');

  const result = await pb.collection('contacts').getList(1, 10, {
    sort: '-created'
  });
  console.log('All contacts count:', result.totalItems);
  console.log('Latest contacts:');
  result.items.forEach(item => {
    console.log(item.id, item.message.substring(0, 50));
  });

  const filteredResult = await pb.collection('contacts').getList(1, 10, {
    filter: 'message ~ "isOrder"'
  });
  console.log('Filtered contacts count:', filteredResult.totalItems);
}

check().catch(console.error);
