# Australia pet-insurance visualisation: dataset audit

**Checked:** 16 September 2026 (Australia/Singapore time context)

## Executive decision

The strongest defensible core is:

1. **Animal Medicines Australia (AMA), _Pets in Australia 2025_** — latest national survey of pet ownership, spending, veterinary-care access and insurance behaviour. Survey reference point: **March 2025**; published 17 September 2025.
2. **PetSure, _Pet Health Monitor 2026_ web tables** — latest PetSure release currently presented on its official site. The page labels its age tables as 2025 and provides current dog/cat conditions, average treatment costs and highest observed treatment costs. Use the web tables directly and record the page access date. Do not silently substitute the older 2025 report if the 2026 page contains the same measure.

This pair fits the topic well: AMA describes the population and how owners protect/pay for care; PetSure describes claims and veterinary-cost risk among insured pets. They are complementary, but **not directly comparable populations**. PetSure claims are from insured pets; AMA covers households more broadly.

For a reproducible backup or second core source, use **PetSure Pet Health Monitor 2025 PDF**, which reports 2024 claims data from more than 700,000 insured pets. It is highly usable, but not the most recent PetSure release once the 2026 page is available.

## Source register

| Source | Latest period represented | Reliability | Use | Important limitation |
|---|---:|---|---|---|
| AMA, _Pets in Australia 2025_ | March 2025 survey | High: national survey by AMA with SEC Newgate; methodology is disclosed | Ownership, household penetration, pet counts, expenditure, vet access, insurance uptake/barriers | Survey estimates and extrapolations; not an administrative insurance register |
| PetSure, _Pet Health Monitor 2026_ official page | Page presents 2025 age tables/current release | High for PetSure-insured population | Common conditions and treatment costs by species/life stage | Insured-pet selection bias; current page is not necessarily a downloadable raw dataset; preserve exact denominators/notes |
| PetSure, _Pet Health Monitor 2025_ PDF | 2024 claims | High for PetSure-insured population | Breed costs, condition prevalence, expensive claims, 2014–2024 gastroenteritis-cost series | Older than the 2026 release; do not call it 2025 claims data |
| Actuaries Institute, _A Brief Discussion of Pet Insurance in Australia_ | Published 27 Sep 2023 | High professional source, but older | Policy mechanics and market explanation | Not a current market-size dataset; do not use 2022 figures as latest |
| APRA quarterly general-insurance statistics | September 2023–June 2026 database, published 27 Aug 2026 | High official regulator | Context about general insurance only | It is aggregated by insurance class; do not present “Other Accident” as pet insurance unless the APRA specification explicitly identifies pet insurance |
| Finder/Canstar product quotes | Quote dates vary, often 2025–26 | Secondary/commercial | Optional product snapshot only | Quotes are not representative market prices; they change with pet, breed, age, location and settings |

## What from the previously described workbook is safe

### Keep as primary evidence

- AMA ownership 2025 and the 2016–2025 ownership trend **only where every year is sourced to the corresponding AMA report and the measure definition is consistent**.
- AMA 2025 spending and veterinary-care-access figures.
- PetSure condition, breed and treatment-cost tables, with a visible note that they are claims from insured pets.
- A policy-mechanics diagram based on current PDS documents or the Actuaries Institute explanation. Label it as product mechanics, not a market statistic.

### Keep only with explicit caveats

- **Current Finder product snapshot:** useful for comparing benefit percentage, excess, annual limit, waiting period and optional routine care, but it is a comparison snapshot, not an official market dataset. Use only named products and quote date/settings.
- **Historical Actuaries Institute numbers:** useful as context, not as the latest uptake or market-size measure.
- **Veterinary workforce or clinic data:** relevant to access to care, but it is not evidence of insurance growth. Use only in a clearly labelled “care access” section.
- **Derived rates such as vets per 100,000:** acceptable only if the numerator and denominator are official and the formula is shown. This is a calculated indicator, not a source dataset.

### Remove or do not use as core evidence

- Market-size forecasts from commercial market-research vendors. Their estimates conflict substantially, use undisclosed models and are not reasonably clean public data.
- APRA “Other Accident” as a pet-insurance series.
- Any table described as “insurance uptake” unless the underlying AMA question, denominator, sample and year are preserved.
- Any ACT veterinary-premises map if the 48 premises have not been downloaded and checked from the official source. Never fill missing rows.
- Any map that implies PetSure claims are geographically representative if no state/territory denominator is supplied.

## Recommended data files for the webpage

Do not ship the 14–15 MB PDFs to GitHub as chart data. Use small, transparent CSVs copied from the published tables, retaining the source note and table/page reference in a README. The CSVs should be direct transcriptions of published values, not synthetic records or modelled estimates.

Suggested files:

- `ama_ownership_2016_2025.csv`
- `ama_pet_types_2025.csv`
- `ama_spending_2025.csv`
- `ama_vet_access_2025.csv`
- `ama_insurance_uptake_barriers_2025.csv`
- `petsure_2026_conditions_by_species_age.csv`
- `petsure_2026_condition_costs.csv`
- `petsure_2026_breed_costs.csv` (only if the current release publishes it)
- `petsure_2025_gastroenteritis_cost_2014_2024.csv` (backup/long-run trend)
- `policy_features_snapshot_YYYY-MM-DD.csv` (only if each row links to the named insurer PDS)

