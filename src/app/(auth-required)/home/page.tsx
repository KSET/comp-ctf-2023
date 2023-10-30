export default function PageHome() {
  return (
    <div className="container flex-col items-center gap-2 pt-8">
      <h1 className="text-3xl font-bold">Zadatci</h1>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <article className="rounded-md border border-off-text bg-primary p-4">
          <h2>Zadatak 1</h2>

          <p>
            Kratki opis zadatka 1 CompCTF{"{"}0wo_j3_rj3senje{"}"}
          </p>

          <div>
            <button type="button">Otvori</button>
          </div>
        </article>
      </div>
    </div>
  );
}
