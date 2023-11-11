'use client'
import { useState, useEffect } from "react"

import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus,
  faListCheck,
  faArrowUpWideShort,
  faArrowDownShortWide,
} from '@fortawesome/free-solid-svg-icons'
import TaskItem from "@/components/app.task";
import { ToastContainer, toast } from 'react-toastify';

//constant type select box
enum Filter {
  All,
  Completed,
  Active,
  HasDueDate
}

const DUE_DATE = 'dueDate';
const ADDED_DATE = 'addedDate';

//get current date

function getCurrentDateTime() {
  const date = new Date();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
  const year = date.getFullYear();

  return `${hours}:${minutes}:${seconds} ${day} ${month} ${year}`;
}

//generate task id
function getTaskId(): string {
  const timestamp = new Date().getTime();
  const rand = Math.floor(Math.random() * 9999)
  return `${timestamp}-${rand}`;
}


//dummy data
const initTasks: ITask[] = [
  {
    id: getTaskId(),
    content: 'Complete project proposal',
    isCompleted: true,
    dueDate: '2023-11-15',
    addedDate: getCurrentDateTime(),
  },
  {
    id: getTaskId(),
    content: 'Prepare for meeting with client',
    isCompleted: false,
    dueDate: "",
    addedDate: getCurrentDateTime(),
  },
  {
    id: getTaskId(),
    content: 'Review and update documentation',
    isCompleted: true,
    dueDate: "",
    addedDate: getCurrentDateTime(),
  },
  {
    id: getTaskId(),
    content: 'Create presentation slides',
    isCompleted: false,
    dueDate: "",
    addedDate: getCurrentDateTime(),
  },
  {
    id: getTaskId(),
    content: 'Attend team brainstorming session',
    isCompleted: false,
    dueDate: '2023-11-23',
    addedDate: getCurrentDateTime(),
  }
]

