import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const Card = styled.div<{ isDragging: boolean }>`
  position: relative;
  max-width: 384px;
  height: auto;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0,0,0,0.5)" : "none"};
  background-color: ${(props) =>
    props.isDragging ? "#f39c12" : props.theme.cardColor};
  border-radius: 5px;
  padding: 15px 5px;
  font-size: 20px;
  word-wrap: break-word;
  margin-bottom: 10px;
  p {
    width: 354px;
  }
  button {
    all: unset;
    position: absolute;
    top: 50%;
    right: 0px;
    font-size: 20px;
    cursor: pointer;
    display: block;
    width: 30px;
    height: auto;
    transform: translateY(-50%);
    text-align: center;
    font-weight: bold;
    &:hover {
      color: red;
    }
  }
`;

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
  boardId: string;
}

function DraggableCard({
  toDoId,
  toDoText,
  index,
  boardId,
}: IDraggableCardProps) {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDeleteToDo = () => {
    setToDos((allBoards) => {
      const boardCopy = [...allBoards[boardId]];
      boardCopy.splice(index, 1);
      return { ...allBoards, [boardId]: boardCopy };
    });
  };

  return (
    <Draggable key={index} draggableId={String(toDoId)} index={index}>
      {(magic, info) => (
        <Card
          isDragging={info.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          <p>{toDoText}</p>
          <button onClick={onDeleteToDo}>x</button>
        </Card>
      )}
    </Draggable>
  );
}
export default React.memo(DraggableCard);
