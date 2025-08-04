import { Image, ListGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import styles from './ModalSuggest.module.css';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../pages/Login/AuthContext';
import { URL } from '../../config/constants';
import ModalAlert from './ModalAlert';
import { useModalAlert } from '../../context/ModalAlertContext';

export default function ModalSuggest({ show, onHide, routineName, routineContent, addRoutine }) {
  useEffect(() => {
    if (show) {
      document.documentElement.style.setProperty('overflow-y', 'hidden', 'important');
    } else {
      document.documentElement.style.setProperty('overflow-y', 'auto', 'important');
    }
  }, [show]);

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName={styles['custom-modal-wrapper']}
        contentClassName={styles['custom-modal']}
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">루틴 상세</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{routineName}</h4>

          <ListGroup>
            {routineContent.map(item => {
              return (
                <ListGroup.Item className={styles['exercise-list-item']}>
                  <Image
                    style={{ width: '200px', height: '133px' }}
                    src={`https://raw.githubusercontent.com/kimbongkum/ict4e/master/exercises/${item.name.replaceAll(' ', '_').replaceAll('/', '_')}/images/0.jpg`}
                    rounded
                  />
                  <div>{item.name}</div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              addRoutine(routineName, routineContent);
            }}
          >
            루틴 추가
          </Button>
          <Button onClick={onHide} style={{ backgroundColor: '#696969ff', border: 'none' }}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
