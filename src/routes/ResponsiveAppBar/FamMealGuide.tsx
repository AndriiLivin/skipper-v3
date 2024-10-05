import "./_f-m-g.scss";

export default function FamMealGuide() {
  return (
    <div id="f-m-g">
      <div>
        <img
          src={import.meta.env.BASE_URL + "/logo_meal_6.png"}
          className="logo"
          alt="logo"
          height={300}
        />
      </div>
      <h1>Fam.Meal.Guide</h1>
    </div>
  );
}