Every CSV needs these metadata fields or an accompanying `data_dictionary.md`: `source`, `source_url`, `publication_date`, `reference_period`, `retrieved_date`, `measure_definition`, `unit`, `denominator`, and `caveat`.

## Maps: feasibility check before committing to HD

The cleanest way to satisfy the three-map requirement in this topic is to use the official South Australian Dogs and Cats Online extract for a separate “geography of care/registration” section. It is not insurance data, so label it honestly.

Recommended set:

1. **Choropleth:** SA council registered-animal share (`registered_rate_pct`) using official/generalised LGA polygons.
2. **Proportional-symbol map:** SA council recorded-animal totals using the supplied geometry-derived representative points. The point is a visual anchor, not an animal location.
3. **Bin map:** the same SA rate classified with visible, explicit breaks: under 90%, 90–under 95%, and 95% or higher.

The ACT veterinary-premises source is a possible dot-map backup, but it currently supplies addresses/suburbs rather than verified coordinates and its records show an expiry date that needs rechecking. A flow map is not supported because no origin-to-destination records were found.

Do not use AMA national percentages on SA council polygons, do not describe DACO registration as insurance, and do not imply that three views of one SA extract are three independent datasets. They are three different visual tasks using the same geographic context source.

## Chart/story plan grounded in available data

A strong story can use 11–12 charts without forcing weak idioms:

1. Ownership growth, 2016–2025 — annotated slope/interval view.
2. 2025 pet population by type — treemap, if the table is complete and labels remain readable.
3. Spending composition — Marimekko/mosaic only if category totals and denominator are clear; otherwise a ranked bar is safer but basic.
4. Insurance spending versus other pet-care spending — waterfall only if the components reconcile exactly; otherwise a proportional composition view.
5. Dog versus cat insurance uptake — interval/range or paired distribution view.
6. Why owners remain uninsured — heatmap or matrix of barriers by species.
7. Policy mechanics — coverage matrix (accident-only, accident-and-illness, routine-care add-on).
8. PetSure dog conditions by age — heatmap.
9. PetSure cat conditions by age — heatmap; count the two as one small-multiple chart if visually identical.
10. Frequency versus cost — quadrant/scatter using published condition prevalence and treatment cost; label insured-population limitation.
11. Breed cost spread — interval/range chart, not a causal ranking.
12. Rare high-cost events — threshold/bullet or range chart; do not imply probability if the report gives only maximums.

The rubric says charts must be meaningful, not merely numerous. Keep at least eight genuinely advanced idioms, but do not count a line chart, bar chart, grouped bar, ordinary scatterplot or bubble chart as advanced. Ask the tutor to confirm whether treemap, heatmap, matrix, interval/range, waterfall and map variants count in your class’s interpretation.

## Claims that are safe to state

- AMA 2025 reports 31.6 million pets, 7.7 million pet-owning households and 73% household ownership as of March 2025.
- AMA reports approximately $1.0 billion in pet-insurance expenditure in 2025 and $21.3 billion total pet expenditure.
- AMA reports 49.3% household penetration for dogs and 33.6% for cats in 2025.
- PetSure’s latest official page presents current condition and treatment-cost tables; the older 2025 report explicitly states its claims data are from 2024.
- PetSure claims data describe insured pets, not all Australian pets.

## Claims to avoid

- “Australia has X insured pets” unless the source provides a current national count and denominator.
- “The pet-insurance market is worth X” based only on a commercial forecast.
- “PetSure proves Australians have condition X” without saying “among PetSure-insured pets.”
- “State A has more insurance claims” without a state-level exposure denominator.
- “This policy is best” from a product comparison; compare features and exclusions instead.

## Primary URLs

- AMA 2025 report page: https://animalmedicinesaustralia.org.au/resources/pets-in-australia-a-national-survey-of-pets-and-people-3/
- AMA 2025 PDF: https://animalmedicinesaustralia.org.au/wp-content/uploads/2025/09/SNR-2403006-Pet-Ownership-Study-2025-Designed_F3.pdf
- PetSure current monitor page: https://petsure.com.au/pet-health-monitor/
- PetSure 2025 PDF (2024 claims): https://petsure.com.au/wp-content/uploads/2024/07/PHM-2025_FINAL-digital_21.05.25.pdf
- Actuaries Institute: https://www.actuaries.asn.au/research-analysis/a-brief-discussion-of-pet-insurance-in-australia
- APRA general insurance statistics: https://www.apra.gov.au/news-and-publications/quarterly-general-insurance-performance-statistics

## Bottom line

The previous pack is a useful planning pack, but it is **not yet safe to call final data** from the summary alone. Replace any PetSure-2024-only “latest” claims with the current PetSure 2026 page where the same measure exists, retain PetSure 2025 only for historical series not updated on the page, and remove unsupported geographic/market-size tables. The best two-source narrative is **AMA 2025 (how Australians own and pay for pets) + PetSure 2026 (what insured pets claim and what treatment costs)**.
