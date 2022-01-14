import { atom, selector } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "To Do": JSON.parse(localStorage.getItem("To Do") as string),
    doing: JSON.parse(localStorage.getItem("doing") as string),
    done: JSON.parse(localStorage.getItem("done") as string),
  },
});
