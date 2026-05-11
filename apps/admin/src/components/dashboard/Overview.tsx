type OverviewProps = {
  totalProducts: number;
  totalOrders: number;
};

export default function Overview({
  totalProducts,
  totalOrders,
}: OverviewProps) {
  const metrics = [
    {
      label: "Total products",
      value: totalProducts,
      backgroundColor: "bg-green-200"
    },
    {
      label: "Total orders",
      value: totalOrders,
      backgroundColor: "bg-indigo-200"
    },
  ];

  return (
    <section className="mb-8 flex gap-4" aria-label="Store metrics">
      {metrics.map((metric) => {

        return (
          <article
            key={metric.label}
            className={`rounded-lg w-90 border border-slate-200 p-5 shadow-sm ${metric.backgroundColor}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-slate-500">{metric.label}</p>
                <p className="mt-2 text-3xl font-semibold tracking-normal text-slate-700">
                  {metric.value}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
