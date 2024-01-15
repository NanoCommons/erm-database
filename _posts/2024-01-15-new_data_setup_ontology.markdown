---
layout: post
title:  "New data setup for the ERM Identifier Database"
date:   2023-01-15
tags: nanocommons site ENMO
---
The ERM Identifier Database now uses the [`'jekyll-datapage-generator'`](https://github.com/avillafiorita/jekyll-datapage_gen) plugin to store the site data and generate the website. Moreover, the eNanoMapper ontology is now used to identify material classes.

The new data is stored under [`_data`](https://github.com/NanoCommons/erm-database/tree/main/_data) in three directories:
  - `enmo`, for the eNanoMapper Ontology terms used to identify the ERMs
  - `erm`, for each individual ERM entry,
  - `work`, for the publications linked to ERMs

Future changes will include more automation steps allowing RDF downloads of the site data.
