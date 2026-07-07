# U.S. License Plate Formats

Researched: 2026-07-07

This is an engineering reference for Rate My Plate plate entry and validation.
It focuses on passenger vehicle license plates in the 50 U.S. states plus the
District of Columbia.

## Overall U.S. Model

License plates in the United States are issued by state, district, territorial,
tribal, or federal authorities. There is no single national serial format. Most
state passenger plates use alphanumeric serials, commonly six or seven
characters, but older still-valid plates, specialty plates, vanity plates,
commercial plates, trailers, motorcycles, temporary registrations, tribal plates,
and federal plates can differ from standard passenger formats.

Physical passenger plates are generally 12 by 6 inches. Display rules also vary:
some states require only a rear plate, some require front and rear plates, and
some require front and rear plates with exceptions.

## Input Normalization

Use normalized plate serials for validation:

1. Trim leading and trailing whitespace.
2. Convert to uppercase.
3. Remove visual separators: spaces, hyphens, dots, bullets, and centered dots.
4. Keep only ASCII letters and digits.

Recommended broad U.S. app regex after normalization:

```regex
^[A-Z0-9]{1,8}$
```

This is intentionally broad. It is better for user-submitted reports because a
valid real-world plate may be a vanity, specialty, low-number, older issue, or
non-passenger plate. Use the state-specific regexes below only when the product
explicitly wants "current standard passenger plate" validation.

## State Matrix

Regexes below apply after normalization. They are practical app-validation
patterns derived from current standard passenger formats, not legal authority.
In raw Markdown, `\|` inside a regex cell is a table escape for the regex
alternation operator `|`; copy regexes from the rendered table or remove that
escape when copying from source.

