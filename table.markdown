---
layout: page
title: Content table
permalink: /table/
---

<!-- Include jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<!-- Include DataTables CSS and JavaScript -->
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.11.5/css/jquery.dataTables.css">
<script type="text/javascript" charset="utf8" src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.js"></script>

<!-- Initialize table -->
<table id="data-table">
  <thead>
    <tr>
      <th>ERM ID</th>
      <th>Ontology class</th>
      <th>CURIE</th>
      <th>Chemical Composition</th>
      <th>In Dataset</th>
      <th>Same As</th>
    </tr>
  </thead>
  <tbody id="table-body">
  </tbody>
</table>

<script>
  $(document).ready(function() {
    // Initialize DataTables with pageLength set to a large number
    $('#data-table').DataTable({
      "pageLength": 10000, 
      "paging": false 
    });
  });
</script>

<!-- read the jekyll-liquid data into a JSON, extract values, fill up table -->
<script>
document.addEventListener('DOMContentLoaded', function () {
  const ermData = {{ site.data.erm | jsonify }};
  const enmoData = {{ site.data.enmo | jsonify }};
  const tableBody = document.getElementById('table-body');

  const ermArray = Object.values(ermData);

ermArray.forEach((erm) => {
  const row = document.createElement('tr');
  // Find the _data/enmo yml with a matching id
  const ontologyClass = Object.values(enmoData).find((enmo) => enmo.curie === erm.a);
  const ontologyCurie = Object.values(enmoData).find((enmo) => enmo.curie === erm.a);

    row.innerHTML = `
      <td>${erm.id ? erm.id : ''}</td>
      <td>${ontologyClass ? ontologyClass.label : ''}</td>
      <td>${ontologyCurie ? ontologyClass.curie : ''}</td>
      <td>${erm.chemicalComposition ? erm.chemicalComposition : ''}</td>
      <td>${erm.datasetDOI ? formatDataset(erm.datasetDOI) : ''}</td>
      <td>${erm.sameAs ? erm.sameAs.join('<br>') : ''}</td>
    `;

    tableBody.appendChild(row);
  });

  function formatDataset(datasetDOI) {
    // Convert the datasetDOI into a bullet-point list
    const datasets = datasetDOI.split(',');
    if (datasets.length > 1) {
      return '<ul>' + datasets.map((dataset) => `<li>${dataset.trim()}</li>`).join('') + '</ul>';
    } else {
      return datasetDOI.trim();
    }
  }
});
</script>
