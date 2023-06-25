import merge from "lodash.merge";
import { io } from "socket.io-client";
import mentionsInputStyles from "./mentionsInputStyles";

export const SERVER = "http://localhost:8080/";

export const customStyle = merge({}, mentionsInputStyles, {
  input: {
    maxHeight: 108,
    maxWidth: 426,
    overflow: "auto",
  },
  highlighter: {
    maxHeight: 108,
    overflow: "hidden",
    maxWidth: 426,
    boxSizing: "border-box",
  },
});

export const customCreateStyle = merge({}, {
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
      padding: 0,
      border: "1px solid transparent",
      fontSize: 18,
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
}, {
  input: {
    maxHeight: "50vh",
    overflow: "auto",
  },
  highlighter: {
    maxHeight: "50vh",
    padding: 0,
    overflow: "hidden",
    boxSizing: "border-box",
  },
});