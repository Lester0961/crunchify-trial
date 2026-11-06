const benefits = [
  {
    title: "Simple ingredients",
    description: "Each snack starts with a fruit or vegetable and coconut oil.",
  },
  {
    title: "No artificial sweeteners",
    description: "Flavor without artificial sweeteners.",
  },
  {
    title: "A range to enjoy",
    description:
      "Banana, jackfruit, apple and broccoli offer a variety of flavors.",
  },
];

export function StockBenefits() {
  return (
    <section className="shell benefits-section">
      <div className="section-heading">
        <div>
          <p className="section-kicker">Why stock Crunchify?</p>
          <h2>
            Good food.
            <br />
            Good company.
          </h2>
        </div>
        <p>
          Simple snacks with a satisfying crunch. A little something good for
          your customers.
        </p>
      </div>
      <div className="benefit-grid">
        {benefits.map((benefit) => (
          <article key={benefit.title}>
            <span className="benefit-mark" aria-hidden="true" />
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
