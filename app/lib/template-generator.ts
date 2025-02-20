import { Field } from "@prisma/client";

export class TemplateGenerator {
  static generateHTML(fields: Field[]) {
    let htmlContent = `
      <div class="custom-template-fields">
    `;

    fields.forEach((field) => {
      switch (field.type) {
        case "TEXT":
          htmlContent += `
            <div class="product-form__input" style="margin-top: 1.5rem;">
              <label class="form__label" for="pod-${field.name.replaceAll(" ", "-")}">
                ${field.label}
              </label>
              <input
                type="text"
                id="pod-${field.name.replaceAll(" ", "-")}"
                name="properties[${field.name}]"
                placeholder="Enter your personalization here"
                style="width: 100%; min-height: 4.5rem; padding: 0 1.5rem; border: 1px solid rgba(var(--color-foreground), 0.75);"
                value="${field.defaultValue ?? ''}"
              />
            </div>`;
          break;
        case "TEXTAREA":
          htmlContent += `
            <div class="product-form__input" style="margin-top: 1.5rem;">
              <label class="form__label" for="pod-${field.name.replaceAll(" ", "-")}">
                ${field.label}
              </label>
              <textarea
                id="pod-${field.name.replaceAll(" ", "-")}"
                name="properties[${field.name}]"
                placeholder="Enter your personalization here"
                style="width: 100%; min-height: 4.5rem; padding: 0 1.5rem; border: 1px solid rgba(var(--color-foreground), 0.75);"
                rows={3}
                value="${field.defaultValue ?? ''}"
              ></textarea>
            </div>`;
          break;
        case "DROPDOWN":
          htmlContent += `
          <div class="product-form__input" style="margin-top: 1.5rem;">
            <label class="form__label" for="pod-${field.name.replaceAll(" ", "-")}">
              ${field.label}
            </label>
            <select
              id="pod-${field.name.replaceAll(" ", "-")}"
              name="properties[${field.name}]"
              form="{formId}"
              placeholder="Enter your personalization here"
              style="width: 100%; min-height: 4.5rem; padding: 0 1.5rem; border: 1px solid rgba(var(--color-foreground), 0.75);"
              rows={3}
            >
              ${field.options?.split(",").map((s) => `<option value="${s}">${s}</option>`)}
            </select>
          </div>`;
          break;
      }
    });

    htmlContent += `</div>`;
    return htmlContent;
  }
}
