import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8091');

async function setup() {
  try {
    console.log('Authenticating...');
    await pb.collection('_superusers').authWithPassword('admin@inayatroyale.com', 'admin123');
    console.log('✓ Authenticated!\n');

    // ---- 1. CREATE categories ----
    console.log('Creating "categories" collection...');
    let categoriesCollection;
    try {
      categoriesCollection = await pb.collections.create({
        name: 'categories',
        type: 'base',
        fields: [
          { name: 'name',        type: 'text', required: true },
          { name: 'description', type: 'text' },
        ],
        listRule:   '',
        viewRule:   '',
        createRule: '@request.auth.id != ""',
        updateRule: '@request.auth.id != ""',
        deleteRule: '@request.auth.id != ""'
      });
      console.log('✓ categories created! id =', categoriesCollection.id);
    } catch (e) {
      // Already exists — fetch it
      categoriesCollection = await pb.collections.getOne('categories');
      console.log('✓ categories already exists, id =', categoriesCollection.id);
    }

    // ---- 2. CREATE products ----
    console.log('\nCreating "products" collection...');
    try {
      await pb.collections.create({
        name: 'products',
        type: 'base',
        fields: [
          { name: 'name',        type: 'text',   required: true },
          { name: 'description', type: 'text' },
          {
            name:          'category',
            type:          'relation',
            required:      false,
            collectionId:  categoriesCollection.id,
            cascadeDelete: false,
            minSelect:     null,
            maxSelect:     1
          },
          { name: 'price', type: 'number' },
          {
            name:      'image',
            type:      'file',
            required:  false,
            maxSelect: 1,
            maxSize:   5242880,
            mimeTypes: ['image/jpeg','image/png','image/svg+xml','image/gif','image/webp']
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
      console.log('✓ products already exists');
    }

    // ---- 3. CREATE contacts ----
    console.log('\nCreating "contacts" collection...');
    try {
      await pb.collections.create({
        name: 'contacts',
        type: 'base',
        fields: [
          { name: 'name',    type: 'text', required: true },
          { name: 'phone',   type: 'text' },
          { name: 'message', type: 'text' },
          {
            name:      'status',
            type:      'select',
            maxSelect: 1,
            values:    ['new','read']
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
      console.log('✓ contacts already exists');
    }

    console.log('\n✅ Setup complete! You can now log in at http://localhost:3000/admin-login');
    console.log('   Email:    admin@inayatroyale.com');
    console.log('   Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Setup failed:', err.response || err.message || err);
    process.exit(1);
  }
}

setup();
