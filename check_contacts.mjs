import PocketBase from 'pocketbase';

const pb = new PocketBase('https://inayatroyalee.pockethost.io/');

async function check() {
  try {
    const result = await pb.collection('contacts').getList(1, 500, {
      sort: '-id',
      filter: 'message ~ "isOrder"',
      requestKey: null
    });
    console.log('Total items fetched:', result.items.length);
    if (result.items.length > 0) {
      console.log('First order ID:', result.items[0].id);
      console.log('First order message:', result.items[0].message);
    }
  } catch (err) {
    console.error('Query failed:', err.message || err);
  }
}

check().catch(console.error);
