"""CMS tables for homepage content management

Revision ID: 008
Revises: 007
"""
revision = "008"
down_revision = "007"

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB, UUID


def upgrade() -> None:

    # ── homepage_sections ──────────────────────────────────────────────────
    # Controls which sections appear and in what order
    op.create_table("homepage_sections",
        sa.Column("id",         UUID,   server_default="uuid_generate_v4()", primary_key=True),
        sa.Column("slug",       sa.String(50),  nullable=False, unique=True),
        # hero | stats | features | how_it_works | sdg | testimonials |
        # partners | pricing | faq | cta | footer
        sa.Column("label",      sa.String(100), nullable=False),
        sa.Column("order",      sa.Integer,     nullable=False, server_default="0"),
        sa.Column("is_visible", sa.Boolean,     server_default="true"),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default="now()"),
    )

    # ── homepage_content ───────────────────────────────────────────────────
    # Key-value content store, one row per (section, key, locale)
    op.create_table("homepage_content",
        sa.Column("id",         UUID,   server_default="uuid_generate_v4()", primary_key=True),
        sa.Column("section_slug", sa.String(50), nullable=False),
        sa.Column("key",        sa.String(100),  nullable=False),
        # e.g. headline, subheadline, cta_text, cta_href, image_url
        sa.Column("locale",     sa.String(5),    nullable=False, server_default="'fr'"),
        # 'fr' | 'en'
        sa.Column("value",      sa.Text,         nullable=False),
        sa.Column("value_type", sa.String(20),   server_default="'text'"),
        # text | richtext | url | image_url | number | boolean
        sa.Column("updated_by", UUID,            nullable=True),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default="now()"),
        sa.UniqueConstraint("section_slug", "key", "locale",
                            name="uq_homepage_content"),
    )
    op.create_index("ix_homepage_content_section_locale",
                    "homepage_content", ["section_slug", "locale"])

    # ── homepage_stats ─────────────────────────────────────────────────────
    # Mix of live DB counts and manually overridden display values
    op.create_table("homepage_stats",
        sa.Column("id",           UUID,   server_default="uuid_generate_v4()", primary_key=True),
        sa.Column("key",          sa.String(50), nullable=False, unique=True),
        # incidents_resolved | cities_active | citizens_registered |
        # avg_response_hours | sdg_goals_tracked
        sa.Column("label_fr",     sa.String(100), nullable=False),
        sa.Column("label_en",     sa.String(100), nullable=False),
        sa.Column("value",        sa.String(20),  nullable=False),
        # display value e.g. "2,400" or "89%"
        sa.Column("source",       sa.String(20),  server_default="'manual'"),
        # 'manual' | 'live' (live = computed by cron from real data)
        sa.Column("order",        sa.Integer,     server_default="0"),
        sa.Column("is_visible",   sa.Boolean,     server_default="true"),
        sa.Column("updated_at",   sa.DateTime(timezone=True), server_default="now()"),
    )

    # ── testimonials ───────────────────────────────────────────────────────
    op.create_table("testimonials",
        sa.Column("id",           UUID,   server_default="uuid_generate_v4()", primary_key=True),
        sa.Column("quote_fr",     sa.Text,        nullable=False),
        sa.Column("quote_en",     sa.Text,        nullable=False),
        sa.Column("author_name",  sa.String(150), nullable=False),
        sa.Column("author_title", sa.String(150), nullable=True),
        sa.Column("city_name",    sa.String(100), nullable=True),
        sa.Column("avatar_url",   sa.String(500), nullable=True),
        sa.Column("is_published", sa.Boolean,     server_default="false"),
        sa.Column("order",        sa.Integer,     server_default="0"),
        sa.Column("created_at",   sa.DateTime(timezone=True), server_default="now()"),
    )

    # ── partners ───────────────────────────────────────────────────────────
    op.create_table("partners",
        sa.Column("id",         UUID,   server_default="uuid_generate_v4()", primary_key=True),
        sa.Column("name",       sa.String(150), nullable=False),
        sa.Column("logo_url",   sa.String(500), nullable=False),
        sa.Column("website",    sa.String(500), nullable=True),
        sa.Column("category",   sa.String(50),  server_default="'partner'"),
        # partner | donor | government | media
        sa.Column("order",      sa.Integer,     server_default="0"),
        sa.Column("is_visible", sa.Boolean,     server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default="now()"),
    )

    # ── faq_items ──────────────────────────────────────────────────────────
    op.create_table("faq_items",
        sa.Column("id",           UUID,   server_default="uuid_generate_v4()", primary_key=True),
        sa.Column("question_fr",  sa.Text, nullable=False),
        sa.Column("question_en",  sa.Text, nullable=False),
        sa.Column("answer_fr",    sa.Text, nullable=False),
        sa.Column("answer_en",    sa.Text, nullable=False),
        sa.Column("category",     sa.String(50),  server_default="'general'"),
        # general | technical | pricing | government
        sa.Column("order",        sa.Integer,     server_default="0"),
        sa.Column("is_published", sa.Boolean,     server_default="true"),
        sa.Column("created_at",   sa.DateTime(timezone=True), server_default="now()"),
    )

    # ── Seed default section rows ──────────────────────────────────────────
    op.execute("""
        INSERT INTO homepage_sections (slug, label, "order") VALUES
        ('hero',         'Hero',               1),
        ('stats',        'Stats bar',          2),
        ('features',     'Features grid',      3),
        ('how_it_works', 'How it works',       4),
        ('sdg',          'SDG alignment',      5),
        ('testimonials', 'Testimonials',       6),
        ('partners',     'Partners',           7),
        ('pricing',      'Pricing',            8),
        ('faq',          'FAQ',                9),
        ('cta',          'Final CTA',         10),
        ('footer',       'Footer',            11)
    """)

    # ── Seed default stats ─────────────────────────────────────────────────
    op.execute("""
        INSERT INTO homepage_stats (key, label_fr, label_en, value, "order") VALUES
        ('incidents_resolved', 'Incidents résolus',    'Incidents resolved',  '2,400+', 1),
        ('cities_active',      'Villes actives',       'Active cities',       '3',      2),
        ('citizens_registered','Citoyens inscrits',    'Citizens registered', '12,000+',3),
        ('avg_response_hours', 'Temps de réponse moy.','Avg response time',   '3.2h',   4),
        ('sdg_goals_tracked',  'ODD suivis',           'SDGs tracked',        '6',      5)
    """)


def downgrade() -> None:
    op.drop_table("faq_items")
    op.drop_table("partners")
    op.drop_table("testimonials")
    op.drop_table("homepage_stats")
    op.drop_table("homepage_content")
    op.drop_table("homepage_sections")