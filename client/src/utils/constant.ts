import merge from "lodash.merge";
import mentionsInputStyles from "./mentionsInputStyles";
import userApi from "../api/userApi";

export const SERVER = "https://bth-social-server.onrender.com/";

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

export async function fetchUserMentions(content: string) {
  if (content !== "") {
    const regex = /@\[.+?\]\(.+?\)/gm;
    const displayRegex = /@\[.+?\]/g;
    const idRegex = /\(.+?\)/g;
    const matches = content.match(regex);
    const arr: any[] = [];
    matches?.forEach((m: any) => {
      const id = m.match(idRegex)[0].replace("(", "").replace(")", "");
      const display = m
        .match(displayRegex)[0]
        .replace("@[", "")
        .replace("]", "");
      arr.push({ id: id, display: display });
    });
    const newComment = content.split(regex);
    let output = "";
    for (let i = 0; i < newComment.length; i++) {
      const c = newComment[i];
      if (i === newComment.length - 1) output += c;
      else {
        const { data } = await userApi.getUserIdByUsername(arr[i].display);
        output += c + `<a href="/${data}">@${arr[i].display}</a>`;
      }
    }
    return output;
  }
}