import { useContext } from "react";
import StateContext from "../../context/StateProvider";
import { PiWarningOctagonFill } from "react-icons/pi";
import { SketchPicker } from "react-color";

const Theme = () => {
    
    const { chartTheme, setChartTheme, setTheme } = useContext(StateContext);

    const handleChangeComplete1 = (color) => {
        setChartTheme((prevState) => ({ ...prevState, primaryColor: color.hex }));
    };

    const handleChangeComplete2 = (color) => {
        setChartTheme((prevState) => ({ ...prevState, secondaryColor: color.hex }));
    };


    return (
        <div className="admin__settings__section__two__theme">
            <h1>Theme settings</h1>
            <div className="admin__settings__section__two__theme__alert">
            <PiWarningOctagonFill className="admin__settings__section__two__theme__alert__icon" />{" "}
            Theme color settings allows you to select different themes to
            suite your aesthetics.
            </div>
            <div className="admin__settings__section__two__theme__alert__select">
            <button
                className="admin__settings__section__two__theme__alert__button zero"
                onClick={() => setTheme("#00208a")}
            >
                Royal blue
            </button>
            <button
                className="admin__settings__section__two__theme__alert__button one"
                onClick={() => setTheme("#8b0000")}
            >
                Dark red
            </button>
            <button
                className="admin__settings__section__two__theme__alert__button two"
                onClick={() => setTheme("#b8860b")}
            >
                Dark golden rod
            </button>
            <button
                className="admin__settings__section__two__theme__alert__button three"
                onClick={() => setTheme("#228b22")}
            >
                Forest green
            </button>
            <button
                className="admin__settings__section__two__theme__alert__button four"
                onClick={() => setTheme("#000000")}
            >
                black
            </button>
            <button
                className="admin__settings__section__two__theme__alert__button five"
                onClick={() => setTheme("#7a5af5")}
            >
                purple
            </button>
            </div>

            <div className="admin__settings__section__two__theme__alert__chart">
            <h1>Chart color scheme</h1>
            <article>
                <div>
                <SketchPicker
                    color={chartTheme.primaryColor}
                    onChangeComplete={handleChangeComplete1}
                />
                <h3>Primary chart color</h3>
                </div>
                <div>
                <SketchPicker
                    color={chartTheme.secondaryColor}
                    onChangeComplete={handleChangeComplete2}
                />
                <h3>Secondary chart color</h3>
                </div>
            </article>
            </div>
        </div>
    );
}

export default Theme;