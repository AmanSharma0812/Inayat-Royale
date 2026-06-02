import PocketBase from 'pocketbase';

const pb = new PocketBase('https://inayatroyalee.pockethost.io/');

async function testFetch() {
  const result = await pb.collection('contacts').getList(1, 10, {
    filter: 'message ~ "isOrder"'
  });
  console.log('Filtered orders:', result.items.length);
}

testFetch();
