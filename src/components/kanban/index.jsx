import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaFire } from "react-icons/fa";
import { useAuth } from '../../contexts/authContext';
import { firestore } from '../../firebase/firebase';
import { collection, doc, query, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { Box, Button, Input, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from '@chakra-ui/react';

import "./index.css"; // Import custom CSS for styling

export const CustomKanban = () => {
  return (
    <div className="kanban-container">
      <Board />
    </div>
  );
};

const Board = () => {
  const { currentUser } = useAuth();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const fetchTasks = async () => {
        try {
          const userDoc = doc(firestore, "users", currentUser.email);
          const tasksCollection = collection(userDoc, "tasks");
          const tasksQuery = query(tasksCollection);
          const querySnapshot = await getDocs(tasksQuery);
          const tasksData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
          setCards(tasksData);
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      };

      fetchTasks();
    }
  }, [currentUser]);

  const handleCardUpdate = async (updatedCard) => {
    try {
      const userDoc = doc(firestore, "users", currentUser.email);
      const taskDoc = doc(userDoc, "tasks", updatedCard.id);
      await updateDoc(taskDoc, updatedCard);
      setCards(cards.map(card => card.id === updatedCard.id ? updatedCard : card));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column
        title="Backlog"
        column="Not Started"
        headingColor="text-neutral-500"
        cards={cards}
        setCards={setCards}
        handleCardUpdate={handleCardUpdate}
      />
      <Column
        title="TODO"
        column="todo"
        headingColor="text-yellow-200"
        cards={cards}
        setCards={setCards}
        handleCardUpdate={handleCardUpdate}
      />
      <Column
        title="In progress"
        column="In Progress"
        headingColor="text-blue-200"
        cards={cards}
        setCards={setCards}
        handleCardUpdate={handleCardUpdate}
      />
      <Column
        title="Complete"
        column="Completed"
        headingColor="text-emerald-200"
        cards={cards}
        setCards={setCards}
        handleCardUpdate={handleCardUpdate}
      />
      <BurnBarrel setCards={setCards} />
    </div>
  );
};

const Column = ({ title, headingColor, cards, column, setCards, handleCardUpdate }) => {
  const [active, setActive] = useState(false);

  const handleDragStart = (e, card) => {
    e.dataTransfer.setData("cardId", card.id);
  };

  const handleDragEnd = async (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    setActive(false);
    clearHighlights();

    const indicators = getIndicators();
    const { element } = getNearestIndicator(e, indicators);

    const before = element.dataset.before || "-1";

    if (before !== cardId) {
      let copy = [...cards];

      let cardToTransfer = copy.find((c) => c.id === cardId);
      if (!cardToTransfer) return;
      cardToTransfer = { ...cardToTransfer, status: column };

      copy = copy.filter((c) => c.id !== cardId);

      const moveToBack = before === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const insertAtIndex = copy.findIndex((el) => el.id === before);
        if (insertAtIndex === undefined) return;

        copy.splice(insertAtIndex, 0, cardToTransfer);
      }

      setCards(copy);
      await handleCardUpdate(cardToTransfer);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    highlightIndicator(e);

    setActive(true);
  };

  const clearHighlights = (els) => {
    const indicators = els || getIndicators();

    indicators.forEach((i) => {
      i.style.opacity = "0";
    });
  };

  const highlightIndicator = (e) => {
    const indicators = getIndicators();

    clearHighlights(indicators);

    const el = getNearestIndicator(e, indicators);

    el.element.style.opacity = "1";
  };

  const getNearestIndicator = (e, indicators) => {
    const DISTANCE_OFFSET = 50;

    const el = indicators.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();

        const offset = e.clientY - (box.top + DISTANCE_OFFSET);

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      }
    );

    return el;
  };

  const getIndicators = () => {
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
  };

  const handleDragLeave = () => {
    clearHighlights();
    setActive(false);
  };

  const filteredCards = cards.filter((c) => c.status === column);

  return (
    <div className="w-56 shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <h3 className={`font-medium ${headingColor}`}>{title}</h3>
        <span className="rounded text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDrop={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-full w-full transition-colors ${
          active ? "bg-neutral-800/50" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((c) => {
          return <Card key={c.id} {...c} handleDragStart={handleDragStart} />;
        })}
        <DropIndicator beforeId={null} column={column} />
        <AddCard column={column} setCards={setCards} />
      </div>
    </div>
  );
};

const Card = ({ name, id, status, handleDragStart }) => {
  return (
    <>
      <DropIndicator beforeId={id} column={status} />
      <motion.div
        layout
        layoutId={id}
        draggable="true"
        onDragStart={(e) => handleDragStart(e, { name, id, status })}
        className="cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
      >
        <p className="text-sm text-neutral-100">{name}</p>
      </motion.div>
    </>
  );
};

const DropIndicator = ({ beforeId, column }) => {
  return (
    <div
      data-before={beforeId || "-1"}
      data-column={column}
      className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
    />
  );
};

const BurnBarrel = ({ setCards }) => {
  const { currentUser } = useAuth();
  const [active, setActive] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
  };

  const handleDragEnd = async (e) => {
    const cardId = e.dataTransfer.getData("cardId");

    try {
      const userDoc = doc(firestore, "users", currentUser.email);
      const taskDoc = doc(userDoc, "tasks", cardId);
      await deleteDoc(taskDoc);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }

    setActive(false);
  };

  return (
    <div
      onDrop={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mt-10 grid h-56 w-56 shrink-0 place-content-center rounded border text-3xl ${
        active
          ? "border-red-800 bg-red-800/20 text-red-500"
          : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
      }`}
    >
      {active ? <FaFire className="animate-bounce" /> : <FiTrash />}
    </div>
  );
};

const AddCard = ({ column, setCards }) => {
  const { currentUser } = useAuth();
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState(column);
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim().length) return;

    const newCard = {
      name: text.trim(),
      description,
      priority,
      due_date: dueDate,
      status,
      id: Math.random().toString(),
    };

    try {
      const userDoc = doc(firestore, "users", currentUser.email);
      const tasksCollection = collection(userDoc, "tasks");
      const newTaskRef = await addDoc(tasksCollection, newCard);
      setCards((prev) => [...prev, { ...newCard, id: newTaskRef.id }]);
    } catch (error) {
      console.error('Error adding task:', error);
    }

    setAdding(false);
  };

  return (
    <>
      {adding ? (
        <motion.div className="kanban-modal">
          <Modal isOpen={adding} onClose={() => setAdding(false)} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New Task</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={handleSubmit}>
                  <Input
                    placeholder="Task Name"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    mb={3}
                  />
                  <Input
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    mb={3}
                  />
                  <Input
                    type="date"
                    placeholder="Due Date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    mb={3}
                  />
                  <Select
                    placeholder="Priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    mb={3}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Select>
                  <Select
                    placeholder="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    mb={3}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </Select>
                  <Button type="submit" colorScheme="blue" mr={3}>
                    Add Task
                  </Button>
                  <Button onClick={() => setAdding(false)}>Cancel</Button>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </motion.div>
      ) : (
        <motion.button
          layout
          onClick={() => setAdding(true)}
          className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
        >
          <span>Add card</span>
          <FiPlus />
        </motion.button>
      )}
    </>
  );
};

