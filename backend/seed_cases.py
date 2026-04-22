from .search_engine import search_engine


def load_seed_cases() -> None:
    """
    Load a set of synthetic example cases into the in-memory index.
    This is intended for demo and testing purposes only.
    """
    seed_data = [
        {
            "title": "Alpha Corp v. Beta Ltd (2020)",
            "text": (
                "Alpha Corp and Beta Ltd entered into a one-year supply contract for 1,000 units per month. "
                "Beta delivered only 200 units in April 2020, citing supply chain disruption. "
                "Alpha purchased substitute goods at a higher price and lost a key customer. "
                "The dispute concerns breach of contract, force majeure, and recovery of expectation damages including lost profits."
            ),
            "meta": {"jurisdiction": "Exampleland", "court": "Commercial Court", "year": 2020},
        },
        {
            "title": "Rivera v. City Transport Authority (2019)",
            "text": (
                "Rivera was injured when a city bus stopped abruptly at an intersection. "
                "The driver admitted he had been looking at his mobile phone. "
                "The Authority argued contributory negligence because Rivera was not holding the handrail. "
                "The case examines duty of care of public transport operators and contributory negligence."
            ),
            "meta": {"jurisdiction": "Exampleland", "court": "Civil Court", "year": 2019},
        },
        {
            "title": "Kaur v. Global MedTech Inc. (2021)",
            "text": (
                "Kaur, a quality assurance manager, reported serious safety defects in a medical device through internal channels. "
                "Two months later she was dismissed in an alleged departmental restructuring. "
                "Internal emails referred to her as a troublemaker. "
                "The dispute concerns whistleblower protection and retaliatory dismissal."
            ),
            "meta": {"jurisdiction": "Exampleland", "court": "Labour Court", "year": 2021},
        },
    ]

    # Generate additional synthetic variants programmatically to reach ~50 cases
    contract_templates = [
        (
            "Omega Industries v. Delta Supplies ({year})",
            "Omega Industries sued Delta Supplies for late delivery of industrial components. "
            "Delta relied on a broadly worded force majeure clause, citing global economic downturn. "
            "The court considered foreseeability, allocation of risk, and the interpretation of force majeure provisions."
        ),
        (
            "Nova Retail v. Horizon Logistics ({year})",
            "Nova Retail claimed damages after Horizon Logistics failed to deliver goods before a major holiday sale. "
            "Horizon blamed port congestion and labour disputes. "
            "The case discusses liquidated damages, mitigation, and foreseeability of loss."
        ),
    ]

    tort_templates = [
        (
            "Singh v. Metro Rail Authority ({year})",
            "Singh was injured when a metro train doors closed unexpectedly while he was boarding. "
            "The Authority argued that warning signs were clearly displayed. "
            "The court analysed standard of care in public transportation and contributory negligence."
        ),
        (
            "Lopez v. Green Park Hospital ({year})",
            "Lopez alleged negligent medical treatment after a misdiagnosis in the emergency department. "
            "The hospital defended on the basis of resource constraints and adherence to guidelines. "
            "The case explores professional negligence and the Bolam-style standard of care."
        ),
    ]

    employment_templates = [
        (
            "Patel v. TechNova Solutions ({year})",
            "Patel claimed unfair dismissal after raising concerns about unpaid overtime and data privacy violations. "
            "The employer cited poor performance and organisational restructuring. "
            "The tribunal considered evidence of retaliatory motive and burden of proof in whistleblowing cases."
        ),
        (
            "Garcia v. City Council ({year})",
            "Garcia, a senior inspector, reported corruption in procurement processes. "
            "Shortly afterwards, his role was downgraded and he was later dismissed. "
            "The case examines protection for public sector whistleblowers and remedies for victimisation."
        ),
    ]

    ip_templates = [
        (
            "Orion Software v. BrightApps ({year})",
            "Orion Software claimed that BrightApps copied substantial parts of its source code in a competing application. "
            "Technical experts compared code structure and functionality. "
            "The court considered originality, substantial similarity, and injunctive relief in copyright infringement."
        ),
        (
            "Aurora Media v. StreamBox ({year})",
            "Aurora Media alleged that StreamBox streamed films without appropriate licences. "
            "StreamBox argued fair use and safe harbour protection. "
            "The dispute addresses digital copyright, platform liability, and statutory damages."
        ),
    ]

    # Populate multiple years for variety
    years = list(range(2010, 2025))

    # Add generated contract cases
    for i, year in enumerate(years[:12]):
        template = contract_templates[i % len(contract_templates)]
        seed_data.append(
            {
                "title": template[0].format(year=year),
                "text": template[1],
                "meta": {"jurisdiction": "Exampleland", "court": "Commercial Court", "year": year},
            }
        )

    # Add generated tort cases
    for i, year in enumerate(years[:12]):
        template = tort_templates[i % len(tort_templates)]
        seed_data.append(
            {
                "title": template[0].format(year=year),
                "text": template[1],
                "meta": {"jurisdiction": "Exampleland", "court": "Civil Court", "year": year},
            }
        )

    # Add generated employment cases
    for i, year in enumerate(years[:12]):
        template = employment_templates[i % len(employment_templates)]
        seed_data.append(
            {
                "title": template[0].format(year=year),
                "text": template[1],
                "meta": {"jurisdiction": "Exampleland", "court": "Labour Court", "year": year},
            }
        )

    # Add generated IP cases
    for i, year in enumerate(years[:11]):
        template = ip_templates[i % len(ip_templates)]
        seed_data.append(
            {
                "title": template[0].format(year=year),
                "text": template[1],
                "meta": {"jurisdiction": "Exampleland", "court": "Intellectual Property Court", "year": year},
            }
        )

    # Load all seed cases into the search engine
    for case in seed_data:
        try:
            search_engine.add_case(
                title=case["title"],
                text=case["text"],
                meta=case.get("meta", {}),
            )
        except Exception:
            # Ignore individual failures to avoid blocking startup in demos
            continue

