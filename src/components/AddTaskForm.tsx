import React, { useState } from "react";

import styled from "styled-components";

import { getAIAdvice } from "../services/openai";

import { characters } from "../data/characters";

import { taskCategories } from "../data/characterTasks";

interface Props {
  characterId: string;

  onAdd: (title: string, description: string, dueDate: Date) => void;

  onClose: () => void;
}

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

  background: ${(props) => props.theme.background};

  color: ${(props) => props.theme.text};

  font-size: 1rem;

  transition: all 0.2s ease;

  &::placeholder {
    color: ${(props) => props.theme.text}88;
  }

  &:focus {
    outline: none;

    border-color: ${(props) => props.theme.accent};

    box-shadow: 0 0 0 2px ${(props) => props.theme.accent}33;
  }
`;

const TextArea = styled.textarea`
  width: 100%;

  padding: 12px 16px;

  margin: 8px 0;

  border: 1px solid ${(props) => props.theme.secondary}44;

  border-radius: 12px;

  background: ${(props) => props.theme.background};

  color: ${(props) => props.theme.text};

  font-size: 1rem;

  min-height: 100px;

  resize: vertical;

  &::placeholder {
    color: ${(props) => props.theme.text}88;
  }

  &:focus {
    outline: none;

    border-color: ${(props) => props.theme.accent};

    box-shadow: 0 0 0 2px ${(props) => props.theme.accent}33;
  }
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

const InspirationButton = styled(Button)`
  background: none;

  color: ${(props) => props.theme.accent};

  font-size: 1.5rem;

  padding: 5px;

  margin: 0;

  width: auto;

  position: absolute;

  right: 10px;

  top: 50%;

  transform: translateY(-50%);

  &:hover {
    color: ${(props) => props.theme.primary};

    transform: translateY(-50%) scale(1.1);
  }
`;

const InputContainer = styled.div`
  position: relative;

  width: 100%;
`;

const CategorySelect = styled.select`
  width: 100%;

  padding: 12px 16px;

  margin: 8px 0;

  border: 1px solid ${(props) => props.theme.secondary}44;

  border-radius: 12px;

  background: ${(props) => props.theme.background};

  color: ${(props) => props.theme.text};

  font-size: 1rem;

  option {
    background: ${(props) => props.theme.background};

    color: ${(props) => props.theme.text};

    padding: 8px;
  }

  appearance: none;

  background-image: ${(
    props
  ) => `linear-gradient(45deg, transparent 50%, ${props.theme.text} 50%),
    linear-gradient(135deg, ${props.theme.text} 50%, transparent 50%)`};

  background-position: calc(100% - 20px) calc(1em + 2px),
    calc(100% - 15px) calc(1em + 2px);

  background-size: 5px 5px, 5px 5px;

  background-repeat: no-repeat;
`;

const AddTaskForm: React.FC<Props> = ({ characterId, onAdd, onClose }) => {
  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [time, setTime] = useState("09:00");

  const [isLoading, setIsLoading] = useState(false);

  const [category, setCategory] = useState("general");

  const handleGetInspiration = async () => {
    if (title) {
      setIsLoading(true);

      try {
        const aiAdvice = await getAIAdvice(characterId, title);

        if (typeof aiAdvice === "object" && "type" in aiAdvice) {
          setDescription(aiAdvice.comment || "");

          if (aiAdvice.time) {
            setTime(aiAdvice.time.replace(/[APM]/g, "").trim());
          }
        } else {
          setDescription(aiAdvice);
        }
      } catch (error) {
        console.error("Error getting AI advice:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const [hours, minutes] = time.split(":").map(Number);

    const dueDate = new Date();

    dueDate.setHours(hours, minutes, 0, 0);

    onAdd(title, description, dueDate);

    onClose();
  };

  return (
    <Modal onClick={onClose}>
      <FormContainer onClick={(e) => e.stopPropagation()}>
        <FormTitle>Add New Activity</FormTitle>

        <form onSubmit={handleSubmit}>
          <InputContainer>
            <Input
              type="text"
              placeholder="Activity Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {title && (
              <InspirationButton
                type="button"
                onClick={handleGetInspiration}
                disabled={isLoading}
              >
                {isLoading ? "⌛" : "⚡"}
              </InspirationButton>
            )}
          </InputContainer>

          <CategorySelect
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {Object.entries(taskCategories).map(([id, cat]) => (
              <option key={id} value={id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </CategorySelect>

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
              Add Activity
            </Button>
          </ButtonContainer>
        </form>
      </FormContainer>
    </Modal>
  );
};

export default AddTaskForm;
