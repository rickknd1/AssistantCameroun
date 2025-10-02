async function checkDocuments() {
  const response = await fetch('http://localhost:3000/api/documents');
  const data = await response.json();

  console.log('Documents analysis:\n');

  data.data.forEach(doc => {
    const contentLen = doc.content ? doc.content.length : 0;
    const isEmpty = contentLen < 100;

    console.log(`${isEmpty ? '❌ EMPTY' : '✓'} ${doc.title}`);
    console.log(`   ID: ${doc.id}`);
    console.log(`   Content length: ${contentLen} chars`);
    console.log(`   Slug: ${doc.slug}`);
    console.log('');
  });
}

checkDocuments();
