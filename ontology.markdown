---
layout: page
title: eNM Ontology
permalink: /enmo/
---
<div class="tag-cloud">
<ul>
{% for enmo_hash in site.data.enmo %}
{% assign enmo = enmo_hash[1] %}
  <li>
    <a href="{{ enmo.URI }}">
      {{ enmo.label }} </a>  ({{ enmo.curie }})
      <ul>
        
        {% for erm_hash in site.data.erm %}
        
          {% assign erm = erm_hash[1] %}
          {% if enmo.curie == erm.a %}
        <li>
          <a href="/erm-database/substance/{{ erm.id | replace: 'ERM', 'ERM/' }}"> {{ erm.id | replace: 'ERM', 'erm:ERM'}} </a>
        </li>
          {% endif %}
        
        {% endfor %}
        </ul>
    
  </li>
{% endfor %}
</ul>
</div>
