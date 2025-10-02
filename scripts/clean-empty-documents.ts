import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials in .env.local');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// IDs des documents vides à supprimer
const emptyDocumentIds = [
  'doc_66fbcb4c477e4b0981d90948bdd7565e', // Loi portant régime financier de l'État
  'doc_9c31e6e64fd24019abc8502df57355ce', // Code Pénal Camerounais
  'doc_feac132e52b042ca98edd496d3967ec9', // Décret portant organisation du Ministère de la Justice
  'doc_68bc6436aa4744de89dcae4e1804c0dd', // Code du Travail
  'doc_acf9f5a109924d58bb4f5f8f90bb0a7b', // Code Civil (doublon)
  'doc_3d4ef3beebfd4766b0cbb1aeed8e912d', // Loi sur la protection des données personnelles
];

async function cleanEmptyDocuments() {
  console.log('🧹 Cleaning empty documents...\n');

  for (const docId of emptyDocumentIds) {
    try {
      // Supprimer les sections associées d'abord
      const { error: sectionsError } = await supabase
        .from('Section')
        .delete()
        .eq('documentId', docId);

      if (sectionsError) {
        console.error(`❌ Error deleting sections for ${docId}:`, sectionsError);
        continue;
      }

      // Supprimer le document
      const { error: docError } = await supabase
        .from('Document')
        .delete()
        .eq('id', docId);

      if (docError) {
        console.error(`❌ Error deleting document ${docId}:`, docError);
      } else {
        console.log(`✓ Deleted document: ${docId}`);
      }
    } catch (err) {
      console.error(`❌ Error processing ${docId}:`, err);
    }
  }

  console.log('\n✅ Cleanup completed!');
}

cleanEmptyDocuments();
