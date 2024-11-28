import React, { useState } from "react";
import styled from "styled-components";
import { Task } from "../types/types";

interface Props {
  task: Task;
  onEdit: (
    taskId: string,
    title: string,
    description: string,
    dueDate: Date
  ) => void;
  onClose: () => void;
}

// Reuse the styled components from AddTaskForm
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  background: ${(props) => props.theme.background}ee;
  padding: 2rem;
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(12px);
  border: 1px solid ${(props) => props.theme.secondary}22;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin: 8px 0;
  border: 1px solid ${(props) => props.theme.secondary}44;
  border-radius: 12px;
  background: ${(props) => props.theme.background}99;
  color: ${(props) => props.theme.text};
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.accent};
    box-shadow: 0 0 0 2px ${(props) => props.theme.accent}33;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 2px solid ${(props) => props.theme.accent};
  border-radius: 5px;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  min-height: 100px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button<{ isSubmit?: boolean }>`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background: ${(props) =>
    props.isSubmit ? props.theme.accent : props.theme.secondary};
  color: ${(props) => props.theme.text};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;

const FormTitle = styled.h2`
  color: ${(props) => props.theme.text};
  margin-bottom: 1.5rem;
`;

const EditTaskForm: React.FC<Props> = ({ task, onEdit, onClose }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [time, setTime] = useState(
    `${task.dueDate.getHours().toString().padStart(2, "0")}:${task.dueDate
      .getMinutes()
      .toString()
      .padStart(2, "0")}`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [hours, minutes] = time.split(":").map(Number);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(hours, minutes, 0, 0);

    onEdit(task.id, title, description, dueDate);
    onClose();
  };

  return (
    <Modal onClick={onClose}>
      <FormContainer onClick={(e) => e.stopPropagation()}>
        <FormTitle>Edit Activity</FormTitle>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Activity Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextArea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <ButtonContainer>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isSubmit>
              Save Changes
            </Button>
          </ButtonContainer>
        </form>
      </FormContainer>
    </Modal>
  );
};

export default EditTaskForm;
