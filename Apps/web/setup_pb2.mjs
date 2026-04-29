import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8091');

async function setup() {
  try {
    console.log('Authenticating...');
    await pb.collection('_superusers').authWithPassword('admin@inayatroyale.com', 'admin123');
    console.log('Authenticated successfully!');

    // Get categories collection id (already created)
    let categoriesCollection;
    try {
      categoriesCollection = await pb.collections.getOne('categories');
      console.log('Found categories collection, id =', categoriesCollection.id);
    } catch (e) {
      console.error('Could not find categories collection!');
      throw e;
    }

    // ---- DELETE and recreate products ----
    try {
      const existing = await pb.collections.getOne('products');
      await pb.collections.delete(existing.id);
      console.log('Deleted existing products collection');
    } catch (e) {}

    console.log('\nCreating "products" collection...');
    try {
      await pb.collections.create({
        name: 'products',
        type: 'base',
        fields: [
          { name: 'name',        type: 'text', required: true },
          { name: 'description', type: 'text' },
          {
            name:             'category',
            type:             'relation',
            required:         false,
            collectionId:     categoriesCollection.id,
            cascadeDelete:    false,
            minSelect:        null,
            maxSelect:        1
          },
          { name: 'price', type: 'number' },
          {
            name:      'image',
            type:      'file',
            required:  false,
            maxSelect: 1,
            maxSize:   5242880,
            mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp']
          }
        ],
        listRule:   '',
        viewRule:   '',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id != ""',
        deleteRule: '@request.auth.id != ""'
      });
      console.log('✓ products created!');
    } catch (e) {
      console.error('products FAILED:', JSON.stringify(e?.response?.data, null, 2));
    }

    // ---- DELETE and recreate contacts ----
    try {
      const existing = await pb.collections.getOne('contacts');
      await pb.collections.delete(existing.id);
      console.log('Deleted existing contacts collection');
    } catch (e) {}

    console.log('\nCreating "contacts" collection...');
    try {
      await pb.collections.create({
        name: 'contacts',
        type: 'base',
        fields: [
          { name: 'name',    type: 'text',  required: true },
          { name: 'phone',   type: 'text' },
          { name: 'message', type: 'text' },
          {
            name:      'status',
            type:      'select',
            maxSelect: 1,
            values:    ['new', 'read']
          }
        ],
        listRule:   '@request.auth.id != ""',
        viewRule:   '@request.auth.id != ""',
        createRule: '',
        updateRule: '@request.auth.id != ""',
        deleteRule: '@request.auth.id != ""'
      });
      console.log('✓ contacts created!');
    } catch (e) {
      console.error('contacts FAILED:', JSON.stringify(e?.response?.data, null, 2));
    }

    console.log('\n✅ Setup complete!');
  } catch (err) {
    console.error('\n❌ Setup failed:', err.response || err.message || err);
    process.exit(1);
  }
}

setup();
