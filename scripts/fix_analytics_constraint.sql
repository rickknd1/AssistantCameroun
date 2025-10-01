-- Fix Analytics event constraint to add missing events

-- Drop the old constraint
ALTER TABLE "Analytics" DROP CONSTRAINT IF EXISTS "Analytics_event_check";

-- Add the new constraint with all events
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_event_check"
  CHECK (event IN (
    'PAGE_VIEW',
    'SEARCH',
    'DOCUMENT_VIEW',
    'PROCEDURE_VIEW',
    'NEWS_VIEW',
    'QUIZ_START',
    'QUIZ_COMPLETE',
    'CONVERSATION_START',
    'MESSAGE_SENT',
    'MESSAGE_RECEIVED',
    'MESSAGE_ERROR',
    'CITATION_CLICKED',
    'FEEDBACK_SUBMITTED'
  ));
