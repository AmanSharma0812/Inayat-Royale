import PocketBase from 'pocketbase';

const pb = new PocketBase('https://inayatroyalee.pockethost.io/');

async function testOrder() {
  try {
    const orderPayload = {
      isOrder: true,
      address: 'Test Address',
      pincode: '123456',
      items: [{ id: '123', name: 'Test Product', price: 1000, quantity: 1 }],
      total: 1000
    };

    console.log('Sending order payload:', JSON.stringify(orderPayload));
    
    const record = await pb.collection('contacts').create({
      name: 'Test User',
      phone: '9876543210',
      message: JSON.stringify(orderPayload),
      status: 'new'
    });

    console.log('Order created successfully!', record.id);
  } catch (error) {
    console.error('Error creating order:', error?.response || error);
  }
}

testOrder();
