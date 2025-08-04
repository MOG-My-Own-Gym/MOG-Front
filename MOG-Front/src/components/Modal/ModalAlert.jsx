import { useEffect } from 'react';
import { useModalAlert } from '../../context/ModalAlertContext';
import styles from './modal.module.css';
import { Button, Modal } from 'react-bootstrap';

export default function ModalAlert() {
  const { modalState, hideModal, handleConfirm } = useModalAlert();

  //모달이 열리면 body스크롤 잠금, 닫힐때 해제
  useEffect(() => {
    if (modalState.isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; //컴포넌트 언마운트 시 초기화
    };
  }, [modalState.isVisible]);

  //모달이 보이지 않을 때 렌더링 x
  if (!modalState.isVisible) {
    return null;
  }

  const isConfirm = modalState.type === 'confirm';

  return (
    <Modal
      show={modalState.isVisible}
      onHide={hideModal}
      centered
      backdrop="static"
      dialogClassName={styles['custom-modal-dialog']}
      contentClassName={styles['custom-modal-content']}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-xl font-semibold">{isConfirm ? '확인' : '알림'}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="text-start">{modalState.message}</p>
      </Modal.Body>

      <Modal.Footer>
        {isConfirm ? (
          <>
            <Button variant="secondary" onClick={() => handleConfirm(false)}>
              취소
            </Button>
            <Button variant="warning" onClick={() => handleConfirm(true)}>
              확인
            </Button>
          </>
        ) : (
          <Button variant="warning" onClick={hideModal}>
            확인
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}
