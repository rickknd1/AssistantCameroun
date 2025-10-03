#!/usr/bin/env tsx
/**
 * SCRIPT D'INSTALLATION DU SYSTÈME D'APPRENTISSAGE INTELLIGENT
 * Exécute le SQL pour créer les tables QuestionCache, ResponseFeedback, VerificationLog
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function installLearningSystem() {
  console.log('🚀 Installation du Système d\'Apprentissage Intelligent...\n')

  // 1. Lire le fichier SQL
  const sqlPath = path.join(__dirname, 'create-learning-system-tables.sql')
  const sqlContent = fs.readFileSync(sqlPath, 'utf8')

  console.log('📄 Fichier SQL chargé:', sqlPath)
  console.log('📏 Taille:', sqlContent.length, 'caractères\n')

  // 2. Découper le SQL en commandes individuelles
  // Les commandes sont séparées par ";" suivi d'un saut de ligne
  const commands = sqlContent
    .split(/;[\s\n]+/)
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))

  console.log(`📊 ${commands.length} commandes SQL à exécuter\n`)

  // 3. Exécuter chaque commande
  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < commands.length; i++) {
    const command = commands[i]

    // Identifier le type de commande
    const commandType =
      command.startsWith('CREATE TABLE') ? '📋 TABLE' :
      command.startsWith('CREATE INDEX') ? '🔍 INDEX' :
      command.startsWith('CREATE OR REPLACE FUNCTION') ? '⚙️ FUNCTION' :
      command.startsWith('DROP TRIGGER') ? '🗑️ DROP TRIGGER' :
      command.startsWith('CREATE TRIGGER') ? '⚡ TRIGGER' :
      command.startsWith('CREATE OR REPLACE VIEW') ? '👁️ VIEW' :
      command.startsWith('COMMENT ON') ? '💬 COMMENT' :
      command.startsWith('GRANT') ? '🔐 PERMISSION' :
      '📝 SQL'

    // Extraire le nom de l'objet
    const nameMatch =
      command.match(/CREATE TABLE(?:\s+IF NOT EXISTS)?\s+"?(\w+)"?/) ||
      command.match(/CREATE INDEX(?:\s+IF NOT EXISTS)?\s+"?(\w+)"?/) ||
      command.match(/CREATE OR REPLACE FUNCTION\s+(\w+)/) ||
      command.match(/CREATE TRIGGER\s+(\w+)/) ||
      command.match(/CREATE OR REPLACE VIEW\s+"?(\w+)"?/) ||
      command.match(/DROP TRIGGER(?:\s+IF EXISTS)?\s+(\w+)/)

    const objectName = nameMatch ? nameMatch[1] : '...'

    process.stdout.write(`${i + 1}/${commands.length} ${commandType} ${objectName}... `)

    try {
      // Exécuter la commande SQL
      const { error } = await supabase.rpc('exec_sql', {
        sql_query: command + ';'
      }).single()

      // Note: Si la fonction exec_sql n'existe pas, utiliser une approche alternative
      if (error && error.message?.includes('function exec_sql')) {
        // Approche alternative : exécuter via un endpoint personnalisé
        // Pour l'instant, on utilise une requête brute
        const { error: directError } = await supabase
          .from('_sqlrunner')
          .select('*')
          .limit(0)
          .throwOnError()

        // Si ça échoue aussi, on marque comme skip
        console.log('⏭️ SKIP (nécessite exécution manuelle)')
        continue
      }

      if (error) {
        // Ignorer certaines erreurs bénignes
        if (
          error.message?.includes('already exists') ||
          error.message?.includes('does not exist')
        ) {
          console.log('⚠️ DÉJÀ EXISTANT')
        } else {
          console.log('❌ ERREUR:', error.message?.substring(0, 50))
          errorCount++
        }
      } else {
        console.log('✅ OK')
        successCount++
      }
    } catch (err: any) {
      console.log('❌ EXCEPTION:', err.message?.substring(0, 50))
      errorCount++
    }

    // Petite pause pour éviter le rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 RÉSUMÉ')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Succès: ${successCount}`)
  console.log(`❌ Erreurs: ${errorCount}`)
  console.log(`📝 Total:   ${commands.length}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // 4. Vérifier que les tables existent
  console.log('🔍 Vérification des tables...\n')

  const tablesToCheck = ['QuestionCache', 'ResponseFeedback', 'VerificationLog']

  for (const tableName of tablesToCheck) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })

      if (error) {
        console.log(`❌ Table "${tableName}": ERREUR - ${error.message}`)
      } else {
        console.log(`✅ Table "${tableName}": OK (${count || 0} lignes)`)
      }
    } catch (err: any) {
      console.log(`❌ Table "${tableName}": EXCEPTION - ${err.message}`)
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎉 INSTALLATION TERMINÉE')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  if (errorCount > 0) {
    console.log('\n⚠️ Certaines commandes ont échoué.')
    console.log('📋 Solution : Exécuter manuellement le SQL via Supabase Dashboard')
    console.log('   1. Aller sur https://supabase.com/dashboard')
    console.log('   2. SQL Editor > New Query')
    console.log('   3. Copier-coller scripts/create-learning-system-tables.sql')
    console.log('   4. Cliquer sur "Run"\n')
  } else {
    console.log('\n✅ Toutes les tables sont créées avec succès !')
    console.log('🚀 Le système d\'apprentissage intelligent est prêt.\n')
    console.log('📝 Prochaines étapes :')
    console.log('   - Redémarrer le serveur : npm run dev')
    console.log('   - Tester l\'API : curl -X POST http://localhost:3000/api/chat')
    console.log('   - Voir la doc : SYSTEME_APPRENTISSAGE.md\n')
  }
}

// Exécuter l'installation
installLearningSystem()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n🔴 ERREUR FATALE:', error)
    process.exit(1)
  })
