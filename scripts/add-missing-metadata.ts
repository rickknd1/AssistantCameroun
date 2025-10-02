#!/usr/bin/env tsx
/**
 * AJOUT DES MÉTADONNÉES MANQUANTES
 * Tags et résumés pour tous les documents
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function addMissingMetadata() {
  console.log('🏷️  Ajout des métadonnées manquantes...\n')

  const metadata: { [slug: string]: { tags: string[], summary?: string } } = {
    'arrete-n-1833': {
      tags: ['arrêté', 'droit administratif', 'cameroun'],
      summary: 'Arrêté fixant les modalités d\'application de certaines dispositions administratives.'
    },
    'code-civil-camerounais': {
      tags: ['code civil', 'droit civil', 'personnes', 'biens', 'obligations', 'cameroun'],
      summary: 'Code Civil du Cameroun régissant les personnes, les biens, les obligations et les contrats.'
    },
    'code-de-justice-administrative': {
      tags: ['code', 'justice administrative', 'droit administratif', 'contentieux', 'cameroun'],
      summary: 'Code régissant l\'organisation et le fonctionnement de la justice administrative au Cameroun.'
    },
    'code-penal-camerounais': {
      tags: ['code pénal', 'droit pénal', 'infractions', 'peines', 'sanctions', 'justice', 'cameroun'],
      summary: 'Code Pénal du Cameroun définissant les infractions, les peines et les sanctions pénales applicables au Cameroun.'
    },
  }

  for (const [slug, meta] of Object.entries(metadata)) {
    const { error } = await supabase
      .from('Document')
      .update({
        tags: meta.tags,
        ...(meta.summary ? { summary: meta.summary } : {}),
        updatedAt: new Date().toISOString()
      })
      .eq('slug', slug)

    if (error) {
      console.error(`❌ Erreur pour ${slug}:`, error.message)
    } else {
      console.log(`✅ ${slug}`)
      console.log(`   Tags: ${meta.tags.join(', ')}`)
    }
  }

  console.log('\n✅ Métadonnées ajoutées!')
}

addMissingMetadata().catch(console.error)
