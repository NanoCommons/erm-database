---
layout: page
title: eNM Ontology
permalink: /enmo/
---

<head>
  <style>
    ul {
      list-style-type: none;
      padding-left: 0;
    }
    ul ul {
      margin-left: 20px;
      position: relative;
    }
    ul ul:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: -10px;
      width: 1px;
      background-color: #ccc;
    }
    ul li {
      margin-bottom: 5px;
    }
    .enmo-label {
      font-weight: bold; /* Make enmo labels bold */
      cursor: pointer;
    }
    .erm-name {
      color: #1f77b4;
      text-decoration: underline;
      cursor: pointer;
      display: none; /* Hide ERMs by default */
    }
  </style>
</head>
<div id="indented-list"></div>

<script>
  // Function to build hierarchical structure
  function buildHierarchy(enmoData, ermData) {
    const nodeMap = {};

    // Helper function to get or create a node
    const getNode = (id, label) => {
      if (!nodeMap[id]) {
        nodeMap[id] = { name: label || id, 
                        id: id,
                        children: [] };
      }
      return nodeMap[id];
    };

    // Build the enmo hierarchy
    Object.keys(enmoData).forEach(enmoKey => {
      const enmo = enmoData[enmoKey];
      if (enmo && enmo.curie && enmo.label) {
        getNode(enmo.curie, enmo.label);
      }
      if (enmo && enmo.a) {
        const subclasses = Array.isArray(enmo.a) ? enmo.a : [enmo.a];
        subclasses.forEach(subclass => {
          const parent = getNode(subclass);
          const child = getNode(enmo.curie, enmo.label);
          parent.children.push(child);
        });
      }
    });

    // Place the erm terms under the correct enmo terms
    Object.keys(ermData).forEach(ermKey => {
      const erm = ermData[ermKey];
      if (erm && erm.id && erm.a) {
        const parent = getNode(erm.a);
        const child = getNode(erm.id, erm.id.replace('ERM', 'erm:ERM'));
        parent.children.push(child);
      }
    });

    // Extract the top-level nodes (nodes that are not children of any other node)
    const topLevelNodes = Object.values(nodeMap).filter(node => {
      // Exclude nodes without children that are not ERMs
      if (node.children.length === 0 && !node.name.startsWith('erm:ERM')) {
        //console.log(node.id);
        return false;
      }

      // Check if the node is not a child of any other node
      const isNotChild = !Object.values(nodeMap).some(n => n.children.includes(node));

      return isNotChild;
    });

    return topLevelNodes;
  }

  // Function to create the indented list
  function createIndentedList(data) {
    const container = document.getElementById('indented-list');
    const ul = document.createElement('ul');
    container.appendChild(ul);

    const addedNodes = new Set();

    // Function to recursively create list items
    function createListItems(items, parentElement) {
      items.forEach(item => {
        if (!addedNodes.has(item.name)) {
          if (item.children.length > 0 || item.name.startsWith('erm:ERM')) {
            const li = document.createElement('li');
            const span = document.createElement('span');
            if (!item.name.startsWith('erm:ERM')) {
            span.textContent = `${item.name} (${item.id})`;
            }else{
              span.textContent = item.name;
            }
            

            if (item.children.length > 0) {
              span.classList.add('enmo-label'); // Apply bold styling to enmo labels
              const ermCount = item.children.filter(child => child.name.startsWith('erm:ERM')).length;
              if (ermCount > 0) {
                const countSpan = document.createElement('span');
                countSpan.textContent = ` (${ermCount} ERM(s))`;
                countSpan.style.color = '#888';
                span.appendChild(countSpan); // Append countSpan to enmo-label span
              }
            }

            li.appendChild(span);

            if (item.children.length > 0) {
              //console.log(item.id + ' has children');
              //console.log(item);
              const childUl = document.createElement('ul');
              li.appendChild(childUl);
              createListItems(item.children, childUl); // Recursively call for children
            }

            if (item.name.startsWith('erm:ERM')) {
              const ermName = item.name.replace('erm:ERM', 'erm/ERM');
              const ermLink = document.createElement('a');
              ermLink.href = `../substance/${ermName}`;
              ermLink.target = '_blank';
              ermLink.classList.add('erm-name');
              ermLink.textContent = item.name; // Display the ERM name as the link text
              li.appendChild(ermLink);
              li.style.display = 'none'; // Hide ERMs by default
            }

            parentElement.appendChild(li);
            addedNodes.add(item.name); // Mark this node as added
          }
        }
      });
    }

    createListItems(data, ul);

    // Event listener to toggle visibility of ERMs when clicking on enmo labels
    container.addEventListener('click', function(event) {
      const target = event.target;
      if (target.classList.contains('enmo-label')) {
        const ul = target.nextElementSibling; // Get the sibling ul
        if (ul) {
          const childElems = Array.from(ul.children);
          childElems.forEach(elem => {
            elem.style.display = elem.style.display === 'none' ? 'block' : 'none'; // Toggle display
          });
        }
      }
    });
  }

  // Fetch and process enmo and erm data using Jekyll's site.data
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const enmoData = {% assign enmo_data = site.data.enmo %} {{ enmo_data | jsonify }};
      const ermData = {% assign erm_data = site.data.erm %} {{ erm_data | jsonify }};
      const hierarchyData = buildHierarchy(enmoData, ermData);
      createIndentedList(hierarchyData);
    } catch (error) {
      console.error('Error fetching or parsing data:', error);
    }
  });
</script>
