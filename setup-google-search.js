const readline = require('readline');
const fs = require('fs');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🔍 CONFIGURATION GOOGLE CUSTOM SEARCH API\n');
  console.log('=' .repeat(60));

  // Étape 1: Instructions
  console.log('\n📋 ÉTAPE 1: Créer un Custom Search Engine\n');
  console.log('1. Je vais ouvrir le site Google Programmable Search');
  console.log('2. Connectez-vous avec votre compte Google');
  console.log('3. Cliquez sur "Add" ou "Créer"');
  console.log('4. Configuration:');
  console.log('   - Sites à rechercher: Laissez vide');
  console.log('   - Cochez "Search the entire web"');
  console.log('   - Nom: "AssistantCameroun Search"');
  console.log('   - Langue: Français');
  console.log('5. Cliquez sur "Create"');
  console.log('6. Copiez le "Search engine ID" (code alphanumérique)\n');

  const openBrowser = await question('Voulez-vous ouvrir le navigateur maintenant? (o/n): ');

  if (openBrowser.toLowerCase() === 'o') {
    console.log('\n🌐 Ouverture du navigateur...\n');
    try {
      execSync('start https://programmablesearchengine.google.com/controlpanel/all', { shell: true });
    } catch (e) {
      console.log('Veuillez ouvrir manuellement: https://programmablesearchengine.google.com/controlpanel/all');
    }
  } else {
    console.log('\n🌐 Allez sur: https://programmablesearchengine.google.com/controlpanel/all\n');
  }

  // Étape 2: Récupérer l'ID
  console.log('\n📋 ÉTAPE 2: Entrer le Search Engine ID\n');
  const searchEngineId = await question('Collez votre Search Engine ID ici: ');

  if (!searchEngineId || searchEngineId.trim() === '' || searchEngineId === 'your_search_engine_id_here') {
    console.log('\n❌ ID invalide. Veuillez réessayer.');
    rl.close();
    return;
  }

  // Étape 3: Mettre à jour .env
  console.log('\n📝 ÉTAPE 3: Mise à jour du fichier .env...\n');

  const envPath = '.env';
  let envContent = fs.readFileSync(envPath, 'utf8');

  // Remplacer l'ancien ID
  envContent = envContent.replace(
    /GOOGLE_SEARCH_ENGINE_ID=.*/,
    `GOOGLE_SEARCH_ENGINE_ID=${searchEngineId.trim()}`
  );

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Fichier .env mis à jour!\n');

  // Étape 4: Tester
  console.log('📋 ÉTAPE 4: Test de l\'API...\n');

  const API_KEY = process.env.GOOGLE_SEARCH_API_KEY || 'AIzaSyAoW9PQLCDIDvjdEKBh8X_MoMvYo_ko6A0';
  const query = encodeURIComponent('candidats présidentielle cameroun 2025');
  const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${searchEngineId.trim()}&q=${query}&num=3`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.log('❌ Erreur API:', data.error.message);
      console.log('   Code:', data.error.code);

      if (data.error.code === 400) {
        console.log('\n💡 Vérifiez que:');
        console.log('   1. Le Search Engine ID est correct');
        console.log('   2. "Search the entire web" est activé');
        console.log('   3. Le moteur de recherche est bien créé');
      }

      rl.close();
      return;
    }

    if (!data.items || data.items.length === 0) {
      console.log('⚠️ Aucun résultat (mais l\'API fonctionne)');
    } else {
      console.log(`✅ ${data.items.length} résultats trouvés:\n`);
      data.items.forEach((item, i) => {
        console.log(`${i + 1}. ${item.title}`);
        console.log(`   ${item.snippet.substring(0, 80)}...`);
        console.log(`   ${item.link}\n`);
      });
    }

    console.log('=' .repeat(60));
    console.log('✅ CONFIGURATION TERMINÉE AVEC SUCCÈS!');
    console.log('\n📌 Prochaines étapes:');
    console.log('   1. Redémarrez le serveur: npm run dev');
    console.log('   2. Testez avec une question d\'actualité dans le chatbot');
    console.log('=' .repeat(60));

  } catch (error) {
    console.log('❌ Erreur réseau:', error.message);
  }

  rl.close();
}

setup().catch(console.error);
