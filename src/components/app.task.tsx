'use client'

import { useState } from 'react';
import { Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHourglassHalf,
  faPenToSquare,
  faTrashCan,
  faCheck,
  faX
} from '@fortawesome/free-solid-svg-icons'
import { faCircleQuestion, faSquare, faSquareCheck } from '@fortawesome/free-regular-svg-icons'
import TooltipOverlay from "./app.tooltip";
import ModalConfirm from './task.modal';


function formatDate(inputDate: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  const [year, month, day] = inputDate.split('-');
  const formattedDate = new Date(`${year}-${month}-${day}`).toLocaleDateString('en-GB', options);

  return formattedDate;
}

interface IProps {
  task: ITask,
  changeStatusTask: (taskId: string) => void,
  isEditing: boolean,
  updateTaskContent: (taskId: string, content: string) => void,
  setTaskEditing: (taskId: string) => void
  deleteTask: (taskId: string) => void
}

export default function TaskItem(props: IProps) {
  const { task, changeStatusTask, isEditing, setTaskEditing, updateTaskContent, deleteTask } = props;

  const [updateData, setUpdateData] = useState<string>(task.content);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  return (
    <Row className="px-3 align-items-center rounded todo-item">
      <Col xs={'auto'} className="m-1 p-0 d-flex align-items-center">
        <h2 hidden={isEditing} className="m0 p-0" style={{ cursor: "pointer" }} onClick={() => changeStatusTask(task.id)}>
          <FontAwesomeIcon icon={task.isCompleted ? faSquareCheck : faSquare} className="text-primary m-0 p-0 check-icon" />
        </h2>
      </Col>

      <Col className="px-1 m-1 mb-3 d-flex align-items-center">
        <input
          type="text"
          // className="form-control form-control-lg border-0 bg-transparent rounded px-3"
          className={`${isEditing ? "" : "border-0 bg-transparent"} form-control form-control-lg rounded px-3`}
          disabled={!isEditing}
          style={{ fontSize: "1.3rem" }}
          value={updateData}
          onChange={(e) => setUpdateData(e.target.value)}
        />
      </Col>

      {/* due date display */}
      <Col xs={'auto'} className="m-1 p-0 px-3">
        {
          task.dueDate &&
          <Row>
            <Col xs={'auto'} className="d-flex align-items-center rounded bg-white border border-warning mb-3">
              <FontAwesomeIcon icon={faHourglassHalf} className="my-2 px-2 text-warning" size="lg" />
              <p className="my-2 pr-2" style={{ fontStyle: "initial", fontSize: "0.9rem" }}>{formatDate(task.dueDate)}</p>
            </Col>
          </Row>
        }
      </Col>

      {/* action */}
      <Col xs={'auto'} className={`m-1 pl-3 todo-action ${isEditing ? "" : "action-hover"}`}>
        <Row className="d-flex align-items-center justify-content-end mb-3">
          {
            !isEditing ?
              <>
                <TooltipOverlay header="Added date" content={task.addedDate}>
                  <h5 className="m-2 px-0 text-muted">
                    <FontAwesomeIcon icon={faCircleQuestion} size="lg" />
                  </h5>
                </TooltipOverlay>
                <h5 className="m-2 px-0 text-success" onClick={() => { setTaskEditing(task.id) }}>
                  <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                </h5>
                <h5 className="m-2 px-0 text-danger" onClick={() => { setShowDeleteModal(true) }}>
                  <FontAwesomeIcon icon={faTrashCan} size="lg" />
                </h5>
              </>
              :
              <>
                <h5 className="m-2 px-0 text-primary" onClick={() => { updateTaskContent(task.id, updateData.trim()) }}>
                  <FontAwesomeIcon icon={faCheck} size="xl" />
                </h5>
                <h5 className="m-2 px-0 text-secondary" onClick={() => { setTaskEditing('') }}>
                  <FontAwesomeIcon icon={faX} size="lg" />
                </h5>
              </>
          }
          <ModalConfirm
            taskId={task.id}
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            deleteTask={deleteTask}
          />
        </Row>
      </Col>
    </Row>
  )
}
