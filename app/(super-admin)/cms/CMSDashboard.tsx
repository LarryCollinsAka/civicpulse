"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsEditor } from "./StatsEditor";
import { TestimonialsEditor } from "./TestimonialsEditor";
import { PartnersEditor } from "./PartnersEditor";
import { FAQEditor }          from "./FAQEditor";
import { SectionsEditor } from "./SectionsEditor";

export function CMSDashboard({ sections, stats, testimonials, partners, faq }: {
  sections:     any[];
  stats:        any[];
  testimonials: any[];
  partners:     any[];
  faq:          any[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Homepage CMS</h1>
        <p className="text-sm text-muted-foreground">
          Changes go live within 5 minutes. No deployment needed.
        </p>
      </div>

      <Tabs defaultValue="sections">
        <TabsList>
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="sections">
          <SectionsEditor sections={sections} />
        </TabsContent>
        <TabsContent value="stats">
          <StatsEditor stats={stats} />
        </TabsContent>
        <TabsContent value="testimonials">
          <TestimonialsEditor testimonials={testimonials} />
        </TabsContent>
        <TabsContent value="partners">
          <PartnersEditor partners={partners} />
        </TabsContent>
        <TabsContent value="faq">
          <FAQEditor faq={faq} />
        </TabsContent>
      </Tabs>
    </div>
  );
}