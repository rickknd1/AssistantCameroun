import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Section {
  documentId: string;
  title: string;
  content: string;
  reference: string;
  level: number;
  position: number;
}

function parseDocument(content: string, documentId: string): Section[] {
  const sections: Section[] = [];
  let position = 0;

  // Patterns pour identifier les différentes structures
  const patterns = [
    // Titres (TITRE I, TITRE II, etc.)
    {
      regex: /^(TITRE\s+[IVXLCDM]+)\s*[:\-]?\s*(.+?)$/gim,
      level: 0,
    },
    // Chapitres (CHAPITRE I, CHAPITRE 1, etc.)
    {
      regex: /^(CHAPITRE\s+(?:[IVXLCDM]+|\d+))\s*[:\-]?\s*(.+?)$/gim,
      level: 1,
    },
    // Sections (Section I, Section 1, etc.)
    {
      regex: /^(Section\s+(?:[IVXLCDM]+|\d+))\s*[:\-]?\s*(.+?)$/gim,
      level: 1,
    },
    // Articles (Article 1, Article premier, Art. 1, etc.)
    {
      regex: /^((?:Article|Art\.?)\s+(?:premier|\d+(?:\s*\w+)?))[\s:\-]*(.*?)$/gim,
      level: 2,
    },
  ];

  const lines = content.split('\n');
  let currentSection: Section | null = null;
  let contentBuffer: string[] = [];

  const saveCurrentSection = () => {
    if (currentSection && contentBuffer.length > 0) {
      currentSection.content = contentBuffer.join('\n').trim();
      if (currentSection.content) {
        sections.push(currentSection);
      }
      contentBuffer = [];
    }
  };

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    let matched = false;

    // Essayer chaque pattern
    for (const pattern of patterns) {
      const matches = trimmedLine.match(pattern.regex);
      if (matches) {
        // Sauvegarder la section précédente
        saveCurrentSection();

        // Créer une nouvelle section
        const reference = trimmedLine.split(/[:\-]/)[0].trim();
        const title = trimmedLine.substring(reference.length).replace(/^[:\-\s]+/, '').trim() || reference;

        currentSection = {
          documentId,
          title,
          content: '',
          reference,
          level: pattern.level,
          position: position++,
        };

        matched = true;
        break;
      }
    }

    if (!matched && currentSection) {
      // Ajouter au contenu de la section courante
      contentBuffer.push(line);
    } else if (!matched && !currentSection) {
      // Ignorer le texte avant la première section
      continue;
    }
  }

  // Sauvegarder la dernière section
  saveCurrentSection();

  return sections;
}

async function parseAllDocuments() {
  console.log('📚 Parsing documents and creating sections...\n');

  // Récupérer tous les documents
  const { data: documents, error: docsError } = await supabase
    .from('Document')
    .select('*');

  if (docsError) {
    console.error('Error fetching documents:', docsError);
    return;
  }

  for (const doc of documents!) {
    console.log(`\n📄 Processing: ${doc.title}`);

    // Vérifier si le document a déjà des sections
    const { data: existingSections } = await supabase
      .from('Section')
      .select('id')
      .eq('documentId', doc.id)
      .limit(1);

    if (existingSections && existingSections.length > 0) {
      console.log(`   ⏭️  Skipped (already has sections)`);
      continue;
    }

    if (!doc.content || doc.content.length < 100) {
      console.log(`   ⏭️  Skipped (no content)`);
      continue;
    }

    // Parser le document
    const sections = parseDocument(doc.content, doc.id);

    if (sections.length === 0) {
      console.log(`   ⚠️  No sections found`);
      continue;
    }

    console.log(`   Found ${sections.length} sections`);

    // Insérer les sections
    const { error: insertError } = await supabase
      .from('Section')
      .insert(sections);

    if (insertError) {
      console.error(`   ❌ Error inserting sections:`, insertError);
    } else {
      console.log(`   ✓ Successfully created ${sections.length} sections`);
    }
  }

  console.log('\n✅ Parsing completed!');
}

parseAllDocuments();
