"use client"

import { useLanguage } from "@/lib/i18n"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertCircle, Users, Mail, Heart, Linkedin, Target, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function InfoContent() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          À propos de l'Assistant National du Cameroun
        </h1>
        <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto px-2">
          Votre guide intelligent pour naviguer les démarches administratives au Cameroun
        </p>
      </div>

      {/* Platform Information */}
      <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-12">
        <Card className="border-primary/20 hover:border-primary/40 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Shield className="h-5 w-5 text-primary flex-shrink-0" />
              Notre Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm md:text-base">
            <p className="text-muted-foreground leading-relaxed">
              L'Assistant National du Cameroun est une plateforme innovante conçue pour simplifier l'accès aux informations administratives, juridiques et procédurales au Cameroun.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Notre objectif est de rendre les démarches administratives plus accessibles, transparentes et compréhensibles pour tous les citoyens.
            </p>
          </CardContent>
        </Card>

        <Card className="border-secondary/20 hover:border-secondary/40 transition-colors">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Target className="h-5 w-5 text-secondary flex-shrink-0" />
              Pourquoi cette plateforme ?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm md:text-base">
            <p className="text-muted-foreground leading-relaxed">
              Face à la complexité des procédures administratives et au manque d'informations claires, de nombreux citoyens se retrouvent perdus et frustrés.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Cette plateforme vise à démocratiser l'accès à l'information, économiser votre temps et vous éviter des déplacements inutiles.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Benefits Section */}
      <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 mb-8 md:mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Sparkles className="h-5 w-5 text-accent-foreground flex-shrink-0" />
            Ce que vous offre cette plateforme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3 text-sm md:text-base">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-foreground">Gain de temps</p>
                  <p className="text-muted-foreground text-sm">Obtenez des réponses instantanées sans vous déplacer ni faire la queue</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-foreground">Informations fiables</p>
                  <p className="text-muted-foreground text-sm">Toutes nos données proviennent de sources officielles vérifiées</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-foreground">Gratuité totale</p>
                  <p className="text-muted-foreground text-sm">Tous nos services sont 100% gratuits, sans frais cachés</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 text-sm md:text-base">
              {/* Image Profile - Desktop Only */}
              <div className="hidden md:flex items-center justify-center mb-4">
                <img
                  src="/rick-jilan.png"
                  alt="KENDEM MBA Rick Dylan"
                  className="w-32 h-32 rounded-full object-cover shadow-lg border-2 border-primary/20"
                />
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-foreground">Disponibilité 24/7</p>
                  <p className="text-muted-foreground text-sm">L'assistant est disponible jour et nuit, weekend et jours fériés</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-foreground">Guides détaillés</p>
                  <p className="text-muted-foreground text-sm">Procédures expliquées étape par étape avec documents requis et coûts</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-secondary mt-2 flex-shrink-0"></div>
                <div>
                  <p className="font-semibold text-foreground">Bilingue</p>
                  <p className="text-muted-foreground text-sm">Interface disponible en français et en anglais</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notice */}
      <Card className="border-accent/40 bg-accent/5 mb-8 md:mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent-foreground text-lg md:text-xl">
            <AlertCircle className="h-5 w-5 text-accent-foreground flex-shrink-0" />
            Avertissement Important
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-accent-foreground/90">
          <p className="font-medium text-sm md:text-base">
            Les informations fournies sur cette plateforme sont données à titre indicatif et peuvent ne pas refléter exactement la réalité sur le terrain.
          </p>
          <div className="space-y-2 text-xs md:text-sm">
            <p>
              <strong>Veuillez noter :</strong>
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-accent-foreground mt-1 flex-shrink-0">•</span>
                <span>
                  Les <strong>coûts indiqués</strong> sont souvent des estimations officielles. Dans la pratique, des frais supplémentaires peuvent s'appliquer pour les timbres, photocopies, déplacements, et autres services auxiliaires.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-foreground mt-1 flex-shrink-0">•</span>
                <span>
                  Les <strong>procédures administratives</strong> peuvent varier selon les régions, les bureaux, et les circonstances particulières de votre dossier.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-foreground mt-1 flex-shrink-0">•</span>
                <span>
                  Les <strong>délais mentionnés</strong> sont théoriques et peuvent être plus longs en pratique en raison de divers facteurs administratifs.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-foreground mt-1 flex-shrink-0">•</span>
                <span>
                  Les <strong>documents juridiques</strong> peuvent être modifiés ou abrogés. Nous vous recommandons de vérifier les informations auprès des autorités compétentes.
                </span>
              </li>
            </ul>
            <p className="mt-4 font-medium">
              Nous vous encourageons à toujours vérifier les informations auprès des administrations concernées avant d'entreprendre toute démarche importante.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Team Section */}
      <Card className="border-primary/20 mb-8 md:mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Users className="h-5 w-5 text-primary flex-shrink-0" />
            L'Équipe du Projet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Image Profile - Mobile Only */}
            <div className="flex-shrink-0 md:hidden">
              <img
                src="/rick-jilan.png"
                alt="KENDEM MBA Rick Dylan"
                className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-primary/20"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold mb-2">KENDEM MBA Rick Dylan</h3>
              <p className="text-base md:text-lg text-primary font-semibold mb-3">Ingénieur en Informatique & Chef de Projet</p>
              <p className="text-muted-foreground mb-4 text-sm md:text-base leading-relaxed">
                Spécialiste en développement web et intelligence artificielle. Cette plateforme a été conçue pour servir la transparence et l'éducation civique au Cameroun. Mettre la technologie au service de l'information et de la connaissance administrative et juridique constitue ma mission.
              </p>
              <p className="text-muted-foreground mb-3 text-sm md:text-base italic">
                Avec engagement,<br />
                KENDEM MBA Rick Dylan
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Consultant IT - CEO EOWEB
              </p>
              <div className="flex items-center gap-4 justify-center md:justify-start flex-wrap">
                <a
                  href="mailto:contact@eoweb.cm"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  contact@eoweb.cm
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Support Section */}
      <Card className="border-secondary/30 bg-gradient-to-br from-secondary/5 to-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Heart className="h-5 w-5 text-secondary flex-shrink-0" />
            Soutenez ce projet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
            Cette plateforme est développée et maintenue bénévolement pour servir la communauté camerounaise. Si vous trouvez ce projet utile, vous pouvez me soutenir en partageant la plateforme autour de vous ou en me suivant sur LinkedIn.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
            <Button
              asChild
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <a
                href="https://www.linkedin.com/in/rick-kendem/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Linkedin className="h-4 w-4" />
                Me soutenir sur LinkedIn
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary/30 hover:bg-primary/5"
            >
              <a
                href="mailto:contact@eoweb.cm"
                className="inline-flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Nous contacter
              </a>
            </Button>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground italic">
            Votre soutien m'encourage à continuer d'améliorer cette plateforme et à développer de nouvelles fonctionnalités pour mieux vous servir.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
