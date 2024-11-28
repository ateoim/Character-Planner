import React, { useState } from "react";
import styled from "styled-components";
import { Task } from "../types/types";
import {
  addToGoogleCalendar,
  handleAuthClick,
  RecurrenceOption,
} from "../services/googleCalendar";

const RecurrenceModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${(props) => props.theme.background};
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.accent};
  z-index: 1000;
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border-radius: 6px;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.text};
  border: 1px solid ${(props) => props.theme.accent};
`;

const Button = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.accent};
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  transition: all 0.2s ease;

  &:hover {
    color: ${(props) => props.theme.primary};
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ModalButton = styled(Button)`
  margin: 0 5px;
  padding: 8px 16px;
  background: ${(props) => props.theme.accent};
  color: ${(props) => props.theme.background};
  border-radius: 6px;

  &:hover {
    color: ${(props) => props.theme.background};
  }
`;

interface Props {
  task: Task;
  onSync: () => void;
}

const SyncButton: React.FC<Props> = ({ task, onSync }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceOption>("none");
  const [duration, setDuration] = useState(365);

  const handleSync = async () => {
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setIsSyncing(true);
    try {
      await handleAuthClick();
      await addToGoogleCalendar(task, recurrence, duration);
      onSync();
      setShowModal(false);
    } catch (error) {
      console.error("Sync error:", error);
      alert("Failed to sync with Google Calendar. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <Button onClick={handleSync} disabled={isSyncing}>
        {isSyncing ? "⌛" : "🔄"}
      </Button>

      {showModal && (
        <>
          <Backdrop onClick={() => setShowModal(false)} />
          <RecurrenceModal onClick={(e) => e.stopPropagation()}>
            <h3>Set Recurrence</h3>
            <Select
              value={recurrence}
              onChange={(e) =>
                setRecurrence(e.target.value as RecurrenceOption)
              }
            >
              <option value="none">One-time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </Select>

            {recurrence !== "none" && (
              <Select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
              >
                <option value="30">1 Month</option>
                <option value="90">3 Months</option>
                <option value="180">6 Months</option>
                <option value="365">1 Year</option>
                <option value="730">2 Years</option>
              </Select>
            )}

            <div>
              <ModalButton onClick={handleConfirm}>Confirm</ModalButton>
              <ModalButton onClick={() => setShowModal(false)}>
                Cancel
              </ModalButton>
            </div>
          </RecurrenceModal>
        </>
      )}
    </>
  );
};

export default SyncButton;
