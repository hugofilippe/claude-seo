# Phase 3 QC Thresholds

Both scripts already encode a sane default threshold via their own `--threshold`
flag and exit non-zero when a draft fails it. Use those flags directly instead
of re-deriving numbers by hand:

```
claude-seo run content_quality.py {slug}-article/02-draft.md --json --threshold 60
claude-seo run content_verify.py {slug}-article/02-draft.md --json --threshold 0.4
```

## `content_quality.py`

| Field | Range | Fails when |
|-------|-------|------------|
| `overall_quality` | 0-100, higher is better | `< 60` (default `--threshold`) |
| `filler_score` | 0-100, higher is worse | `>= 50` auto-flagged as `"filler"` |
| `ai_pattern_score` | 0-100, higher is worse | `>= 40` auto-flagged as `"ai-patterns"` |
| `information_density` | 0.0-1.0 | no hard cutoff; low density plus a low `overall_quality` is the strongest signal of a thin draft |
| `repetition_score` | 0-100, higher is worse | no hard cutoff; treat alongside `overall_quality` |

`overall_quality` is a composite of the fields above (see the script's
docstring for the exact weighting). Do not gate on the sub-scores alone,
gate on `overall_quality` and use the sub-scores to decide what to fix.

## `content_verify.py`

| Field | Range | Fails when |
|-------|-------|------------|
| `uncited_ratio` | 0.0-1.0 | `> 0.4` (default `--threshold`) |

Every claim in `uncited_ratio`'s numerator is a `claims[]` entry with
`has_citation: false`. Fix by adding a source next to the specific claim,
not by softening the claim into something unverifiable, that trades a QC
failure for a weaker article.

## Revision loop

1. Run both scripts.
2. If either fails, read the `matches` (quality) or `claims` (verify) detail
   to find the exact offending spans, revise those spans in the draft.
3. Re-run both scripts.
4. Stop after 2 revision passes regardless of outcome. Ship with the
   remaining failure named explicitly in the Phase 6 report, an infinite
   revision loop is worse than a named limitation.

## Humanization is not a substitute for revision

`content_humanize.py` only swaps a fixed table of known AI-typical phrases
1:1. Run it last, after `overall_quality` and `uncited_ratio` already pass,
not as a way to force a pass. It cannot fix low information density, an
uncited claim, or filler that isn't in its replacement table.
