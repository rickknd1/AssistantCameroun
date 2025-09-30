-- ============================================
-- TABLES CONVERSATION & MESSAGING
-- Conversation, Message, Citation, Feedback
-- ============================================

-- ============================================
-- 1. TABLE CONVERSATION
-- ============================================
CREATE TABLE "Conversation" (
  id TEXT PRIMARY KEY DEFAULT ('conv_' || replace(gen_random_uuid()::TEXT, '-', '')),
  "sessionId" TEXT NOT NULL,

  title TEXT,
  language TEXT DEFAULT 'FR' NOT NULL CHECK (language IN ('FR', 'EN')),
  topic TEXT,

  -- Métadonnées
  "messageCount" INTEGER DEFAULT 0 NOT NULL,
  "lastMessageAt" TIMESTAMPTZ,

  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour Conversation
CREATE INDEX idx_conversation_session ON "Conversation"("sessionId");
CREATE INDEX idx_conversation_created ON "Conversation"("createdAt" DESC);
CREATE INDEX idx_conversation_last_message ON "Conversation"("lastMessageAt" DESC NULLS LAST);

-- Trigger pour updatedAt
CREATE TRIGGER update_conversation_updated_at
  BEFORE UPDATE ON "Conversation"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. TABLE MESSAGE
-- ============================================
CREATE TABLE "Message" (
  id TEXT PRIMARY KEY DEFAULT ('msg_' || replace(gen_random_uuid()::TEXT, '-', '')),
  "conversationId" TEXT NOT NULL REFERENCES "Conversation"(id) ON DELETE CASCADE,

  role TEXT NOT NULL CHECK (role IN ('USER', 'ASSISTANT', 'SYSTEM')),
  content TEXT NOT NULL,

  -- Métadonnées pour assistant
  confidence DECIMAL(5,2) CHECK (confidence >= 0 AND confidence <= 100),
  "processingTime" INTEGER, -- milliseconds
  "tokensUsed" INTEGER,
  model TEXT, -- Nom du modèle IA utilisé

  language TEXT NOT NULL CHECK (language IN ('FR', 'EN')),
  error TEXT,

  -- Citations (pour affichage rapide)
  "citationCount" INTEGER DEFAULT 0 NOT NULL,

  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour Message
CREATE INDEX idx_message_conversation ON "Message"("conversationId", "createdAt");
CREATE INDEX idx_message_role ON "Message"(role);

-- Trigger pour mettre à jour messageCount et lastMessageAt
CREATE OR REPLACE FUNCTION update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "Conversation"
  SET
    "messageCount" = "messageCount" + 1,
    "lastMessageAt" = NEW."createdAt",
    "updatedAt" = NOW()
  WHERE id = NEW."conversationId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER message_inserted
  AFTER INSERT ON "Message"
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_message();

-- ============================================
-- 3. TABLE CITATION (Sources des réponses)
-- ============================================
CREATE TABLE "Citation" (
  id TEXT PRIMARY KEY DEFAULT ('cit_' || replace(gen_random_uuid()::TEXT, '-', '')),
  "messageId" TEXT NOT NULL REFERENCES "Message"(id) ON DELETE CASCADE,
  "documentId" TEXT REFERENCES "Document"(id) ON DELETE SET NULL,

  excerpt TEXT NOT NULL,
  reference TEXT NOT NULL,
  relevance DECIMAL(5,2) NOT NULL CHECK (relevance >= 0 AND relevance <= 100),

  -- Métadonnées optionnelles
  "sectionId" TEXT REFERENCES "Section"(id) ON DELETE SET NULL,
  "pageNumber" INTEGER,

  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour Citation
CREATE INDEX idx_citation_message ON "Citation"("messageId");
CREATE INDEX idx_citation_document ON "Citation"("documentId");

-- Trigger pour mettre à jour citationCount
CREATE OR REPLACE FUNCTION update_message_citation_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "Message"
  SET "citationCount" = "citationCount" + 1
  WHERE id = NEW."messageId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER citation_inserted
  AFTER INSERT ON "Citation"
  FOR EACH ROW
  EXECUTE FUNCTION update_message_citation_count();

-- ============================================
-- 4. TABLE FEEDBACK (Évaluation des réponses)
-- ============================================
CREATE TABLE "Feedback" (
  id TEXT PRIMARY KEY DEFAULT ('fb_' || replace(gen_random_uuid()::TEXT, '-', '')),
  "messageId" TEXT UNIQUE NOT NULL REFERENCES "Message"(id) ON DELETE CASCADE,

  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,

  -- Catégories de feedback
  categories TEXT[], -- ['helpful', 'accurate', 'clear', 'complete']

  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour Feedback
CREATE INDEX idx_feedback_message ON "Feedback"("messageId");
CREATE INDEX idx_feedback_rating ON "Feedback"(rating);
CREATE INDEX idx_feedback_created ON "Feedback"("createdAt" DESC);