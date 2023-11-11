import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface IModalProps {
    taskId: string,
    showDeleteModal: boolean,
    setShowDeleteModal: (v: boolean) => void,
    deleteTask: (taskId: string) => void
}

export default function ModalConfirm(props: IModalProps) {
    const { taskId, showDeleteModal, setShowDeleteModal, deleteTask } = props;

    return (
        <>
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you wanna delete this task?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        No
                    </Button>
                    <Button variant="danger" onClick={() => {
                        deleteTask(taskId)
                        setShowDeleteModal(false)
                    }}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}