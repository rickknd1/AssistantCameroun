#!/usr/bin/env tsx
/**
 * NETTOYAGE AUTOMATIQUE DU PROJET
 * Supprime les fichiers inutiles
 */

import fs from 'fs'
import path from 'path'

const filesToDelete = {
  images: [
    './image copy 2.png',
    './image copy 3.png',
    './image copy.png',
    './image.png',
  ],
  pdfs: [
    './Cameroun-Code-2016-penal1.pdf', // PDF scanné inutilisable
    './Code-du-Travail-au-Cameroun.pdf', // Déjà importé
    './Décret N°2025059 du 28 février 2025 fixant les caractéristiques et les modalités d\'établissement et de délivrance des titres identitaires.pdf',
    './loi de finance 2025.pdf',
    './docs/pdfs-officiels/150.12.06-Loi-du-29-decembre-2006_Organisation-judiciaire.pdf', // Contenu trop court
    './docs/pdfs-officiels/add-1833 (1).pdf', // Doublon
  ],
  markdownGuides: [
    './AMELIORATIONS_BIBLIOTHEQUE.md',
    './AMELIORATIONS_SECURITE_UI.md',
    './AMELIORATIONS_SOURCES_CHATBOT.md',
    './AUDIT_SECURITE.md',
    './CHARGEMENT_SYNCHRONE.md',
    './CORRECTIONS_CHATBOT.md',
    './CORRECTIONS_CHATBOT_FINAL.md',
    './ENREGISTREMENT_MESSAGES_BD.md',
    './INTEGRATION_LOGO.md',
    './MISE_A_JOUR_CNI_2025.md',
    './NEXT_STEPS.md',
    './PROCEDURES_2025_COMPLET.md',
    './PRODUCTION_READY.md',
    './RAPPORT_FINAL_OCTOBRE_2025.md',
    './RAPPORT_IMPORT_ET_VERIFICATION.md',
    './README_RECHERCHE_WEB.md',
    './RESUME_FINAL_TOUTES_MISES_A_JOUR.md',
    './TEST_CHATBOT_SOURCES.md',
    './docs/references/AUDIT_PROJET_FINAL.md',
    './docs/references/CORRECTION_ASSISTANT_IA.md',
    './docs/references/NOUVEAU_SYSTEME_ASSISTANT.md',
  ],
  obsoleteScripts: [
    './scripts/analyze-loi-finances-sections.ts',
    './scripts/analyze-sections.ts',
    './scripts/check-all-documents-status.ts',
    './scripts/check-code-penal-content.ts',
    './scripts/check-code-penal.ts',
    './scripts/check-constitution-sections.ts',
    './scripts/check-constitution.ts',
    './scripts/check-difficulty-values.ts',
    './scripts/check-loi-finances.ts',
    './scripts/check-prices-info.ts',
    './scripts/check-procedure-schema.ts',
    './scripts/check-procedure-structure.ts',
    './scripts/check-quiz-data.ts',
    './scripts/check-section-schema.ts',
    './scripts/clean-empty-documents.ts',
    './scripts/convert-and-import-quiz.ts',
    './scripts/extract-info-from-decret.ts',
    './scripts/extract-loi-finances-info.ts',
    './scripts/fix-analytics-constraint.ts',
    './scripts/fix-code-justice-admin.ts',
    './scripts/fix-code-penal-empty-sections.ts',
    './scripts/fix-constitution-formatting.ts',
    './scripts/fix-loi-finances-empty.ts',
    './scripts/fix_analytics_constraint.sql',
    './scripts/ADD_feedback_status_column.sql',
    './scripts/sample-code-justice-admin.ts',
    './scripts/test-cm-code-penal.ts',
    './scripts/test-pdf-extraction.ts',
    './scripts/reimport-code-penal.ts',
    './scripts/reimport-code-penal-correct.ts',
  ]
}

function deleteFiles(category: string, files: string[]) {
  console.log(`\n🗑️  Nettoyage: ${category}`)
  console.log('=' .repeat(60))

  let deleted = 0
  let notFound = 0

  for (const file of files) {
    const fullPath = path.resolve(file)

    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath)
        console.log(`   ✅ Supprimé: ${file}`)
        deleted++
      } catch (error: any) {
        console.log(`   ❌ Erreur: ${file} - ${error.message}`)
      }
    } else {
      console.log(`   ⚠️  Non trouvé: ${file}`)
      notFound++
    }
  }

  console.log(`\n   Total: ${deleted} supprimés, ${notFound} non trouvés`)
}

function cleanProject() {
  console.log('🧹 NETTOYAGE DU PROJET')
  console.log('=' .repeat(60) + '\n')

  const totalFiles =
    filesToDelete.images.length +
    filesToDelete.pdfs.length +
    filesToDelete.markdownGuides.length +
    filesToDelete.obsoleteScripts.length

  console.log(`📊 Fichiers à nettoyer: ${totalFiles}`)
  console.log(`   - Images: ${filesToDelete.images.length}`)
  console.log(`   - PDFs: ${filesToDelete.pdfs.length}`)
  console.log(`   - Guides MD: ${filesToDelete.markdownGuides.length}`)
  console.log(`   - Scripts obsolètes: ${filesToDelete.obsoleteScripts.length}`)

  deleteFiles('Images inutiles', filesToDelete.images)
  deleteFiles('PDFs inutilisés', filesToDelete.pdfs)
  deleteFiles('Guides MD obsolètes', filesToDelete.markdownGuides)
  deleteFiles('Scripts obsolètes', filesToDelete.obsoleteScripts)

  console.log('\n' + '=' .repeat(60))
  console.log('✅ NETTOYAGE TERMINÉ!')
  console.log('=' .repeat(60))
}

cleanProject()
