import { products } from "@/features/products/data";
import type {
  HTMLInputAutoCompleteAttribute,
  HTMLInputTypeAttribute,
} from "react";

type FieldProps = {
  name: string;
  label: string;
  error?: string;
  required?: boolean;
  maxLength: number;
  autoComplete?: HTMLInputAutoCompleteAttribute;
  type?: HTMLInputTypeAttribute;
  full?: boolean;
  placeholder?: string;
};

function InputField({
  name,
  label,
  error,
  required = true,
  full,
  ...props
}: FieldProps) {
  return (
    <label className={full ? "field-full" : undefined}>
      {label}
      <input
        {...props}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span id={`${name}-error`} className="form-error">
          {error}
        </span>
      )}
    </label>
  );
}

type FieldsProps = {
  type: "wholesale" | "partner";
  initialProduct: string;
  errors: Record<string, string>;
  productError: string;
};

export function InquiryFields({
  type,
  initialProduct,
  errors,
  productError,
}: FieldsProps) {
  const wholesale = type === "wholesale";
  return (
    <>
      <fieldset className="inquiry-group">
        <legend>
          {wholesale ? "Your business" : "Tell us about yourself."}
        </legend>
        <div className="form-grid grid">
          <InputField
            name="company"
            label={wholesale ? "Company name" : "Organization (required)"}
            autoComplete="organization"
            maxLength={150}
            error={errors.company}
            full={wholesale}
          />
          {wholesale ? (
            <>
              <label>
                Business type
                <select
                  name="businessType"
                  required
                  defaultValue=""
                  aria-invalid={errors.businessType ? true : undefined}
                  aria-describedby={
                    errors.businessType ? "businessType-error" : undefined
                  }
                >
                  <option value="" disabled>
                    Choose a business type
                  </option>
                  <option>Distributor</option>
                  <option>Reseller</option>
                  <option>Retailer</option>
                  <option>Other</option>
                </select>
                {errors.businessType && (
                  <span id="businessType-error" className="form-error">
                    {errors.businessType}
                  </span>
                )}
              </label>
              <InputField
                name="territory"
                label="Territory or location"
                maxLength={150}
                error={errors.territory}
              />
              <InputField
                name="volume"
                label="Estimated monthly volume"
                maxLength={100}
                placeholder="For example, 100 packs"
                error={errors.volume}
                full
              />
            </>
          ) : (
            <>
              <InputField
                name="contact"
                label="Contact person (required)"
                autoComplete="name"
                maxLength={120}
                error={errors.contact}
              />
              <InputField
                name="email"
                label="Email address (required)"
                type="email"
                autoComplete="email"
                maxLength={254}
                error={errors.email}
              />
              <InputField
                name="businessType"
                label="Collaboration type (optional)"
                required={false}
                maxLength={80}
                placeholder="For example, media or brand"
                error={errors.businessType}
              />
            </>
          )}
        </div>
      </fieldset>
      {wholesale && (
        <>
          <fieldset className="inquiry-group">
            <legend>Your contact</legend>
            <div className="form-grid grid">
              <InputField
                name="contact"
                label="Contact person"
                autoComplete="name"
                maxLength={120}
                error={errors.contact}
                full
              />
              <InputField
                name="email"
                label="Email address"
                type="email"
                autoComplete="email"
                maxLength={254}
                error={errors.email}
              />
              <InputField
                name="phone"
                label="Phone or WhatsApp"
                type="tel"
                autoComplete="tel"
                maxLength={50}
                error={errors.phone}
              />
            </div>
          </fieldset>
          <fieldset
            className="product-choices inquiry-group"
            aria-describedby={`products-hint${productError ? " products-error" : ""}`}
          >
            <legend>Your products</legend>
            <p id="products-hint" className="field-hint">
              Products of interest. Choose at least one.
            </p>
            <div className="checkboxes">
              {products.map((product) => (
                <label key={product.slug}>
                  <input
                    type="checkbox"
                    name="products"
                    value={product.slug}
                    defaultChecked={product.slug === initialProduct}
                    aria-invalid={productError ? true : undefined}
                  />
                  {product.name}
                </label>
              ))}
            </div>
            {productError && (
              <p id="products-error" className="form-error" role="alert">
                {productError}
              </p>
            )}
          </fieldset>
        </>
      )}
      <label>
        Message{!wholesale && " (required)"}
        <textarea
          name="message"
          required
          maxLength={5000}
          rows={5}
          placeholder={
            wholesale
              ? "Tell us about what you’re looking for."
              : "Tell us about the collaboration you have in mind."
          }
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <span id="message-error" className="form-error">
            {errors.message}
          </span>
        )}
      </label>
      <div className="honey" aria-hidden="true">
        <label>
          Leave this field empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
    </>
  );
}
