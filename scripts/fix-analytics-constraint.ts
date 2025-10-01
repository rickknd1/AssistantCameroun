import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixAnalyticsConstraint() {
  console.log('🔧 Fixing Analytics event constraint...')

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'fix_analytics_constraint.sql')
    const sql = fs.readFileSync(sqlPath, 'utf-8')

    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql })

    if (error) {
      console.error('❌ Error:', error)
      // Try alternative method with raw query
      const commands = sql.split(';').filter(cmd => cmd.trim())

      for (const command of commands) {
        if (command.trim()) {
          const { error: cmdError } = await supabase.rpc('exec_sql', { sql_query: command })
          if (cmdError) {
            console.error('❌ Error executing command:', cmdError)
          }
        }
      }
    } else {
      console.log('✅ Analytics constraint fixed successfully!')
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    console.log('\n📝 Please run this SQL manually in Supabase Dashboard:')
    console.log('\nALTER TABLE "Analytics" DROP CONSTRAINT IF EXISTS "Analytics_event_check";')
    console.log('\nALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_event_check"')
    console.log('  CHECK (event IN (')
    console.log("    'PAGE_VIEW',")
    console.log("    'SEARCH',")
    console.log("    'DOCUMENT_VIEW',")
    console.log("    'PROCEDURE_VIEW',")
    console.log("    'NEWS_VIEW',")
    console.log("    'QUIZ_START',")
    console.log("    'QUIZ_COMPLETE',")
    console.log("    'CONVERSATION_START',")
    console.log("    'MESSAGE_SENT',")
    console.log("    'MESSAGE_RECEIVED',")
    console.log("    'MESSAGE_ERROR',")
    console.log("    'CITATION_CLICKED',")
    console.log("    'FEEDBACK_SUBMITTED'")
    console.log('  ));')
  }
}

fixAnalyticsConstraint()
