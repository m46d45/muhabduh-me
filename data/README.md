# Paper data: blog "Memulai dengan Bertanya"

Generated on 21 Oct 2026 (WIB) on the box. Files: `papers.json` and `papers.yaml` (same content, sorted newest first).

## Sources
- ORCID 0000-0001-6926-6665: baseline `/workspace/orcid-works.json` (27 works). The live public API had the same 27 put-codes, so nothing new.
- Google Scholar DctmufgAAAAJ: all pages scanned (pagesize=100, cstart=0/100/200). 160 rows.
- muhabduh.id/publications (books plus a 27-item works archive, 21 DOI links) and /research (3 ongoing studies, no papers).
- Parade Tim Kerja (KoNTekS 20): from the 12-week map in `../riset-blog-memulai-bertanya.md`.
- Crossref: every DOI resolved via api.crossref.org/works/<doi>. Scholar-only items were title-searched in Crossref, and a DOI was accepted only on an exact title match with Abduh as an author.

## Schema (one object per work)
| field | meaning |
|---|---|
| id | slug: year + first title words (unique) |
| title, year, venue | as in the source (ORCID first, then Scholar, then the site). Venue is the Crossref container when a Scholar-only item has a DOI |
| type | journal / conference / book / chapter (inferred from the Scholar venue string when there is no DOI; see note) |
| authors | string as in the source (Scholar or the site), else Crossref. null if unknown |
| doi | lowercase, null if none. Never guessed |
| url | doi.org link if there is a DOI, else the ORCID/Scholar/site URL |
| status | published / in-press |
| topics | subset of lean, rantai-pasok, pengadaan-berkelanjutan, keberlanjutan, ketahanan-bencana, pendidikan, simulasi, kontraktor-kecil, teknologi (keyword-based, may be empty, worth a manual pass) |
| on_site | listed on muhabduh.id/publications on 21 Oct 2026 |
| blog_weeks | weeks from the 12-week map, else [] |
| related_posts | [] placeholder |
| source | array, any of orcid / scholar / site / manuscript |
| verified | true if the DOI was confirmed in Crossref with a matching title, or the work is in ORCID, or it is a book listed on the site |
| note | merges, year conflicts, assumptions |

## Counts
- Total: 151 ({'book': 8, 'journal': 35, 'chapter': 18, 'conference': 90})
- With DOI: 49 (all resolve in Crossref)
- Not on site (on_site=false): 120
- Unverified: 89 (mostly Scholar-only items without a DOI). Parade Tim Kerja is verified, in press, and has no DOI.
- Linked to a blog week: 17
- Topics: {'teknologi': 31, 'lean': 14, 'pendidikan': 11, 'simulasi': 10, 'keberlanjutan': 40, 'ketahanan-bencana': 16, 'kontraktor-kecil': 13, 'pengadaan-berkelanjutan': 10, 'rantai-pasok': 31}

## Dedup and drops
ORCID and Scholar were matched by normalized title. Scholar's internal duplicates were merged (noted in `note`), e.g. Earned Value 2007 ×2, IGLC 2014 green assessment ×2, TERANG ×2, Lean chapter 2026 ×2, and several KoNTekS/KNPTS pairs. Dropped Scholar artifacts:
- "Surjamanto (2012)": Scholar artifact (citation string as title)
- "Suryamanto (2011a).“": Scholar artifact (citation string as title)
- "9tb": Scholar artifact "9tb"
- "Software Impacts": Scholar artifact "Software Impacts" (dup of TERANG)
- "Infrastructural Issues in Emerging Economies (ICCIEE 2017)": Scholar artifact (conference name as title)
- "Surjamanto.(2012). Kajian Reuse Material Bangunan Dalam Konsep Sustainable Construction di Indonesia": Scholar citation-string duplicate of #4

## Gaps / open issues
- Parade Tim Kerja: author Muhamad Abduh, accepted KoNTekS 20, in press, verified, no DOI yet.
- 2006 EASEC items: ORCID says 2006 but the venue name says EASEC 2010 (the site omits them). Kept ORCID's year.
- TPL/IJCM: Scholar 2025 vs Crossref 2024. Set to 2024.
- JTS items 10.5614/jts.2005.12.3.6 and jts.2004.11.4.2: Crossref issued year 2010 vs the volume year. Source year kept.
- Possible unmerged near-duplicates: "Pengembangan model penilaian kinerja jasa konstruksi" (2006) and "Development of Construction Service Performance Evaluation Model" (2006); the 2005 vs 2007 Konstruksi Ramping items; the LCA items.
- Week-12 patent-mapping paper (EURO-SEC-6): not found anywhere.
- The site's 6 books and 3 2026 papers (IJCM education, IGLC 34, CEB) have no ORCID record yet.
- Topics and type for Scholar-only items are heuristic.
