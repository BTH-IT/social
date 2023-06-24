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