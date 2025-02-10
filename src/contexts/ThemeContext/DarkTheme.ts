import type { Theme } from ".";

const theme: Theme = {
  //backgroundColor: "#121212",
  buttonColor: "#212124",
  errorPrimaryColor: "#ffffff",
  errorBackgroundColor: "#750E21",
  //fontFamily: "Quicksand_600SemiBold",
  levelColor: {
    textColor: "#121212",
    low: ["#22a06b", "#1f845a", "#216e4e", "#164b35"],
    medium: ["#b38600", "#946f00", "#7f5f01", "#533f04"],
    high: ["#e2483d", "#c9372c", "#ae2e24", "#5d1f1a"],
    neutral: ["#7789a2", "#63758d", "#536379", "#313944"],
  },
  neutralColor: "#4e576a",
  //primaryColor: "#E8E6E3",
  //secondaryColor: "#e8e8e8",
  //secondaryColor: "#818281",
  inactiveColor: "#999999",
  shadowColor: "rgb(0, 0, 0, 0.5)",
  statusBarStyle: "light",
  successColor: "#22a06b",
  dangerColor: "#d63031",
  fontFamily: {
    regular: "Quicksand_400Regular",
    semiBold: "Quicksand_600SemiBold",
  },
  //
  backgroundColor: "#121212",
  statusBarBackgroundColor: "#121212",
  primaryColor: "#E8E6E3",
  secondaryColor: "#818281",
  regularFontFamily: "Quicksand_400Regular",
  semiBoldFontFamily: "Quicksand_600SemiBold",
  surfaceColor: "#1B1E1F",
  color: {
    green: "gray",
    orange: "gray",
    blue: "gray",
    gray: "gray",
  },
};

export default theme;
