"""
AdCheck India - Rules & Regulations Seed Data
This module contains all the ASCI guidelines, CCPA rules, 
and category-specific regulations stored in ChromaDB.
"""

RULES = [
    # ─────────────────────────────────────────────────────────────────────────
    # ASCI - General Guidelines
    # ─────────────────────────────────────────────────────────────────────────
    {
        "id": "ASCI-G-1",
        "title": "Truthfulness in Advertising",
        "category": "general",
        "body": (
            "Advertisements must be truthful and not mislead consumers. "
            "All claims made in an ad must be honest, not deceptive, and "
            "capable of being substantiated. Any implication that creates a "
            "false impression about the product or service is prohibited."
        ),
        "keywords": ["mislead", "false", "deceptive", "truthful", "honest", "lie", "fabricate"],
        "severity": "high",
    },
    {
        "id": "ASCI-G-2",
        "title": "Comparative Advertising",
        "category": "general",
        "body": (
            "Comparisons with competitors must be fair and verifiable. "
            "An advertiser must not denigrate competitors or their products. "
            "Comparisons must not mislead consumers about the product being "
            "advertised or the one being compared. Claims of being 'No. 1' or 'best' "
            "require substantiation from an independent third party."
        ),
        "keywords": ["best", "number one", "no.1", "compare", "versus", "better than", "competitor"],
        "severity": "medium",
    },
    {
        "id": "ASCI-G-3",
        "title": "Before and After Claims",
        "category": "general",
        "body": (
            "Before-and-after comparisons in advertisements must be based on "
            "genuine, typical results. The time period over which results were "
            "achieved must be clearly stated. Any photographs used must not be "
            "digitally altered in ways that misrepresent the actual results. "
            "Unusual or exceptional results must be clearly disclosed as such."
        ),
        "keywords": ["before", "after", "results", "transformation", "change", "compare"],
        "severity": "medium",
    },
    {
        "id": "ASCI-G-4",
        "title": "Testimonials and Endorsements",
        "category": "general",
        "body": (
            "Testimonials must reflect the honest opinion of the person giving "
            "them. If a testimonial is paid for, the commercial relationship must "
            "be clearly disclosed. Results claimed in a testimonial must be "
            "achievable and typical for the average user. Celebrity endorsements "
            "require the celebrity to have genuinely used the product."
        ),
        "keywords": ["testimonial", "endorse", "celebrity", "review", "opinion", "recommend"],
        "severity": "medium",
    },
    {
        "id": "ASCI-G-5",
        "title": "Asterisk and Fine Print",
        "category": "general",
        "body": (
            "Conditions or exceptions to claims must not be hidden in fine print "
            "or buried in asterisks. Any significant qualification or limitation "
            "of an advertised claim must be presented in a font size and placement "
            "that is clearly visible to the average consumer."
        ),
        "keywords": ["asterisk", "fine print", "conditions apply", "terms apply", "disclaimer"],
        "severity": "low",
    },

    # ─────────────────────────────────────────────────────────────────────────
    # ASCI - Health & Wellness
    # ─────────────────────────────────────────────────────────────────────────
    {
        "id": "ASCI-H-1",
        "title": "Guarantee of Cure Prohibited",
        "category": "health",
        "body": (
            "Advertisements must not claim or imply a guaranteed cure for any "
            "disease, medical condition, or health problem. Terms like 'cures', "
            "'guaranteed to treat', 'eliminates disease permanently' are strictly "
            "prohibited. Products can state benefits based on evidence but must "
            "not overstate their therapeutic value."
        ),
        "keywords": ["cure", "guarantee", "eliminate disease", "treat permanently", "heal", "remedy"],
        "severity": "high",
    },
    {
        "id": "ASCI-H-2",
        "title": "Clinical Proof Required",
        "category": "health",
        "body": (
            "All health claims must be backed by credible clinical evidence. "
            "Claims such as 'clinically proven', 'dermatologist tested', or "
            "'scientifically validated' require substantiation from peer-reviewed "
            "studies or recognized scientific bodies. The name of the study or "
            "institution should ideally be disclosed."
        ),
        "keywords": ["clinically proven", "dermatologist tested", "scientifically proven", "lab tested", "doctor recommended"],
        "severity": "high",
    },
    {
        "id": "ASCI-H-3",
        "title": "Drug-like Claims Without License",
        "category": "health",
        "body": (
            "Non-drug products (including supplements, cosmetics, and food items) "
            "must not make drug-like claims about treating, preventing, or curing "
            "diseases. Claims that a product 'fights cancer', 'reverses diabetes', "
            "'cures arthritis' are prohibited unless the product is a licensed drug."
        ),
        "keywords": ["fights cancer", "reverses diabetes", "cures arthritis", "treats disease", "prevents infection"],
        "severity": "high",
    },
    {
        "id": "ASCI-H-4",
        "title": "Exaggerated Speed Claims",
        "category": "health",
        "body": (
            "Claims about the speed of results must be realistic and verifiable. "
            "Phrases like 'works in 7 days', 'results in 24 hours', 'instant relief' "
            "must be backed by evidence. The typical result timeline should reflect "
            "the median user experience, not exceptional cases."
        ),
        "keywords": ["works in 7 days", "instant", "overnight", "quick results", "fast acting", "24 hours"],
        "severity": "medium",
    },
    {
        "id": "ASCI-H-5",
        "title": "Safe and Risk-Free Claims",
        "category": "health",
        "body": (
            "No product or treatment can be marketed as '100% safe', 'completely "
            "risk-free', or 'zero side effects' without rigorous scientific evidence. "
            "All health products carry some risk profile and claims of absolute safety "
            "are considered misleading."
        ),
        "keywords": ["100% safe", "risk-free", "no side effects", "completely safe", "zero risk"],
        "severity": "high",
    },

    # ─────────────────────────────────────────────────────────────────────────
    # ASCI - Beauty & Skincare
    # ─────────────────────────────────────────────────────────────────────────
    {
        "id": "ASCI-B-1",
        "title": "Skin Whitening / Fairness Claims",
        "category": "beauty",
        "body": (
            "Advertisements must not promote skin whitening, lightening, or 'fairness' "
            "in a manner that suggests darker skin is inferior or less desirable. "
            "Such portrayals reinforce colorism and are prohibited under ASCI guidelines. "
            "Claims about 'even skin tone' should not be accompanied by imagery "
            "implying social or professional success from skin lightening."
        ),
        "keywords": ["fairness", "whiten skin", "lighter skin", "glow fair", "bright fair"],
        "severity": "high",
    },
    {
        "id": "ASCI-B-2",
        "title": "Digitally Altered Skin Images",
        "category": "beauty",
        "body": (
            "Images of skin in beauty advertisements must not be digitally enhanced "
            "to remove blemishes, wrinkles, pores, or other natural skin features "
            "in a way that creates an unattainable standard. AI-generated or heavily "
            "retouched images implying product efficacy are considered misleading."
        ),
        "keywords": ["smooth skin", "flawless", "perfect skin", "no pores", "retouched"],
        "severity": "medium",
    },
    {
        "id": "ASCI-B-3",
        "title": "Hair Growth / Anti-Hair Loss Claims",
        "category": "beauty",
        "body": (
            "Claims about regrowing hair, preventing baldness, or achieving significant "
            "hair growth require clinical substantiation. Vague claims such as "
            "'strengthens hair from root' are acceptable only if supported by evidence. "
            "Photographic evidence must reflect typical user results."
        ),
        "keywords": ["hair growth", "regrow hair", "stop hair fall", "prevent baldness", "stronger hair"],
        "severity": "medium",
    },

    # ─────────────────────────────────────────────────────────────────────────
    # ASCI - Food & Beverage
    # ─────────────────────────────────────────────────────────────────────────
    {
        "id": "ASCI-F-1",
        "title": "Nutritional Claims Must Be Accurate",
        "category": "food",
        "body": (
            "Nutritional claims such as 'high protein', 'low fat', 'rich in vitamins' "
            "must conform to FSSAI (Food Safety and Standards Authority of India) "
            "definitions and thresholds. A product labeled 'low sugar' must meet the "
            "regulatory definition for that claim."
        ),
        "keywords": ["high protein", "low fat", "sugar free", "zero calories", "rich in", "nutritious"],
        "severity": "high",
    },
    {
        "id": "ASCI-F-2",
        "title": "Health Halos on Junk Food",
        "category": "food",
        "body": (
            "Advertisements for food products high in sugar, salt, or saturated fats "
            "must not use misleading health imagery or language that implies overall "
            "health benefits. Highlighting one positive attribute (like 'vitamin D') "
            "while omitting high sugar content is considered misleading."
        ),
        "keywords": ["healthy", "nutritious", "wholesome", "good for you", "natural"],
        "severity": "medium",
    },
    {
        "id": "ASCI-F-3",
        "title": "Children Targeting in Food Ads",
        "category": "food",
        "body": (
            "Advertisements targeting children must not use misleading health claims "
            "to promote unhealthy food products. Cartoons, celebrities popular with "
            "children, and school-related imagery must not be used to market products "
            "high in fat, sugar, or salt directly to children."
        ),
        "keywords": ["kids", "children", "school", "cartoon", "toys", "for kids"],
        "severity": "high",
    },

    # ─────────────────────────────────────────────────────────────────────────
    # ASCI - Finance & Investment
    # ─────────────────────────────────────────────────────────────────────────
    {
        "id": "ASCI-FIN-1",
        "title": "Investment Returns Must Be Cautioned",
        "category": "finance",
        "body": (
            "Advertisements for investment products must include the standard disclaimer: "
            "'Mutual fund investments are subject to market risks. Read all scheme-related "
            "documents carefully.' Past performance must not be shown as a guarantee of "
            "future returns. Expected returns must be based on realistic projections."
        ),
        "keywords": ["guaranteed returns", "safe investment", "fixed returns", "double money", "high returns"],
        "severity": "high",
    },
    {
        "id": "ASCI-FIN-2",
        "title": "Get-Rich-Quick Schemes",
        "category": "finance",
        "body": (
            "Claims that promise rapid or guaranteed wealth through any financial product, "
            "trading system, or investment scheme are prohibited. Testimonials showing "
            "extreme gains ('I made Rs 10 lakh in one month') without proper risk "
            "disclaimers are considered misleading and are in violation of SEBI guidelines."
        ),
        "keywords": ["get rich", "earn lakhs", "double in days", "guaranteed profit", "passive income"],
        "severity": "high",
    },
    {
        "id": "ASCI-FIN-3",
        "title": "Loan and Credit Advertising",
        "category": "finance",
        "body": (
            "Advertisements for loans and credit products must clearly state the Annual "
            "Percentage Rate (APR), processing fees, and key terms. 'Zero interest' claims "
            "must disclose all associated charges. Urgency tactics like 'apply now, limited "
            "offer' must not hide the true cost of borrowing."
        ),
        "keywords": ["zero interest", "instant loan", "easy credit", "no EMI", "interest free"],
        "severity": "medium",
    },

    # ─────────────────────────────────────────────────────────────────────────
    # ASCI - Education
    # ─────────────────────────────────────────────────────────────────────────
    {
        "id": "ASCI-E-1",
        "title": "Job Placement and Salary Guarantees",
        "category": "education",
        "body": (
            "Educational institutions and EdTech platforms must not guarantee specific "
            "job placements, salary packages, or career outcomes. Claims like '100% "
            "placement guarantee', 'average salary Rs 8 LPA', or 'guaranteed IIT/IIM "
            "admission' require verifiable data and must disclose the methodology used."
        ),
        "keywords": ["placement guarantee", "100% placement", "salary guarantee", "job guaranteed", "admission guarantee"],
        "severity": "high",
    },
    {
        "id": "ASCI-E-2",
        "title": "Ranking and Affiliation Claims",
        "category": "education",
        "body": (
            "Claims about institutional rankings (e.g., 'Top 10 University') must cite "
            "the source, year, and methodology. Unverified affiliation claims with "
            "foreign universities or government bodies are strictly prohibited. "
            "Misleading use of logos or names of recognized bodies is not allowed."
        ),
        "keywords": ["top ranked", "best university", "affiliated with", "recognized by", "government approved"],
        "severity": "medium",
    },

    # ─────────────────────────────────────────────────────────────────────────
    # ASCI - Influencer Guidelines
    # ─────────────────────────────────────────────────────────────────────────
    {
        "id": "ASCI-IF-1",
        "title": "#Ad Disclosure Mandatory",
        "category": "influencer",
        "body": (
            "All paid promotional content, including posts, stories, reels, and videos, "
            "must be clearly disclosed as paid advertising. The labels '#Ad', '#Sponsored', "
            "'#Collaboration', or 'Paid Partnership' must be prominently placed at the "
            "beginning of the caption, not buried at the end or among other hashtags. "
            "The disclosure must be visible without requiring the viewer to tap 'more'."
        ),
        "keywords": ["#ad", "#sponsored", "#collaboration", "paid", "gifted", "in partnership"],
        "severity": "high",
    },
    {
        "id": "ASCI-IF-2",
        "title": "Material Connection Disclosure",
        "category": "influencer",
        "body": (
            "Any material connection between an influencer and a brand must be disclosed. "
            "This includes receiving free products, discounts, commissions, equity stakes, "
            "or any other form of compensation. The disclosure must be explicit, not implied "
            "through subtle hints or indirect language."
        ),
        "keywords": ["gifted", "free product", "discount code", "affiliate", "commission", "collaboration"],
        "severity": "high",
    },
    {
        "id": "ASCI-IF-3",
        "title": "Influencer Personal Opinion Disclaimer",
        "category": "influencer",
        "body": (
            "When influencers share opinions about products, they must ensure those opinions "
            "are genuine and based on actual experience. An influencer must not claim to "
            "use a product they have not actually used. They must not make false claims "
            "about a product simply because the brand has asked them to do so."
        ),
        "keywords": ["genuine review", "personal experience", "actually tried", "love this product"],
        "severity": "medium",
    },
    {
        "id": "ASCI-IF-4",
        "title": "Influencer Health and Finance Claims",
        "category": "influencer",
        "body": (
            "Influencers are held to the same standards as brand advertisers when making "
            "health, beauty, or financial claims. An influencer must not promote a health "
            "supplement with guaranteed cure claims, or a financial product with guaranteed "
            "return claims, even if the brand instructs them to do so. Influencers are "
            "jointly responsible for the content they publish."
        ),
        "keywords": ["cure", "guaranteed returns", "no side effects", "instant result", "clinically proven"],
        "severity": "high",
    },

    # ─────────────────────────────────────────────────────────────────────────
    # ASCI - Real Estate
    # ─────────────────────────────────────────────────────────────────────────
    {
        "id": "ASCI-RE-1",
        "title": "RERA Registration Required",
        "category": "realestate",
        "body": (
            "All real estate advertisements must include the RERA (Real Estate Regulatory "
            "Authority) registration number of the project. Ads without a valid RERA number "
            "are in violation. Claims about possession dates, approvals, and amenities must "
            "match what is registered with RERA."
        ),
        "keywords": ["possession", "under construction", "approved layout", "luxury homes", "ready to move"],
        "severity": "high",
    },

    # ─────────────────────────────────────────────────────────────────────────
    # ASCI - Electronics & Technology
    # ─────────────────────────────────────────────────────────────────────────
    {
        "id": "ASCI-TECH-1",
        "title": "Technical Specifications Must Be Accurate",
        "category": "electronics",
        "body": (
            "Technical claims (e.g., battery life, camera resolution, processing speed) "
            "must be accurate and verifiable. Test conditions used to derive performance "
            "claims must represent real-world usage scenarios, not lab-optimal conditions "
            "unless clearly stated."
        ),
        "keywords": ["battery life", "hours of use", "fastest", "best camera", "most powerful"],
        "severity": "medium",
    },

    # ─────────────────────────────────────────────────────────────────────────
    # CCPA / Consumer Protection Rules
    # ─────────────────────────────────────────────────────────────────────────
    {
        "id": "CCPA-1",
        "title": "Prohibition on Misleading Advertisements",
        "category": "general",
        "body": (
            "Under the Consumer Protection Act 2019 and CCPA Guidelines 2022, "
            "misleading advertisements that falsely describe products, make unfounded "
            "claims, or deliberately conceal material information are illegal and can "
            "attract penalties up to Rs 10 lakh for first offense."
        ),
        "keywords": ["mislead", "false claim", "unfair trade", "deceive consumer"],
        "severity": "high",
    },
    {
        "id": "CCPA-2",
        "title": "Surrogate Advertising Prohibition",
        "category": "general",
        "body": (
            "Surrogate advertising — using a different product as a proxy to advertise "
            "a prohibited product (e.g., alcohol brands advertising fruit juice) — is "
            "prohibited. The surrogate product must be genuinely available in the market "
            "and the primary intent must not be to promote the restricted product."
        ),
        "keywords": ["surrogate", "club soda", "mineral water", "fruit juice", "music cd"],
        "severity": "high",
    },
]
