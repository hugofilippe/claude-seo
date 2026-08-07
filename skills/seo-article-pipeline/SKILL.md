---
name: seo-article-pipeline
description: >
  End-to-end article creation pipeline: brief -> draft -> automated quality
  QC -> schema -> publish-ready package, in one command. Chains
  seo-content-brief (research, outline, meta tags), the content quality
  scripts (filler/AI-pattern detection, claim verification, humanization),
  and seo-schema (Article/BlogPosting JSON-LD) into a single workflow with
  a persisted audit trail. Use when the user says "write an article",
  "create a blog post", "draft this article", "generate content for
  [keyword]", or wants a complete piece from topic to publish-ready
  without running each sub-skill by hand.
user-invocable: true
argument-hint: "[topic-or-keyword] [existing-url]"
license: MIT
metadata:
  author: hugofilippe
  version: "2.2.4"
  category: seo
---

# SEO Article Pipeline

Turns a topic or keyword (or an underperforming existing page) into a
publish-ready article, running research, drafting, automated quality
control, and schema generation as one continuous pipeline instead of five
separate commands. This skill does not publish anywhere: it stops at a
packaged, review-ready deliverable. Publishing to a CMS is a deliberate
human step outside this skill's scope.

## Process

### Phase 0 -- Intake

Confirm before starting, but only ask what is missing and not already in
the conversation:

1. **Topic or target keyword**, or an existing URL to improve.
2. **Voice and constraints** (optional): tone, point of view, banned
   phrases, fixed facts (pricing, credentials), any house style guide. If
   none is given, default to direct, second person where natural, no
   marketing filler, no AI-typical phrasing (see Phase 2).
3. **Target word count**: if not given, use the competitor average from
   the brief (Phase 1).
4. **YMYL check**: if the topic touches health, finance, legal, or safety
   advice, flag it now. These topics need a subject-matter human review
   before publish regardless of how the automated QC scores them.

### Phase 1 -- Brief

Run the `seo-content-brief` process in full (do not skip steps): SERP
analysis, competitor gap scoring, search intent classification, keyword
placement rules, meta tag limits, and internal linking targets. Reuse its
output verbatim as the outline for Phase 2, this pipeline does not
re-derive an outline independently.

Persist the brief as `{slug}-article/01-brief.md`.

### Phase 2 -- Draft

Write the full article against the Phase 1 outline:

- Follow the per-section word counts, keyword placement, and format notes
  from the brief.
- Deliver the specific Information Gain element the brief identified, a
  draft that reads like every other page ranking for the query has failed
  the brief.
- Apply the voice and constraints from Phase 0.
- Do not use FAQPage markup or an on-page "Frequently Asked Questions"
  section written to farm a retired SERP feature. If the brief calls for a
  genuine reader Q&A section, write it as ordinary prose/H2s, schema comes
  in Phase 5 as QAPage only if the content is genuine user-generated Q&A.

Persist the draft as `{slug}-article/02-draft.md`.

### Phase 3 -- Automated Quality QC

Run against the draft, iterating until thresholds pass (see
`references/quality-thresholds.md`) or a max of 2 revision passes:

1. `claude-seo run content_quality.py {slug}-article/02-draft.md --json`
   -- filler score, AI-pattern score, information density, repetition.
2. `claude-seo run content_verify.py {slug}-article/02-draft.md --json`
   -- claim extraction and citation-gap detection.
3. If either check fails its threshold, revise the draft directly (do not
   just run the humanizer and call it done), then re-run step 1-2.
4. Once density/filler checks pass, run
   `claude-seo run content_humanize.py {slug}-article/02-draft.md -o {slug}-article/03-final.md`
   as a last-mile deterministic cleanup pass, it only swaps known
   AI-typical phrasings and never introduces new content.

If a check still fails after 2 revision passes, ship the article with the
outstanding QC finding called out explicitly in the final report rather
than silently lowering the bar or looping indefinitely.

Persist `{slug}-article/qc-report.json` with the raw output of all three
script runs plus the revision count.

### Phase 4 -- Structural QC

Delegate to the `seo-content` subagent (or run its checklist inline if
subagents are unavailable) against `03-final.md`:

- E-E-A-T signal check (experience, expertise, authoritativeness, trust)
- Word count vs. the page-type minimum from `seo-content`'s table
- Confirm every item from the brief's E-E-A-T Requirements and Internal
  Linking Opportunities sections is actually present in the draft, a
  brief that says "cite a 2025 study" is not satisfied by a draft that
  doesn't

Record findings in `{slug}-article/qc-report.json` under `structural`.

### Phase 5 -- Schema

Generate JSON-LD per `seo-schema`'s Article/BlogPosting template. Fill
`headline`, `author`, `datePublished`, `image`, and `publisher` from
context already gathered (or leave the field as an explicit placeholder
and list it in the final report as a human input still needed, never
invent an author name, date, or publisher).

Do not generate FAQPage schema (Google retired FAQ rich results for all
sites on 2026-05-07, see `skills/seo/references/quality-gates.md`). Use
QAPage only if Phase 2 produced genuine user-submitted Q&A content, never
for editorial FAQ-style sections.

Persist as `{slug}-article/04-schema.json`.

### Phase 6 -- Package Output

Deliver:

- The final article (`03-final.md`), in the input format requested
  (Markdown by default, HTML if the target CMS needs it).
- Recommended title tag and meta description (from the brief, character
  counts verified).
- The JSON-LD block from Phase 5, wrapped in a `<script>` tag if HTML was
  requested.
- Internal linking list with anchor text and target URLs.
- A short QC summary: filler/AI-pattern/density scores, uncited claim
  count, structural checklist pass/fail, and anything still needing human
  input (YMYL review, missing author bio, placeholder schema fields).

Offer PDF generation via `claude-seo run google_report.py` only if the
user asks for a formal report, this is a content deliverable, not an
audit, so do not push it by default.

## Output Files

- `{slug}-article/01-brief.md` -- content brief (Phase 1)
- `{slug}-article/02-draft.md` -- first full draft (Phase 2)
- `{slug}-article/03-final.md` -- QC-passed, humanized draft (Phase 3)
- `{slug}-article/04-schema.json` -- Article/BlogPosting JSON-LD (Phase 5)
- `{slug}-article/qc-report.json` -- automated + structural QC trail

## Error Handling

| Scenario | Action |
|----------|--------|
| Existing URL unreachable (improve mode) | Report the error. Fall back to new-page mode using the keyword only, and note the limitation in the brief. |
| `content_quality.py` / `content_verify.py` unavailable | Note the QC gap in the final report. Do not claim a QC pass that did not run. |
| Draft still fails QC after 2 revision passes | Ship with the outstanding finding listed explicitly in Phase 6, never silently pass a failing check. |
| YMYL topic detected | Call it out in Phase 0 and again in the Phase 6 summary. Recommend subject-matter review before publish regardless of QC scores. |
| No voice/style guide provided | Use the Phase 0 default (direct, second person where natural, no filler, no AI-typical phrasing) and state this default was used. |

## Reference Files

- `references/quality-thresholds.md` -- pass/fail thresholds for the
  Phase 3 automated QC scripts
