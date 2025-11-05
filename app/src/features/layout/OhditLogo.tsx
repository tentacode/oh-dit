import { colorRoles, colors } from "@/src/config/colors";

export default function OhditLogo({style}: {style?: React.CSSProperties}) {
    const mainColor = colorRoles.dark;
    const secondaryColor = colors.green;
    const fontFamily = "Lexend Deca, Lexend Deca Fallback, Arial, sans-serif";
    const fontSize = "32";
    const fontWeight = "700";

    return (
        <svg style={style} viewBox="5 14 108 27" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <g>
                <ellipse
                    cx="18"
                    cy="28"
                    rx="10"
                    ry="10"
                    fill={"transparent"}
                    stroke={mainColor}
                    strokeWidth="4"></ellipse>

                <path
                    fill={mainColor}
                    d="M 16.5 33.5 c -1.4 0.32 -4 9.84 -5.2 9.9 c -3.1 0.12 -6.86 -6.16 -7.94 -0.06 c -0.25 1.2 7.43 6.1 9.58 6.1 c 2.16 0 8.04 -13 7.42 -14.16 c -0.41 -0.63 -0.99 -1.13 -1.67 -1.45 c -0.68 -0.31 -1.44 -0.43 -2.19 -0.33 Z"
                    transform="translate(10, 1) scale(0.65)"></path>
            </g>

            <text
                x="31"
                y="40"
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                fill={mainColor}
            >
                h
            </text>
            <text
                x="51"
                y="40"
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                fill={secondaryColor}
            >
                !
            </text>
            <text
                x="61"
                y="40"
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                fill={mainColor}
            >
                dit
            </text>
            <text
                x="105"
                y="40"
                fontFamily={fontFamily}
                fontSize={fontSize}
                fontWeight={fontWeight}
                fill={secondaryColor}
            >
                '
            </text>
        </svg>
    );
}