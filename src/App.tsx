import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import ToDosBoard from "./components/Board";

const Wrapper = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100vw;
  justify-content: center;
  align-items: flex-start;
  height: 100vh;
`;

const Boards = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 50%;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        return { ...allBoards, [source.droppableId]: boardCopy };
      });
    }
    if (destination?.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const targetBoard = [...allBoards[destination.droppableId]];
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];

        targetBoard.splice(destination.index, 0, taskObj);
        sourceBoard.splice(source.index, 1);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: targetBoard,
        };
      });
    }
    localStorage.setItem(destination.droppableId, JSON.stringify(toDos));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <div>
          <Boards>
            {Object.keys(toDos).map((boardId) => (
              <ToDosBoard
                toDos={toDos[boardId]}
                boardId={boardId}
                key={boardId}
              />
            ))}
          </Boards>
        </div>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
