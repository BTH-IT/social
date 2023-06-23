export default {
  control: {
    backgroundColor: "#fff",
    fontSize: 16,
    fontWeight: 'normal',
    maxWidth: "100%",
  },
  "&multiLine": {
    control: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
      minHeight: 44,
    },
    highlighter: {
      padding: 9,
      border: "1px solid transparent",
    },
    input: {
      flex: "1",
      maxWidth: "100%",
      outline: "none",
      border: "none",
      borderRadius: "6px",
      fontSize: "1.6rem",
      color: "rgb(38, 38, 38)",
      fontWeight: 400,
      display: "block",
      padding: "10px",
    },
  },
  "&singleLine": {
    display: "inline-block",
    width: 180,
    highlighter: {
      padding: 1,
      border: "2px inset transparent",
    },
    input: {
      padding: 1,
      border: "2px inset",
    },
  },
  suggestions: {
    list: {
      backgroundColor: "white",
      border: "1px solid rgba(0,0,0,0.15)",
      fontSize: 16,
    },
    item: {
      padding: "5px 15px",
      borderBottom: "1px solid rgba(0,0,0,0.15)",
      "&focused": {
        backgroundColor: "#f1f5f9",
      },
    },
  },
};
