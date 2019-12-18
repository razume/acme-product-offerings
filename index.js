/******************************************************************************************
 ** FUNCTION NAME: renderCards                                                           **
 ** DESCRIPTION: prints HTML DIVs for all products.                                      **
 ** PARAMS: prodsJSON -> array of products                                               **
 **         relOfferings -> array of all offerings associated with our array of products **
 **         prodsComps -> array of all companies that sell our product                   **
 ******************************************************************************************/

function renderCards(prodsJSON, relOfferings, prodsComps) {
  const productsEl = document.querySelector('#products');
  prodsJSON.forEach((product, idx) => {
    let newDiv = document.createElement('div');
    let newUl = document.createElement('ul');
    newDiv.className = 'product-card';
    newDiv.innerHTML = `
      <h2><a href="">${product.name.toUpperCase()}</a></h2>
      <div>${product.description}</div>
      <div>$${product.suggestedPrice.toFixed(2)}</div>
    `;
    productsEl.appendChild(newDiv);
    relOfferings[idx].forEach((offering, offeringIdx) => {
      newUl.innerHTML += `
      <li>Offered by: ${
        prodsComps[idx][offeringIdx][0].name
      } at $${offering.price.toFixed(2)}
      </li>
      `;
      newDiv.appendChild(newUl);
    });
  });
}

/******************************************************************************************
 ** FUNCTION NAME: fetchData                                                             **
 ** DESCRIPTION: uses fetch() and Promise.all() to gather all relevent data into easily  **
 **              accessible arrays.                                                      **
 ** PARAMS: none                                                                         **
 ******************************************************************************************/

async function fetchData() {
  const products = fetch(
    'https://acme-users-api-rev.herokuapp.com/api/products'
  );
  const offerings = fetch(
    'https://acme-users-api-rev.herokuapp.com/api/offerings'
  );
  const companies = fetch(
    'https://acme-users-api-rev.herokuapp.com/api/companies'
  );
  const response = await Promise.all([products, offerings, companies]);

  const productsResponse = response[0];
  const offeringsResponse = response[1];
  const companiesResponse = response[2];

  const productsJSON = await productsResponse.json();
  const offeringsJSON = await offeringsResponse.json();
  const companiesJSON = await companiesResponse.json();

  // retrieve the ids for all of the products
  const productIds = productsJSON.map(product => product.id);

  // retrieve all offerings of each product
  const releventOfferings = productIds.map(productId => {
    return offeringsJSON.filter(offering => offering.productId === productId);
  });

  // retrieve company objects for every product
  const productsCompanyIds = productsJSON.map((product, index) => {
    return releventOfferings[index].map(offering => offering.companyId);
  });
  const productsCompanies = productsCompanyIds.map(productCompanyIds => {
    return productCompanyIds.map(companyId => {
      return companiesJSON.filter(company => company.id === companyId);
    });
  });

  renderCards(productsJSON, releventOfferings, productsCompanies);
}

fetchData();

// function changePart() {
//   location.hash = 'product-card';
// }

// function displaySingle(product) {

// }

// window.addEventListener('hashchange', displaySingle);
