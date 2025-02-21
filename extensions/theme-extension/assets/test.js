const rootEle = document.querySelector("product-personalization");
const tag = rootEle.getAttribute("product-tags")?.split(",");
const templateId = rootEle.getAttribute("template-id");
const sectionProduct = document.querySelector("product-info");
const sectionId = sectionProduct.id.replace("MainProduct-", "");
const form = document.querySelector('form[action="/cart/add"]');
const formId = form.getAttribute("id");
const API_URL = `http://localhost:8080/template/${templateId}`;

// Docs: https://klinkode.com/enhance-your-shopify-store-with-custom-text-fields-on-product-pages-a-step-by-step-guide/
const addToCartRoot = document.querySelector(".product-form__buttons");

async function addPersonalizeInput() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    const cloneElement = rootEle.cloneNode();

    if (data?.html) {
      cloneElement.innerHTML = data.html
        .replaceAll("{sectionId}", sectionId)
        .replaceAll("{formId}", formId);

      rootEle.remove();
      addToCartRoot.before(cloneElement);
    }
  } catch (error) {
    const pathname = window.location.href;
    if (!pathname.includes("admin.shopify.com")) {
      rootEle.innerHTML = "";
    }
    console.log("Error", error);
  }
}

addPersonalizeInput();