| State | Code | Current standard passenger format | Normalized length | Regex | Notes |
| --- | --- | --- | --- | --- | --- |
| Alabama | AL | `0AXXXXX`, `00AXXXX` | 7 | `^(?=.{7}$)\d{1,2}A[A-HJ-NPR-Z0-9]{4,5}$` | County-coded; letters I, O, Q omitted. |
| Alaska | AK | `ABC123` | 6 | `^[A-HJ-NPR-Z]{3}\d{3}$` | Letters I, O, Q omitted. |
| Arizona | AZ | `XXX1XX` | 6 | `^[A-HJ-NPR-TV-Z1-9]{3}\d[A-HJ-NPR-TV-Z1-9]{2}$` | Alphabet-soup blocks; letters I, O, Q, U omitted. |
| Arkansas | AR | `ABC12D` | 6 | `^[A-NP-Z]{3}\d{2}[A-NP-Z]$` | Letters O and Q omitted. |
| California | CA | `123ABC1` | 7 | `^\d{3}[A-HJ-NPR-Z][A-Z][A-HJ-NPR-Z]\d$` | Current 2026 sequence; I, O, Q only appear in the middle letter position. Older `1ABC123` plates may remain valid. |
| Colorado | CO | `ABCD12` | 6 | `^[A-Z]{4}\d{2}$` | Normalized from `ABC-D12`. |
| Connecticut | CT | `AB12345` | 7 | `^[A-HJ-NPR-Z]{2}\d{5}$` | Letters I, O, Q omitted. |
| Delaware | DE | `123456` | 1-6 | `^\d{1,6}$` | Random low-number numeric serials are common. |
| District of Columbia | DC | `AB1234` | 6 | `^[A-HJ-NPR-Z]{2}\d{4}$` | Letters I, O, Q omitted. |
| Florida | FL | `ABCD12`, `12ABCD`, `AB12CD` | 6 | `^(?:[A-NP-Z]{4}\d{2}\|\d{2}[A-NP-Z]{4}\|[A-NP-Z]{2}\d{2}[A-NP-Z]{2})$` | Several no-extra-cost standard/alternate issues; letter O omitted. |
| Georgia | GA | `ABC1234`, `ABC1DE`, `AB1CDE` | 6-7 | `^(?:[A-NP-Z]{3}\d{4}\|[A-NP-Z]{3}\d[A-NP-Z]{2}\|[A-NP-Z]{2}\d[A-NP-Z]{3})$` | Letter O omitted; includes 2026 alternate issue patterns. |
| Hawaii | HI | `ABC123` | 6 | `^[A-HJ-NPR-Z]{3}\d{3}$` | County-coded first letter; letters I, O, Q omitted. |
| Idaho | ID | County prefix plus body plus suffix, e.g. `A1234U`, `0AABC1U`, `10BA234U` | 6-8 | `^(?:(?:[A-Z]\|\d[A-Z])(?:\d{4}\|[A-Z]\d{3}\|[A-Z]{2}\d{2}\|[A-Z]{3}\d)\|\d{2}[A-Z](?:\d{4}\|[A-Z]\d{3}))[UPV]$` | County-coded; common suffix is U, with P/V used for exhausted county series. |
| Illinois | IL | `AB12345` | 7 | `^[A-HJ-NP-Z]{2}\d{5}$` | Letters I and O omitted. |
| Indiana | IN | `123A`, `123AB`, `123ABC`, optional `ABC123` | 4-6 | `^(?:\d{3}[A-Z]{1,3}\|[A-Z]{3}\d{3})$` | Randomly issued; serial tied to owner. |
| Iowa | IA | `ABC123` | 6 | `^[A-Z]{3}\d{3}$` | County name is displayed but not part of the serial. |
| Kansas | KS | `1234ABC` | 7 | `^\d{4}[A-HJ-NPR-Z]{3}$` | Letters I, O, Q omitted. |
| Kentucky | KY | `A1B234`, `ABC123` | 6 | `^(?:[A-HJ-NPR-TV-Z]\d[A-HJ-NPR-TV-Z]\d{3}\|[A-HJ-NPR-TV-Z]{3}\d{3})$` | Letters I, O, Q, U omitted. |
| Louisiana | LA | `123ABC` | 6 | `^\d{3}[A-Z]{3}$` | Current 2016-present serial format on newer bases. |
| Maine | ME | `123ABC` | 6 | `^\d{3}[A-HJ-NP-Z]{3}$` | Letters I and O omitted. |
| Maryland | MD | `1AB2345` | 7 | `^\d[A-DG-HJ-NPR-TV-Z]{2}\d{4}$` | Letters I, O, Q, U omitted; E and F stopped being used in late 2023. |
| Massachusetts | MA | `1ABC23`, `123A40` | 6 | `^(?:\d[A-HJ-NPR-TV-Z]{3}\d{2}\|\d{3}[A-HJ-NPR-TV-Z]\d{2})$` | Coded by month of expiration; letters I, O, Q, U omitted. |
| Michigan | MI | `ABC1234` | 7 | `^[A-HJ-NP-Z]{3}\d{4}$` | Letters I and O omitted. |
| Minnesota | MN | `123ABC`, `ABC123` | 6 | `^(?:\d{3}[A-HJ-NPR-Z]{3}\|[A-HJ-NPR-Z]{3}\d{3})$` | Letters I, O, Q omitted. |
| Mississippi | MS | `ABC123` | 6 | `^[A-NP-Z]{3}(?!666)\d{3}$` | County-coded; letter O and number block 666 omitted. |
| Missouri | MO | `AB1C2D` | 6 | `^[A-HJ-NPR-Z]{2}\d[A-HJ-NPR-Z]\d[A-HJ-NPR-Z]$` | Coded by month of expiration; letters I, O, Q omitted. |
| Montana | MT | `0AB1234`, `00AB123` | 7 | `^(?=.{7}$)\d{1,2}[A-HJ-NPS-UW-Z]{2}\d{3,4}$` | County-coded; letters I, O, Q, R, V omitted. |
| Nebraska | NE | `0A1234`, `0AB123`, `00A123`, `00AB12`, metro `ABC123` | 3-6 county-coded; 6 metro | `^(?:[A-Z]{3}\d{3}\|\d[A-HJ-LNPR-VYZ]{1,2}\d{1,4}\|\d{2}[A-HJ-LNPR-VYZ]{1,2}\d{1,3})$` | County-coded outside Douglas, Lancaster, and Sarpy counties; some letters omitted on county-coded plates. |
| Nevada | NV | `4321A5`, `345A12`, `12A345` | 6 | `^(?:\d{4}[A-HJ-NPR-Z]\d\|\d{3}[A-HJ-NPR-Z]\d{2}\|\d{2}[A-HJ-NPR-Z]\d{3})$` | Letters I, O, Q omitted. |
| New Hampshire | NH | `1234567` | 7 | `^\d{7}$` | All numeric. |
| New Jersey | NJ | `D12ABC` | 6 | `^[A-HJ-NPRSUVWYZ]\d{2}[A-HJ-NPR-Z]{3}$` | Letters I, O, Q omitted; T and X series reserved for trailer/commercial. |
| New Mexico | NM | `123ABC`, alternates `ABC123`, `ABCD12` | 6 | `^(?:\d{3}[A-HJ-NPR-TW-Z]{3}\|[A-HJ-NPR-TW-Z]{3}\d{3}\|[A-HJ-NPR-TW-Z]{4}\d{2})$` | Letters I, O, Q, U, V omitted on the standard issue. |
| New York | NY | `ABC1234` | 7 | `^[A-HJ-NPR-Z]{3}\d{4}$` | Letters I, O, Q omitted. |
| North Carolina | NC | `ABC1234` | 7 | `^[A-FHJ-NPR-TV-Z]{3}\d{4}$` | Letters G, I, O, Q, U omitted. |
| North Dakota | ND | `123ABC` | 6 | `^\d{3}[A-Z]{3}$` | No major skipped-letter note found in the current table. |
| Ohio | OH | `ABC1234` | 7 | `^[A-HJ-NP-Z][A-Z][A-HJ-NP-Z]\d{4}$` | I and O only appear in the second letter position. |
| Oklahoma | OK | `ABC123` | 6 | `^[A-Z]{3}\d{3}$` | Current standard passenger serial. |
| Oregon | OR | `123ABC` | 6 | `^\d{3}[A-HJ-NP-Z][A-Z]{2}$` | I and O are not used as the first letter. |
| Pennsylvania | PA | `ABC1234` | 7 | `^[A-HJ-NPR-TV-Z][B-DF-HJ-NPR-TV-Z][A-HJ-NPR-TV-Z]\d{4}$` | Letters I, O, Q, U omitted; A and E omitted as the second letter. |
| Rhode Island | RI | `1AB234` | 6 | `^\d[A-NP-Z]{2}\d{3}$` | Letter O omitted. |
| South Carolina | SC | `123ABC` | 6 | `^\d{3}[A-Z]{3}$` | O was reintroduced after previously being skipped. |
| South Dakota | SD | `0A1234`, `0AB123`, `00A123` | 6 | `^(?:\d[A-HJ-NPR-Z]\d{4}\|\d[A-HJ-NPR-Z]{2}\d{3}\|\d{2}[A-HJ-NPR-Z]\d{3})$` | County-coded; letters I, O, Q omitted. |
| Tennessee | TN | `ABC1234`, alternate `123ABCD` | 7 | `^(?:[B-DF-HJ-NP-TV-Z]{3}\d{4}\|\d{3}[B-DF-HJ-NP-TV-Z]{4})$` | Vowels A, E, I, O, U omitted. |
| Texas | TX | `ABC1234` | 7 | `^[B-DF-HJ-NPR-TV-Z]{3}\d{4}$` | Vowels plus Q omitted. |
| Utah | UT | `A123BC`, optional `1ABC2`, `1A2BC` | 5-6 | `^(?:[A-HJ-NPR-Z]\d{3}[A-HJ-NPR-Z]{2}\|\d[A-HJ-NPR-Z]{3}\d\|\d[A-HJ-NPR-Z]\d[A-HJ-NPR-Z]{2})$` | Letters I, O, Q omitted. |
| Vermont | VT | `ABC123` | 6 | `^[A-HK-NPR-TV-Z]{3}\d{3}$` | Letters I, J, O, Q, U omitted; V and Z are now used. |
| Virginia | VA | `ABC1234` | 7 | `^[A-HJ-NPR-Z]{3}\d{4}$` | Letters I, O, Q omitted. |
| Washington | WA | `ABC1234` | 7 | `^[A-Z]{2}[A-HJ-NPR-Z]\d{4}$` | I, O, Q omitted as the third letter. |
| West Virginia | WV | `X1A2345`, `XAB1234` | 7 | `^[1-9OND](?:\d[A-Z]\|[A-Z]{2})\d{4}$` | First character codes expiration month: 1-9, O, N, or D. |
| Wisconsin | WI | `ABC1234` | 7 | `^[A-HJ-NPR-Z]{3}\d{4}$` | Letters I, O, Q omitted. |
| Wyoming | WY | `1A123A`, `10A123A`, `1A1234`, `10A1234` | 6-7 | `^\d{1,2}[A-Z]\d{3}[A-Z0-9]$` | County-coded and vehicle-type-coded. |

