import { getCMSContent } from "@/lib/cms";
import { getLocale }     from "@/lib/locale";
import { HeroSection }       from "@/components/home/HeroSection";
import { StatsBar }          from "@/components/home/StatsBar";
import { FeaturesGrid }      from "@/components/home/FeaturesGrid";
import { HowItWorks }        from "@/components/home/HowItWorks";
import { SDGSection }        from "@/components/home/SDGSection";
import { Testimonials }      from "@/components/home/Testimonials";
import { Partners }          from "@/components/home/Partners";
import { PricingSection }    from "@/components/home/PricingSection";
import { FAQSection }        from "@/components/home/FAQSection";
import { FinalCTA }          from "@/components/home/FinalCTA";
import { SiteFooter }        from "@/components/home/SiteFooter";

// ISR — rebuild this page at most every 5 minutes
export const revalidate = 300;

export default async function HomePage() {
  const locale = await getLocale();
  const cms    = await getCMSContent(locale);

  return (
    <main className="min-h-screen bg-background">
      {cms.sections["hero"]         && <HeroSection       cms={cms} locale={locale} />}
      {cms.sections["stats"]        && <StatsBar          stats={cms.stats} />}
      {cms.sections["features"]     && <FeaturesGrid      cms={cms} locale={locale} />}
      {cms.sections["how_it_works"] && <HowItWorks        cms={cms} locale={locale} />}
      {cms.sections["sdg"]          && <SDGSection        cms={cms} locale={locale} />}
      {cms.sections["testimonials"] && <Testimonials      items={cms.testimonials} />}
      {cms.sections["partners"]     && <Partners          items={cms.partners} />}
      {cms.sections["pricing"]      && <PricingSection    cms={cms} locale={locale} />}
      {cms.sections["faq"]          && <FAQSection        items={cms.faq} locale={locale} />}
      {cms.sections["cta"]          && <FinalCTA          cms={cms} locale={locale} />}
      <SiteFooter locale={locale} />
    </main>
  );
}