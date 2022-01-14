import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, toDoState } from "../atoms";
import DraggableCard from "./DraggableCard";

const Board = styled.div`
  border: 3px solid white;
  box-sizing: border-box;
  background-color: ${(props) => props.theme.boardColor};
  padding: 10px 0px;
  min-width: 400px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
`;

const Area = styled.div<IAreaProps>`
  padding: 5px 5px;
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#1abc9c"
      : props.draggingFromThisWith
      ? "#148f77"
      : props.theme.boardColor};
  flex-grow: 1;
  transition: background-color 0.3s;
`;

const BoardTitle = styled.h1`
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  color: white;
  text-transform: uppercase;
  display: flex;
  margin: 0 auto;
  margin-bottom: 13px;
`;

const Form = styled.form`
  width: 100%;
  input {
    all: unset;
    padding: 0px;
    background-color: #fff;
    width: 400px;
    height: 30px;
  }
`;

interface IAreaProps {
  isDraggingOver: boolean;
  draggingFromThisWith: boolean;
}

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
}

interface IForm {
  toDo: string;
}

function ToDosBoard({ toDos, boardId }: IBoardProps) {
  const [toDoList, setToDos] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };
    setToDos((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
    });
    setValue("toDo", "");
  };
  localStorage.setItem(boardId, JSON.stringify(toDoList[boardId]));
  return (
    <Board>
      <BoardTitle>{`<${boardId}>`}</BoardTitle>
      {boardId === "To Do" ? (
        <Form onSubmit={handleSubmit(onValid)}>
          <input
            {...register("toDo", { required: true })}
            type="text"
            placeholder={`Add Task on ${boardId}`}
          />
        </Form>
      ) : null}

      <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
          <Area
            draggingFromThisWith={Boolean(snapshot.draggingFromThisWith)}
            isDraggingOver={snapshot.isDraggingOver}
            ref={magic.innerRef}
            {...magic.droppableProps}
          >
            {toDos.map((toDo, index) => (
              <DraggableCard
                key={toDo.id}
                toDoId={toDo.id}
                index={index}
                toDoText={toDo.text}
                boardId={boardId}
              />
            ))}
            {magic.placeholder}
          </Area>
        )}
      </Droppable>
    </Board>
  );
}

export default React.memo(ToDosBoard);