## Product Guidance

For Rate My Plate, store plate values normalized and display them formatted only
when a known state format is selected. Recommended validation tiers:

| Tier | Purpose | Regex strategy |
| --- | --- | --- |
| Broad U.S. entry | User reports, search, comments, cross-state lookup | `^[A-Z0-9]{1,8}$` |
| State-assisted hints | Show examples and gentle warnings | Use the state matrix as advisory only. |
| Strict state validation | Admin curation or OCR cleanup for current standard passenger plates | Use the per-state regex, with a bypass for vanity/specialty/older plates. |

Avoid rejecting a user report solely because it fails the state-specific regex.
The state regexes are useful for hints, duplicate normalization, search quality,
and OCR confidence, but they are not complete legal validation.

## Sources

- [Vehicle license plates of the United States](https://en.wikipedia.org/wiki/Vehicle_license_plates_of_the_United_States)
- [United States license plate designs and serial formats](https://en.wikipedia.org/wiki/United_States_license_plate_designs_and_serial_formats)
- [California DMV: License Plates, Decals, and Placards](https://www.dmv.ca.gov/portal/vehicle-registration/license-plates-decals-and-placards/)
- [Florida Highway Safety and Motor Vehicles: License Plates and Registration](https://www.flhsmv.gov/motor-vehicles-tags-titles/license-plates-registration/)
- [Texas DMV: License Plates](https://www.txdmv.gov/motorists/license-plates)

State DMV rules should be checked before using these regexes for compliance,
ticketing, law enforcement, or any decision that materially affects a person.
