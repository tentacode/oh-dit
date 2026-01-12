import style from "../../../components/form/styles/radio_group.module.css";

export default function SeverityInput({
  value,
  onChange,
}: {
  value: "low" | "moderate" | "blocking";
  onChange: (value: "low" | "moderate" | "blocking") => void;
}) {
  return (
    <fieldset className={style.fieldset} style={{ maxWidth: "700px" }}>
      <legend>Impact pour l'utilisateur·ice</legend>
      <div>
        <label>
          <input
            type="radio"
            name="severity"
            value="low"
            checked={value === "low"}
            onChange={() => onChange("low")}
          />
          Mineur
        </label>
        <label>
          <input
            type="radio"
            name="severity"
            value="moderate"
            checked={value === "moderate"}
            onChange={() => onChange("moderate")}
          />
          Moyen
        </label>
        <label>
          <input
            type="radio"
            name="severity"
            value="blocking"
            checked={value === "blocking"}
            onChange={() => onChange("blocking")}
          />
          Bloquant
        </label>
      </div>
    </fieldset>
  );
}
