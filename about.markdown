---
layout: page
title: About
permalink: /about/
---

This database provides information about identifiers from the European Registry of Materials
([ERM identifiers](/erm-database/work/10.5281/ZENODO.8015080)) for which a citable resource has provided
information. This can be a dataset with a DOI or a (peer-reviewed) journal article.

Because the registry merely registers the identifier, it allows ERM identifiers to be used
before details are disclosed or measured. For exameple, a TiO<sub>2</sub> material is planned
in a study but not syntesized or ordered yet, and the exact chemistry and biological properties
are not yet known. A second example is when you wish to publish about a new material (e.g. efficacy)
and you will not disclose the chemical identity yet. [ERM00000416](/erm-database/substance/ERM/00000416)
is an example ERM identifier.

## Powered by

The Jekyll layout is based on the default [minima](https://github.com/jekyll/minima) gem, version 2.5.1, but tweaked after that, e.g. with bits
from [Lagrange](https://github.com/LeNPaul/Lagrange/). The content pages (identifiers, ontology classes) are generated with the [jekyll-datapage-generator plugin](https://github.com/avillafiorita/jekyll-datapage_gen) from a publically available [data repository](https://github.com/nanocommons/erm-database/tree/main/_data).

This website is further powered by (in random order):

* HTML
* DOI, CrossRef
* [citation.js](https://citation.js.org/) (doi:[10.7717/peerj-cs.214](https://doi.org/10.7717/peerj-cs.214))
