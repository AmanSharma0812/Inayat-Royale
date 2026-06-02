import PocketBase from 'pocketbase';

const pb = new PocketBase('https://inayatroyalee.pockethost.io/');

async function checkOrders() {
  const result = await pb.collection('contacts').getList(1, 50, {
    filter: 'message ~ "isOrder"'
  });
  
  console.log(`Found ${result.items.length} orders matching 'isOrder' filter.`);
  
  let validJSONCount = 0;
  result.items.forEach((item, index) => {
    console.log(`\n--- Order ${index + 1} ---`);
    console.log(`Name: ${item.name}`);
    console.log(`Message: ${item.message.substring(0, 50)}...`);
    try {
      const parsed = JSON.parse(item.message);
      validJSONCount++;
      console.log(`JSON parsing: SUCCESS, isOrder = ${parsed.isOrder}`);
    } catch (e) {
      console.log(`JSON parsing: FAILED - ${e.message}`);
    }
  });
  
  console.log(`\nValid JSON objects: ${validJSONCount} / ${result.items.length}`);
}

checkOrders();
