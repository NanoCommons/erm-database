---
layout: page
title: Tags
permalink: /tags/
---

### Materials

<div class="tag-cloud">
{% for tag in site.tags %}
  {% assign tag_name = tag[0] %}
  {% if tag_name contains "erm:" %}
    <span style="font-size: {{ tag | last | size | times: 500 | divided_by: site.tags.size | plus: 100  }}%">
      <a href="{{ tag_name | replace: 'ERM', 'ERM/' | slice: 4,20 | prepend: '/substance/' | relative_url }}">{{ tag | first  }}</a>
    </span>
  {% endif %}
{% endfor %}
</div>

### Other tags

<div class="tag-cloud">
{% for tag in site.tags %}
  {% assign tag_name = tag[0] %}
  {% if tag_name contains "doi:" %}
  {% elsif tag_name contains "inchikey:" %}
  {% elsif tag_name contains "substance:" %}
  {% elsif tag_name contains "erm:" %}
  {% else %}
    <span style="font-size: {{ tag | last | size | times: 500 | divided_by: site.tags.size | plus: 100  }}%">
      <a href="{{ '/tag/' | append: tag_name | relative_url }}">{{ tag | first }}</a>
    </span>
  {% endif %}
{% endfor %}
</div>