export default function Home() {
  const [inputData, setInputData] = useState<string>('');
  const [inputDateString, setInputDateString] = useState<string>('');
  const [taskList, setTaskList] = useState<ITask[]>(initTasks);
  const [viewTaskList, setViewTaskList] = useState<ITask[]>([]);
  const [taskEditing, setTaskEditing] = useState<string>('');
  const [sortDesBtn, setSortDesBtn] = useState<boolean>(true);
  const [filterType, setFilterType] = useState<number>(Filter.All);
  const [sortType, setSortType] = useState<string>(ADDED_DATE);

  useEffect(() => {

    let filteredData = taskList;
    if (filterType === Filter.Completed) {
      filteredData = filteredData.filter(task => task.isCompleted)
    } else if (filterType === Filter.Active) {
      filteredData = filteredData.filter(task => !task.isCompleted)
    } else if (filterType === Filter.HasDueDate) {
      filteredData = filteredData.filter(task => task.dueDate)
    }

    filteredData.sort((a, b) => {
      if (a[sortType] == b[sortType]) {
        return a.id > b.id ? 1 : -1;
      }
      return !sortDesBtn ? (a[sortType] > b[sortType] ? 1 : -1) : (a[sortType] < b[sortType] ? 1 : -1)
    })

    setViewTaskList([...filteredData])
  }, [taskList, filterType, sortType, sortDesBtn])


  const changeStatusTask = (taskId: string) => {
    let check: boolean = false;
    setTaskList(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          if (!task.isCompleted) {
            check = true;
          }
          return { ...task, isCompleted: !task.isCompleted }
        }
        return task
      }))
    if (check) toast.success("Task completed!!")
  }

  const updateTaskContent = (taskId: string, content: string) => {
    setTaskEditing('');
    if (content === "") {
      return;
    }
    setTaskList(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, content: content } : task
      )
    )

    toast.success("Update successfully!!")
  }

  const deleteTask = (taskId: string) => {
    setTaskList(prev =>
      prev.filter(task => task.id !== taskId))
    toast("Delete successfully!!")
  }

  const handleAddTask = () => {
    if (inputData.trim() === "") return;
    let newTask: ITask = {
      id: getTaskId(),
      content: inputData.trim(),
      isCompleted: false,
      dueDate: inputDateString,
      addedDate: getCurrentDateTime()
    }

    toast.success("Add task successfully!!")
    setTaskList(prev => [...prev, newTask])
    setInputData('');
    setInputDateString('');
  }

  return (
    <Container className="bg-light rounded shadow mx-auto m-5 p-2">
      {/* App title */}
      <Row className="m-1 p-4">
        <Col>
          <div className="p-1 h1 text-primary text-center mx-auto d-flex align-items-center justify-content-center">
            <FontAwesomeIcon className="bg-primary text-white rounded p-2 mx-2" icon={faListCheck} />
            <span>My Todo App</span>
          </div>
        </Col>
      </Row>

      {/* create todo */}
      <Row className="m-1 p-3">
        <Col xs={11} className="mx-auto">
          <Row className="bg-white rounded shadow-sm p-2 align-items-center justify-content-center">
            <Col>
              <input
                className="form-control form-control-lg border-0 bg-transparent add-todo-input"
                type="text"
                placeholder="Add new task ..."
                value={inputData}
                onChange={e => setInputData(e.target.value)}
              />
            </Col>
            <Col xs={'auto'} className="m-0 px-2 d-flex align-items-center">
              <input
                type="date"
                className="bg-transparent border-0 add-due-date"
                value={inputDateString}
                onChange={e => setInputDateString(e.target.value)}
              />
            </Col>
            <Col xs={'auto'} className="m-0 px-0 mx-0 mr-2">
              <Button variant="primary" onClick={handleAddTask}>
                <span><FontAwesomeIcon icon={faPlus} size="xl" /></span>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <div className="p-2 mx-4 border-black-25 border-bottom"></div>

      {/* Filter - Sort*/}
      <Row className="m-1 p-3 px-5 justify-content-end">
        <Col xs={'auto'} className="d-flex align-items-center">
          <label className="my-2 pr-2 view-opt-label">Filter</label>
          <Form.Select
            onChange={(e) => setFilterType(parseInt(e.target.value, 10))}
            value={filterType}
            className="view-opt-form"
            size="sm">
            <option value={Filter.All}>All</option>
            <option value={Filter.Completed}>Completed</option>
            <option value={Filter.Active}>Active</option>
            <option value={Filter.HasDueDate}>Has due date</option>
          </Form.Select>
        </Col>
        <Col xs={'auto'} className="d-flex align-items-center px-1">
          <label className="my-2 pr-2 view-opt-label">Sort</label>
          <Form.Select
            onChange={e => setSortType(e.target.value)}
            value={sortType}
            className="view-opt-form"
            size="sm">
            <option value={ADDED_DATE}>Added date</option>
            <option value={DUE_DATE}>Due date</option>
          </Form.Select>
        </Col>
        <Col xs={'auto'} className="d-flex ps-1" style={{ width: '20px' }}>
          <button className="bg-transparent border-0" onClick={() => setSortDesBtn(!sortDesBtn)}>
            <FontAwesomeIcon icon={!sortDesBtn ? faArrowUpWideShort : faArrowDownShortWide} style={{ color: "#0fd6f0" }} size="lg" />
          </button>
        </Col>

      </Row>

      {/* Todo list */}
      <Row className="mx-1 ps-5 pe-2 pb-3 w-100">
        <Col className="mx-auto">
          {
            viewTaskList.map((task) => {
              return <TaskItem
                key={task.id}
                task={task}
                changeStatusTask={changeStatusTask}
                isEditing={task.id === taskEditing}
                setTaskEditing={setTaskEditing}
                updateTaskContent={updateTaskContent}
                deleteTask={deleteTask}
              />
            })
          }
        </Col>
      </Row>
      <ToastContainer />

    </Container>
  )
}
